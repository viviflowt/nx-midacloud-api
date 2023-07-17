#!/bin/bash

# rm -rf dist 2>/dev/null
rm -rf generated 2>/dev/null

git fetch --all

git add .
git commit -m "update" --allow-empty --no-verify

git push

# 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
# viviflowt
# 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
# https://github.com/viviflowt/nx-mida-sandbox
# refs/heads/develop
# ci/midacloud.yml
