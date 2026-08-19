const os = require("os");
const fs = require("fs");

const BIN_DIR = "./bin";
const BINARY_NAME = "supdock";

function checkIfBinaryExists(binary) {
  const path = `${BIN_DIR}/${binary}`;
  return fs.existsSync(path);
}

function determinePlatformBinary(platform = os.type(), architecture = os.arch()) {
  const binaries = {
    Linux: {
      arm64: `${BINARY_NAME}-aarch64-linux`,
      x64: `${BINARY_NAME}-amd64-linux`,
    },
    Darwin: {
      arm64: `${BINARY_NAME}-aarch64-macos`,
      x64: `${BINARY_NAME}-amd64-macos`,
    },
  };
  const binary = binaries[platform]?.[architecture];

  if (!binary) {
    throw new Error(`Unsupported platform: ${platform} ${architecture}`);
  }

  return binary;
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
  let binary;
  try {
    binary = determinePlatformBinary();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  if (!checkIfBinaryExists(binary)) {
    console.error(`Binary ${binary} not found, skipping...`);
    process.exit(1);
  }

  removeOtherBinaries(binary);
  prepareBinaryForSymLink(binary);
}

if (require.main === module) {
  main();
}

module.exports = { determinePlatformBinary };
