#!/bin/sh
set -eu

package_name="supdock"
default_install_dir="${HOME}/.local/bin"
install_dir="${1:-${default_install_dir}}"

if [ "$#" -gt 1 ]; then
  echo "Usage: install.sh [install-dir]" >&2
  exit 1
fi

case "$(uname -s)" in
  Linux*) os="linux" ;;
  Darwin*) os="darwin" ;;
  *)
    echo "Unsupported operating system: $(uname -s)" >&2
    exit 1
    ;;
esac

case "$(uname -m)" in
  x86_64*|amd64*) arch="amd64" ;;
  arm64*|aarch64*) arch="arm64" ;;
  *)
    echo "Unsupported architecture: $(uname -m)" >&2
    exit 1
    ;;
esac

binary_name="${package_name}-${os}-${arch}"
if [ -n "${SUPDOCK_VERSION:-}" ]; then
  release_url="https://github.com/segersniels/${package_name}/releases/download/${SUPDOCK_VERSION}"
else
  release_url="https://github.com/segersniels/${package_name}/releases/latest/download"
fi
download_url="${release_url}/${binary_name}"
target="${install_dir}/${package_name}"

mkdir -p "${install_dir}"
temporary_file="$(mktemp)"
trap 'rm -f "${temporary_file}"' EXIT HUP INT TERM

echo "Downloading ${binary_name} to ${target}..."
if command -v curl >/dev/null 2>&1; then
  curl -fsSL "${download_url}" -o "${temporary_file}"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "${temporary_file}" "${download_url}"
else
  echo "Error: curl or wget is required to download Supdock." >&2
  exit 1
fi

chmod +x "${temporary_file}"
mv "${temporary_file}" "${target}"
echo "Supdock is installed at ${target}"

if [ "${install_dir}" = "${default_install_dir}" ]; then
  case ":${PATH}:" in
    *":${install_dir}:"*) ;;
    *)
      echo ""
      echo "Note: ${install_dir} is not in your PATH."
      echo "Add this line to your shell configuration:"
      echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
      ;;
  esac
fi
