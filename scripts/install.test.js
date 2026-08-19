const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const installScript = path.join(__dirname, "install.sh");

function createFakeInstaller(t, system, machine) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "supdock-install-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const commands = path.join(root, "commands");
  const destination = path.join(root, "bin");
  const curlLog = path.join(root, "curl.log");
  fs.mkdirSync(commands);
  fs.writeFileSync(
    path.join(commands, "uname"),
    `#!/bin/sh\n[ "$1" = "-s" ] && echo ${system} || echo ${machine}\n`,
    { mode: 0o755 },
  );
  fs.writeFileSync(
    path.join(commands, "curl"),
    '#!/bin/sh\nprintf "%s\\n" "$@" > "$FAKE_CURL_LOG"\nwhile [ "$1" != "-o" ]; do shift; done\nprintf "supdock binary" > "$2"\n',
    { mode: 0o755 },
  );

  return { commands, curlLog, destination };
}

test("installs the latest release for each supported platform", async (t) => {
  const platforms = [
    ["Darwin", "arm64", "darwin-arm64"],
    ["Darwin", "x86_64", "darwin-amd64"],
    ["Linux", "aarch64", "linux-arm64"],
    ["Linux", "x86_64", "linux-amd64"],
  ];

  for (const [system, machine, asset] of platforms) {
    await t.test(asset, (t) => {
      const { commands, curlLog, destination } = createFakeInstaller(
        t,
        system,
        machine,
      );
      execFileSync("sh", [installScript, destination], {
        env: {
          ...process.env,
          FAKE_CURL_LOG: curlLog,
          SUPDOCK_VERSION: "",
          PATH: `${commands}:/usr/bin:/bin`,
        },
      });

      assert.match(
        fs.readFileSync(curlLog, "utf8"),
        new RegExp(`/releases/latest/download/supdock-${asset}`),
      );
      assert.equal(
        fs.readFileSync(path.join(destination, "supdock"), "utf8"),
        "supdock binary",
      );
      assert.notEqual(
        fs.statSync(path.join(destination, "supdock")).mode & 0o111,
        0,
      );
    });
  }
});

test("installs the matching npm release on Linux ARM64", (t) => {
  const { commands, curlLog, destination } = createFakeInstaller(
    t,
    "Linux",
    "aarch64",
  );

  execFileSync("sh", [installScript, destination], {
    env: {
      ...process.env,
      FAKE_CURL_LOG: curlLog,
      SUPDOCK_VERSION: "4.0.0",
      PATH: `${commands}:/usr/bin:/bin`,
    },
  });

  assert.equal(
    fs.readFileSync(curlLog, "utf8").includes(
      "https://github.com/segersniels/supdock/releases/download/4.0.0/supdock-linux-arm64",
    ),
    true,
  );
  assert.equal(fs.readFileSync(path.join(destination, "supdock"), "utf8"), "supdock binary");
});

test("npm package installs a runnable native command", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "supdock-npm-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const commands = path.join(root, "commands");
  const prefix = path.join(root, "prefix");
  const curlLog = path.join(root, "curl.log");
  fs.mkdirSync(commands);
  fs.writeFileSync(
    path.join(commands, "uname"),
    '#!/bin/sh\n[ "$1" = "-s" ] && echo Linux || echo x86_64\n',
    { mode: 0o755 },
  );
  fs.writeFileSync(
    path.join(commands, "curl"),
    '#!/bin/sh\nprintf "%s\\n" "$@" > "$FAKE_CURL_LOG"\nwhile [ "$1" != "-o" ]; do shift; done\nprintf "#!/bin/sh\\necho supdock-test\\n" > "$2"\n',
    { mode: 0o755 },
  );

  const packOutput = execFileSync(
    "npm",
    ["pack", "--json", "--pack-destination", root],
    { cwd: path.join(__dirname, ".."), encoding: "utf8" },
  );
  const tarball = path.join(root, JSON.parse(packOutput)[0].filename);

  execFileSync("npm", ["install", "--global", "--prefix", prefix, tarball], {
    env: {
      ...process.env,
      FAKE_CURL_LOG: curlLog,
      PATH: `${commands}:${process.env.PATH}`,
    },
  });

  assert.match(
    fs.readFileSync(curlLog, "utf8"),
    /\/releases\/download\/4\.0\.0\/supdock-linux-amd64/,
  );
  assert.equal(
    execFileSync(path.join(prefix, "bin", "supdock"), { encoding: "utf8" }),
    "supdock-test\n",
  );
});
