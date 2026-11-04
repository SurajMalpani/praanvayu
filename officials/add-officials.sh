#!/usr/bin/env bash
# Run from the root of the Praanvayu repo. Creates a branch, wires in js/officials.js, commits.
set -euo pipefail
BRANCH="feature/local-officials-lookup"
HERE="$(cd "$(dirname "$0")" && pwd)"
[ -f index.html ] && [ -f js/act.js ] || { echo "Run this from the repo root."; exit 1; }
git checkout -b "$BRANCH"
cp "$HERE/js/officials.js" js/officials.js

python3 - <<'PY'
import re, pathlib
p = pathlib.Path('index.html'); s = p.read_text()
card = '''      <div class="card" id="officials">
        <div class="card-head">
          <h3>Find your local officials</h3>
          <p>Ward offices and control rooms that handle garbage pickup (ghanta gaadi), open burning and dust complaints. Search by pin code, area or city. Starting with Maharashtra.</p>
        </div>
        <div id="officialsFinder"></div>
      </div>

'''
assert 'id="officials"' not in s
s = s.replace('      <div class="lab-banner" id="volunteer">', card + '      <div class="lab-banner" id="volunteer">', 1)
s = s.replace('<a href="#report" data-jump="report">Report &amp; speak up</a>', '<a href="#report" data-jump="report">Report &amp; speak up</a>\n          <a href="#officials" data-jump="officials">Find your officials</a>', 1)
s = s.replace('<script src="js/act.js"></script>', '<script src="js/act.js"></script>\n  <script src="js/officials.js"></script>', 1)
p.write_text(s)
a = pathlib.Path('js/app.js'); t = a.read_text()
t = t.replace("report: 'act',", "report: 'act', officials: 'act',", 1)
a.write_text(t)
PY

cat >> styles.css <<'CSS'

/* ---------- local officials finder ---------- */
.off { border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; background: #FBFEFD; margin-top: 12px; }
.off h4 { font-size: 1.02rem; margin-bottom: .3em; }
.off a[href^="tel:"] { font-weight: 600; text-decoration: none; }
CSS

git add index.html styles.css js/app.js js/officials.js
git commit -m "Add local officials finder (Maharashtra ward offices and control rooms)"
echo "Done. Push with: git push -u origin $BRANCH"
