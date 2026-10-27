#!/usr/bin/env bash
# Refresh the ?v= cache-busting tags on CSS/JS links after editing them.
# Browsers cache style.css/app.js for a while; a new tag forces them to load
# the version that matches the HTML. Run from the repo root before committing.
set -euo pipefail
cd "$(dirname "$0")/.."
v=$(cat style.css app.js | sha1sum | cut -c1-8)
l=$(cat legal.css legal.js | sha1sum | cut -c1-8)
sed -i -E "s#(href=\"style\.css)(\?v=[0-9a-f]+)?\"#\1?v=$v\"#; s#(src=\"app\.js)(\?v=[0-9a-f]+)?\"#\1?v=$v\"#" index.html
for f in privacy.html terms.html privacidade.html termos.html 404.html; do
  sed -i -E "s#(href=\"/legal\.css)(\?v=[0-9a-f]+)?\"#\1?v=$l\"#; s#(src=\"/legal\.js)(\?v=[0-9a-f]+)?\"#\1?v=$l\"#" "$f"
done
echo "style.css/app.js -> v=$v, legal.css/legal.js -> v=$l"
