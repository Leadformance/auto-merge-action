#!/bin/bash

#############################################
# Publish major tag on the latest release
#
# Usage:
# scripts/publish-major-tag.sh ${nextRelease.version} ${nextRelease.gitHead} ${nextRelease.channel}
#############################################

RELEASE_VERSION="$1"
RELEASE_GIT_HEAD="$2"
RELEASE_CHANNEL="$3"

# Does not publish major tag if not on default channel
if [[ "${RELEASE_CHANNEL}" != '' ]]; then
  echo "Not default release channel, major tag not published"
  exit 0
fi

IFS='.' read -r MAJOR_VERSION rest <<< "${RELEASE_VERSION}"
TAG_NAME="v${MAJOR_VERSION}"

git tag -f "${TAG_NAME}" "${RELEASE_GIT_HEAD}"
git push origin "${TAG_NAME}"

echo "Major tag \"${TAG_NAME}\" published to \"${RELEASE_GIT_HEAD}\""
