const assert = require("node:assert/strict");
const test = require("node:test");

const { determinePlatformBinary } = require("./preinstall");

test("selects native release binaries", () => {
  assert.equal(
    determinePlatformBinary("Darwin", "arm64"),
    "supdock-aarch64-macos",
  );
  assert.equal(
    determinePlatformBinary("Darwin", "x64"),
    "supdock-amd64-macos",
  );
  assert.equal(
    determinePlatformBinary("Linux", "arm64"),
    "supdock-aarch64-linux",
  );
  assert.equal(
    determinePlatformBinary("Linux", "x64"),
    "supdock-amd64-linux",
  );
});
