#!/usr/bin/env python3
"""Run from the NCSNCF-FE repository root. Makes backups and changes only hub-related files."""
from pathlib import Path
import shutil
root=Path.cwd()
if not (root/'_includes/themes/minima/header.html').is_file():
    raise SystemExit('Run this from ~/NCSNCF-FE (Minima header not found).')
src=Path(__file__).resolve().parent
mapping={
    'accessibility.html':'_includes/ncsncf/accessibility.html',
    'accessibility.js':'assets/js/ncsncf-accessibility.js',
    'accessibility.css':'assets/css/ncsncf-accessibility-hub.css',
}
for source,destination in mapping.items():
    target=root/destination
    target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists():
        shutil.copy2(target,target.with_name(target.name+'.before-hub.bak'))
    shutil.copy2(src/source,target)
    print('Installed',destination)
header=root/'_includes/themes/minima/header.html'
text=header.read_text()
css='<link rel="stylesheet" href="{{ \'/assets/css/ncsncf-accessibility-hub.css\' | relative_url }}">'
if 'ncsncf-accessibility-hub.css' not in text:
    shutil.copy2(header,header.with_name(header.name+'.before-hub.bak'))
    header.write_text(css+'\n'+text)
    print('Connected hub stylesheet to Minima header')
else:print('Hub stylesheet already connected')
if 'data-open-accessibility' not in text or '{% include ncsncf/accessibility.html %}' not in text or 'ncsncf-accessibility.js' not in text:
    print('IMPORTANT: verify the Minima header still has the Settings button, HTML include, and JS script.')
print('Done. Refresh http://localhost:4500 with Ctrl+Shift+R.')
