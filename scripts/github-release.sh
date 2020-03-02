#!/usr/bin/env bash
if [ "${CIRCLE_BRANCH}" = "beta" ]; then
  echo "Not creating a Github release on beta branch"
else
  wget https://github.com/tcnksm/ghr/releases/download/v0.12.1/ghr_v0.12.1_linux_amd64.tar.gz
  tar -xzvf ghr_v0.12.1_linux_amd64.tar.gz
  VERSION=$(./bin/supdock-linux --version | head -n1)
  ./ghr_v0.12.1_linux_amd64/ghr -u ${CIRCLE_PROJECT_USERNAME} -r ${CIRCLE_PROJECT_REPONAME} -c ${CIRCLE_SHA1} ${VERSION} bin/ || true
fi
