#!/bin/sh

docker run --rm \
  --volume="$PWD:/srv/jekyll:Z" \
  --publish 4000:4000 \
  jekyll/jekyll:3.8.6 \
  jekyll serve