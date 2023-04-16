#!/usr/bin/env bash

git log --oneline | grep :bookmark: |
  while read line; do
    version=$(echo $line | awk '{print $3}')
    hash=$(echo $line | awk '{print $1}')
    git tag -a $version $hash -m "${version}" -f 2>/dev/null
  done

git push --follow-tags
