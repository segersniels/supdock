const fs = require("fs");
const path = require("path");

const binaryDirectory = path.join(__dirname, "..", "bin");
const localBinaryPath = path.join(binaryDirectory, "supdock");

// Remove installed binary
if (fs.existsSync(localBinaryPath)) {
  fs.unlinkSync(localBinaryPath);
}
