#!/bin/sh

set -ex

yarn prod
for fn in dist/*.map; do
  aws s3 cp "$fn" s3://iso8601.date/ --content-type 'application/json' --cache-control 'public'
done
aws s3 cp dist/main.*.css s3://iso8601.date/ --content-type 'text/css' --cache-control 'public, max-age=31556952, immutable'
aws s3 cp dist/main.*.js s3://iso8601.date/ --content-type 'application/javascript' --cache-control 'public, max-age=31556952, immutable'
aws s3 cp dist/workbox-*.js s3://iso8601.date/ --content-type 'application/javascript' --cache-control 'public, max-age=31556952, immutable'
aws s3 cp dist/main.*.txt s3://iso8601.date/ --content-type 'text/plain;charset=utf-8' --cache-control 'public, max-age=31556952, immutable'
aws s3 cp dist/manifest.*.webmanifest s3://iso8601.date/ --content-type 'application/manifest+json' --cache-control 'public, max-age=31556952, immutable'
aws s3 cp dist/service-worker.js s3://iso8601.date/ --content-type 'application/javascript' --cache-control 'public, max-age=3600'
aws s3 cp dist/index.html s3://iso8601.date/index.html --content-type 'text/html;charset=utf-8' --cache-control 'public, max-age=3600'
aws cloudfront create-invalidation --distribution-id E3JFZA7H0VLW59 --paths / /index.html /service-worker.js
