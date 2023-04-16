const os = require("os");
const fs = require("fs");
const path = require("path");
const { fetch } = require("undici");

let binaryName;
switch (os.platform()) {
  case "linux":
    if (os.arch() === "arm64") {
      binaryName = "supdock-aarch64-linux";
    } else {
      binaryName = "supdock-amd64-linux";
    }
    break;
  case "darwin":
    binaryName = "supdock-macos";
    break;
  default:
    console.error(`Unsupported platform: ${platform}`);
    process.exit(1);
}

(async () => {
  const response = await fetch(
    `https://github.com/segersniels/supdock/releases/latest/download/${binaryName}`,
    {
      redirect: "follow",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to download binary: ${response.status} ${response.statusText}`
    );
  }

  const binaryDirectory = path.join(__dirname, "..", "bin");
  const localBinaryPath = path.join(binaryDirectory, "supdock");

  // Create bin directory if it doesn't exist
  if (!fs.existsSync(binaryDirectory)) {
    fs.mkdirSync(binaryDirectory);
  }

  // Remove previously installed binary
  if (fs.existsSync(localBinaryPath)) {
    fs.unlinkSync(localBinaryPath);
  }

  const dest = fs.createWriteStream(localBinaryPath);
  const reader = response.body.getReader();

  const write = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        return fs.chmodSync(localBinaryPath, 0o755);
      }

      dest.write(Buffer.from(value));
      write();
    });
  };

  write();
})();
