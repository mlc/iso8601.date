#!/bin/sh

set -ex

yarn prod
aws s3 cp dist/*.css s3://iso8601.date/ --content-type 'text/css' --cache-control 'public, max-age=31556952, immutable'
aws s3 cp dist/*.js s3://iso8601.date/ --content-type 'application/javascript' --cache-control 'public, max-age=31556952, immutable'
aws s3 cp dist/*.txt s3://iso8601.date/ --content-type 'text/plain;charset=utf-8' --cache-control 'public, max-age=31556952, immutable'
aws s3 cp dist/index.html s3://iso8601.date/index.html --content-type 'text/html;charset=utf-8' --cache-control 'public, max-age=3600'
aws cloudfront create-invalidation --distribution-id E3JFZA7H0VLW59 --paths / /index.html
