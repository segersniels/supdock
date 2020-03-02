#!/usr/bin/env bash
VERSION=$(cat ~/supdock/package.json |grep version)
if [ "${CIRCLE_BRANCH}" = "master" ] && [[ "${VERSION}" == *"beta"* ]]; then
  echo "Trying to publish a beta release on master branch!"
  exit 1
fi

if [ "${CIRCLE_BRANCH}" = "beta" ] && ! [[ "${VERSION}" == *"beta"* ]]; then
  echo "Trying to publish a master release on beta branch!"
  exit 1
fi
