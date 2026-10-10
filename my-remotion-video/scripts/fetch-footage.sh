#!/bin/bash
# Downloads client source footage from GitHub Releases into public/ (kept out of git).
set -e
cd "$(dirname "$0")/.."
mkdir -p public/clients/abdullah-almashhor
curl -L -o public/clients/abdullah-almashhor/31.mp4 \
  https://github.com/learninghakim/bin-yahya/releases/download/abdullah-almashhor/31.mp4
