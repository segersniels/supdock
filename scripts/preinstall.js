const os = require("os");
const fs = require("fs");

const BIN_DIR = "./bin";
const BINARY_NAME = "supdock";

function checkIfBinaryExists(binary) {
  const path = `${BIN_DIR}/${binary}`;
  return fs.existsSync(path);
}

function determinePlatformBinary() {
  const platform = os.type();

  switch (platform) {
    case "Linux": {
      return os.arch() === "arm64"
        ? `${BINARY_NAME}-aarch64-linux`
        : `${BINARY_NAME}-amd64-linux`;
    }
    case "Darwin": {
      return `${BINARY_NAME}-macos`;
    }
    default: {
      console.error(`Unsupported platform: ${platform}`);
      process.exit(1);
    }
  }
}

function removeOtherBinaries(binary) {
  const files = fs.readdirSync(BIN_DIR);

  for (const file of files) {
    if (file === binary) {
      continue;
    }

    console.info(`Removing ${file}...`);
    fs.unlinkSync(`${BIN_DIR}/${file}`);
  }
}

function prepareBinaryForSymLink(binary) {
  console.info(`Renaming ${binary} to ${BINARY_NAME}...`);
  fs.renameSync(`${BIN_DIR}/${binary}`, `${BIN_DIR}/${BINARY_NAME}`);
}

function main() {
  const binary = determinePlatformBinary();

  if (!checkIfBinaryExists(binary)) {
    console.error(`Binary ${binary} not found, skipping...`);
    process.exit(1);
  }

  removeOtherBinaries(binary);
  prepareBinaryForSymLink(binary);
}

main();