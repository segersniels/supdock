#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Determine the correct binary based on platform and architecture
function getBinaryName() {
  const platform = os.platform();
  const arch = os.arch();
  
  if (platform === 'darwin') {
    return 'supdock-macos';
  } else if (platform === 'linux') {
    if (arch === 'arm64') {
      return 'supdock-aarch64-linux';
    } else {
      return 'supdock-amd64-linux';
    }
  }
  
  throw new Error(`Unsupported platform: ${platform} ${arch}`);
}

// Copy the correct binary to the bin directory
function setupBinary() {
  const binaryName = getBinaryName();
  const sourcePath = path.join(__dirname, '..', 'bin', binaryName);
  const targetPath = path.join(__dirname, '..', 'bin', 'supdock');
  
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Binary not found: ${sourcePath}`);
  }
  
  // Copy and make executable
  fs.copyFileSync(sourcePath, targetPath);
  fs.chmodSync(targetPath, '755');
  
  console.log(`✓ supdock binary ready for ${os.platform()} ${os.arch()}`);
}

try {
  setupBinary();
} catch (error) {
  console.error('Error setting up supdock binary:', error.message);
  process.exit(1);
}