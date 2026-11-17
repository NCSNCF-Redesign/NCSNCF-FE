NCSNCF Accessibility Hub
=======================
1. Extract this ZIP into any folder.
2. Open terminal in ~/NCSNCF-FE.
3. Run: python3 /path/to/extracted/ncsncf-accessibility-hub/install.py
4. Refresh http://localhost:4500 using Ctrl+Shift+R.

The installer replaces the old accessibility HTML and JS, adds an isolated CSS file,
and connects the CSS to the Minima header. Existing files get .before-hub.bak copies.
It does not change index.md, nav links, or event cards.

45 browser-based settings are provided across 8 categories. Some overlapping
settings intentionally act on the same CSS behavior. Preferences preview as you
change them and are saved only when Save Preferences is clicked.

Note: Settings cannot generate captions, screen-reader descriptions, or simplified
content. Some existing page inline styles may override browser-based preferences.
