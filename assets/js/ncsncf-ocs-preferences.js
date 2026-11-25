/* OCS preference experience adapted for the NCSNCF Jekyll + Flask architecture.
 * No webcam frames are transmitted or persisted by this script.
 * Original OCS reference: assets/js/user-preferences.js and
 * assets/js/pages/dashboard/preferences.js in Open Coding Society pages.
 */

(() => {
  'use strict';

  const KEY = 'ncsncfOCSPreferencesV1';

  const PRESETS = {
    'NCSNCF Default': {
      bg: '#ffffff',
      text: '#173b64',
      accent: '#247e83',
      selectionColor: '#ebf3f7'
    },
    Midnight: {bg:'#0b1220',text:'#e6eef8',accent:'#5392f7'},
    Light: {bg:'#ffffff',text:'#9d174d',accent:'#1759ea'},
    Green: {bg:'#154734',text:'#e6f6ef',accent:'#16eba4'},
    Sepia: {bg:'#f4ecd8',text:'#8b1e1e',accent:'#924307'},
    Cyberpunk: {bg:'#0a0a0f',text:'#f0f0f0',accent:'#f84396'},
    Ocean: {bg:'#0c1929',text:'#e0f2fe',accent:'#06b6d4'},
    Sunset: {bg:'#2a1433',text:'#fbe7d4',accent:'#ff7f6b'}
  };

  const LANGUAGES = {
    '':'English (Original)',
    es:'Spanish',
    fr:'French',
    de:'German',
    it:'Italian',
    pt:'Portuguese',
    ru:'Russian',
    'zh-CN':'Chinese (Simplified)',
    'zh-TW':'Chinese (Traditional)',
    ja:'Japanese',
    ko:'Korean',
    ar:'Arabic',
    hi:'Hindi',
    vi:'Vietnamese',
    th:'Thai',
    nl:'Dutch',
    pl:'Polish',
    tr:'Turkish',
    uk:'Ukrainian',
    he:'Hebrew',
    fa:'Persian (Farsi)'
  };

  const defaults = {
    enabled: false,
    ...PRESETS['NCSNCF Default'],
    font: 'system-ui, sans-serif',
    size: 17,
    buttonStyle: 'default',
    language: '',
    ttsVoice: '',
    ttsRate: 1,
    ttsPitch: 1,
    ttsVolume: 1,
    customThemes: {},
    nodSensitivity: 0.45
  };

  const root = document.documentElement;
  const clone = p => structuredClone(p);

  const validColor = s =>
    typeof s === 'string' && /^#[0-9a-f]{6}$/i.test(s);

  const has = (obj, key) =>
    Object.prototype.hasOwnProperty.call(obj, key);

  let mountedGrid = null;
  let mountedSection = 0;
  let contrastEl = null;
  let presetSelect = null;
  let enableCheckbox = null;

  let translateLoaded = false;
  let requestedLanguage = '';
  let translationObserver = null;
  let pendingOriginalReload = false;

  // =========================================================
  // SANITIZE PREFERENCES
  // =========================================================

  function sanitize(raw) {
    const p = clone(defaults);

    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return p;
    }

    p.enabled = raw.enabled === true;

    const legacyDefault =
      !p.enabled &&
      raw.bg?.toLowerCase?.() === '#ffffff' &&
      raw.text?.toLowerCase?.() === '#242124' &&
      raw.accent?.toLowerCase?.() === '#604140';

    for (const k of ['bg','text','accent','selectionColor']) {
      if (validColor(raw[k])) {
        p[k] = raw[k].toLowerCase();
      }
    }

    const fonts = [
      'system-ui, sans-serif',
      'Georgia, serif',
      'Verdana, Arial, sans-serif',
      'monospace'
    ];

    if (fonts.includes(raw.font)) {
      p.font = raw.font;
    }

    const shapes = ['default','square','pill'];

    if (shapes.includes(raw.buttonStyle)) {
      p.buttonStyle = raw.buttonStyle;
    }

    if (has(LANGUAGES, raw.language)) {
      p.language = raw.language;
    }

    if (raw.language === 'en') {
      p.language = '';
    }

    if (typeof raw.ttsVoice === 'string') {
      p.ttsVoice = raw.ttsVoice.slice(0,200);
    }

    for (const [k,min,max] of [
      ['size',12,24],
      ['ttsRate',0.5,2],
      ['ttsPitch',0.5,2],
      ['ttsVolume',0,1],
      ['nodSensitivity',0.1,0.9]
    ]) {
      const n = Number(raw[k]);

      if (Number.isFinite(n) && n >= min && n <= max) {
        p[k] = n;
      }
    }

    if (
      raw.customThemes &&
      typeof raw.customThemes === 'object' &&
      !Array.isArray(raw.customThemes)
    ) {
      for (const [name,theme] of
        Object.entries(raw.customThemes).slice(0,24)
      ) {
        if (
          typeof name === 'string' &&
          name.length <= 40 &&
          !['__proto__','constructor','prototype'].includes(name) &&
          validColor(theme?.bg) &&
          validColor(theme?.text) &&
          validColor(theme?.accent)
        ) {
          p.customThemes[name] = {
            bg: theme.bg,
            text: theme.text,
            accent: theme.accent,
            selectionColor: validColor(theme.selectionColor)
              ? theme.selectionColor
              : theme.accent
          };
        }
      }
    }

    if (legacyDefault) {
      Object.assign(p, PRESETS['NCSNCF Default']);
    }

    return p;
  }

  // =========================================================
  // LOCAL STORAGE
  // =========================================================

  function getLocal() {
    try {
      return sanitize(
        JSON.parse(localStorage.getItem(KEY) || '{}')
      );
    } catch {
      return clone(defaults);
    }
  }

  let saved = getLocal();
  let draft = clone(saved);

  function store() {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch (e) {
      console.warn('OCS local save unavailable', e);
    }
  }

  // =========================================================
  // GLOBAL OCS THEME APPLICATION
  // =========================================================

  function apply(p = draft) {
    root.classList.toggle(
      'ncsncf-ocs-preferences-active',
      p.enabled
    );

    for (const n of ['bg','text','accent','selectionColor']) {
      root.style.setProperty('--ocs-pref-' + n, p[n]);
    }

    root.style.setProperty('--ocs-pref-font', p.font);
    root.style.setProperty('--ocs-pref-size', p.size + 'px');

    root.dataset.ocsButtonStyle =
      p.enabled ? p.buttonStyle : 'default';

    const tokens = {
      '--pref-bg-color': p.bg,
      '--pref-text-color': p.text,
      '--pref-accent-color': p.accent,
      '--pref-font-family': p.font,
      '--pref-font-size': p.size + 'px',

      '--ncsncf-background': p.bg,
      '--ncsncf-text': p.text,
      '--ncsncf-accent': p.accent,
      '--ncsncf-links': p.accent
    };

    for (const [name,value] of Object.entries(tokens)) {
      if (p.enabled) {
        root.style.setProperty(name,value);
      } else {
        root.style.removeProperty(name);
      }
    }
  }

  function update(p) {
    draft = sanitize({...draft,...p});

    apply(draft);

    document.dispatchEvent(
      new Event('ncsncf-ocs-dirty')
    );
  }

  function refreshMountedSection() {
    if (mountedGrid?.isConnected) {
      mount(mountedGrid,mountedSection);
    }
  }

  function beginPreview() {
    draft = clone(saved);
    apply(draft);
    refreshMountedSection();
  }

  function cancelPreview() {
    draft = clone(saved);
    apply(draft);
    refreshMountedSection();
  }

  // =========================================================
  // SAVE PREFERENCES
  // =========================================================

  function commit() {
    saved = clone(draft);

    store();
    apply(saved);

    translate(saved.language, {
      reloadOriginal: false
    });

    return clone(saved);
  }

  // =========================================================
  // RESTORE DEFAULTS
  // =========================================================

  function resetPreview() {
    draft = {
      ...clone(defaults),
      language: '',
      customThemes: clone(saved.customThemes)
    };

    apply(draft);
    refreshMountedSection();

    document.dispatchEvent(
      new Event('ncsncf-ocs-dirty')
    );
  }

  function loadFromAccount(prefs) {
    saved = sanitize(prefs);
    draft = clone(saved);

    store();
    apply(saved);

    translate(saved.language, {
      reloadOriginal: false
    });

    refreshMountedSection();
  }

  function getSaved() {
    return clone(saved);
  }

  // =========================================================
  // ACCESSIBILITY CONTRAST
  // =========================================================

  function contrast(a,b) {
    const luminance = h => {
      const c = [1,3,5]
        .map(i => parseInt(h.slice(i,i+2),16)/255)
        .map(x =>
          x <= 0.04045
            ? x/12.92
            : ((x+0.055)/1.055)**2.4
        );

      return (
        0.2126*c[0] +
        0.7152*c[1] +
        0.0722*c[2]
      );
    };

    const l = [
      luminance(a),
      luminance(b)
    ].sort((x,y) => x-y);

    return (l[1]+0.05)/(l[0]+0.05);
  }

  // =========================================================
  // UI HELPERS
  // =========================================================

  function el(tag,opts={},text) {
    const n = document.createElement(tag);

    Object.assign(n,opts);

    if (text !== undefined) {
      n.textContent = text;
    }

    return n;
  }

  function field(label,control,desc) {
    const box = el('label',{
      className:'ocs-prefs-field'
    });

    box.append(
      el('strong',{},label),
      control
    );

    if (desc) {
      box.append(el('small',{},desc));
    }

    return box;
  }

  function select(label,options,value,change) {
    const s = el('select');

    for (const [v,name] of options) {
      s.append(el('option',{value:v},name));
    }

    s.value = value;

    s.addEventListener('change',() => {
      change(s.value);
    });

    return field(label,s);
  }

  function getActivePreset() {
    return Object.keys(PRESETS).find(name =>
      ['bg','text','accent'].every(key =>
        PRESETS[name][key].toLowerCase() ===
        draft[key].toLowerCase()
      )
    ) || 'Custom';
  }

  function refreshAppearanceControls() {
    if (presetSelect) {
      presetSelect.value = getActivePreset();
    }

    if (enableCheckbox) {
      enableCheckbox.checked = draft.enabled;
    }

    refreshContrast();
  }

  function color(label,key) {
    const i = el('input',{
      type:'color',
      value:draft[key]
    });

    i.addEventListener('input',() => {
      update({
        [key]:i.value,
        enabled:true
      });

      refreshAppearanceControls();
    });

    return field(label,i);
  }

  function refreshContrast() {
    if (!contrastEl) return;

    const c = contrast(draft.bg,draft.text);

    contrastEl.textContent =
      `Text contrast: ${c.toFixed(2)}:1 — ${
        c >= 4.5
          ? 'WCAG AA normal text'
          : 'below WCAG AA (4.5:1)'
      }`;

    contrastEl.dataset.ok = String(c >= 4.5);
  }

  // =========================================================
  // APPEARANCE SETTINGS
  // =========================================================

  function appearance(grid) {
    const presetField = select(
      'OCS preset theme',
      [
        ...Object.keys(PRESETS).map(n => [n,n]),
        ['Custom','Custom']
      ],
      getActivePreset(),
      name => {
        if (!has(PRESETS,name)) {
          refreshAppearanceControls();
          return;
        }

        if (name === 'NCSNCF Default') {
          update({
            ...PRESETS[name],
            enabled:false,
            font:defaults.font,
            size:defaults.size,
            buttonStyle:defaults.buttonStyle
          });
        } else {
          update({
            ...PRESETS[name],
            selectionColor:
              PRESETS[name].selectionColor ||
              PRESETS[name].accent,
            enabled:true
          });
        }

        mount(grid,0);
      }
    );

    presetSelect = presetField.querySelector('select');

    grid.append(presetField);

    grid.append(
      color('Background','bg'),
      color('Text','text'),
      color('Accent','accent'),
      color('Selection highlight','selectionColor')
    );

    grid.append(select(
      'Font',
      [
        ['system-ui, sans-serif','System'],
        ['Georgia, serif','Serif'],
        ['Verdana, Arial, sans-serif','Readable'],
        ['monospace','Monospace']
      ],
      draft.font,
      v => {
        update({
          font:v,
          enabled:true
        });

        refreshAppearanceControls();
      }
    ));

    grid.append(select(
      'Button shape',
      [
        ['default','Default'],
        ['square','Square'],
        ['pill','Pill']
      ],
      draft.buttonStyle,
      v => {
        update({
          buttonStyle:v,
          enabled:true
        });

        refreshAppearanceControls();
      }
    ));

    const size = el('input',{
      type:'range',
      min:12,
      max:24,
      step:1,
      value:draft.size
    });

    size.addEventListener('input',() => {
      update({
        size:Number(size.value),
        enabled:true
      });

      refreshAppearanceControls();
    });

    grid.append(
      field('Font size (12–24 px)',size)
    );

    contrastEl = el('p',{
      className:'ocs-prefs-contrast',
      role:'status'
    });

    grid.append(contrastEl);
    refreshContrast();

    const preview = el(
      'div',
      {className:'ocs-prefs-preview'},
      'Sample text and accessible links — your preferences apply across the website.'
    );

    grid.append(preview);

    enableCheckbox = el('input',{
      type:'checkbox',
      checked:draft.enabled
    });

    enableCheckbox.addEventListener('change',() => {
      update({
        enabled:enableCheckbox.checked
      });
    });

    grid.append(
      field(
        'Apply OCS appearance on the site',
        enableCheckbox
      )
    );

    // Saved custom themes

    const savedThemes = Object.keys(draft.customThemes);

    if (savedThemes.length) {
      grid.append(select(
        'My saved themes',
        [
          ['','Choose a theme'],
          ...savedThemes.map(n => [n,n])
        ],
        '',
        n => {
          if (n && has(draft.customThemes,n)) {
            update({
              enabled:true,
              ...draft.customThemes[n]
            });

            mount(grid,0);
          }
        }
      ));
    }

    const name = el('input',{
      type:'text',
      maxLength:40,
      placeholder:'Theme name',
      className:'ocs-prefs-name'
    });

    const add = el(
      'button',
      {
        type:'button',
        className:'ocs-prefs-action'
      },
      'Save named theme'
    );

    add.addEventListener('click',() => {
      const n = name.value.trim();

      if (
        !n ||
        ['__proto__','constructor','prototype'].includes(n)
      ) {
        return;
      }

      if (
        Object.keys(draft.customThemes).length >= 24 &&
        !has(draft.customThemes,n)
      ) {
        return;
      }

      update({
        customThemes:{
          ...draft.customThemes,
          [n]:{
            bg:draft.bg,
            text:draft.text,
            accent:draft.accent,
            selectionColor:draft.selectionColor
          }
        }
      });

      name.value = '';

      mount(grid,0);
    });

    const row = el('div',{
      className:'ocs-prefs-tools'
    });

    row.append(name,add);
    grid.append(row);

    grid.append(el(
      'p',
      {className:'ocs-prefs-note'},
      'Preview updates immediately. Save Preferences to apply your settings across all pages and sync your signed-in account.'
    ));
  }

  // =========================================================
  // GLOBAL GOOGLE TRANSLATE
  // =========================================================

  function clearTranslationCookies() {
    const paths = new Set([
      '/',
      '/NCSNCF-FE',
      '/NCSNCF-FE/'
    ]);

    const segments =
      location.pathname.split('/').filter(Boolean);

    let currentPath = '';

    for (const segment of segments) {
      currentPath += '/' + segment;

      paths.add(currentPath);
      paths.add(currentPath + '/');
    }

    const domains = new Set([
      '',
      location.hostname
    ]);

    for (const path of paths) {
      for (const domain of domains) {
        document.cookie =
          'googtrans=; Max-Age=0; ' +
          'Expires=Thu, 01 Jan 1970 00:00:00 GMT; ' +
          `path=${path}` +
          (domain ? `; domain=${domain}` : '');
      }
    }
  }

  function isTranslated() {
    return (
      root.classList.contains('translated-ltr') ||
      root.classList.contains('translated-rtl') ||
      /(?:^|;\s*)googtrans=\/en\/(?!en(?:;|$))[^;]+/
        .test(document.cookie)
    );
  }

  function stopTranslationObserver() {
    translationObserver?.disconnect();
    translationObserver = null;
  }

  function applyGoogleLanguage() {
    if (!requestedLanguage) return false;

    const combo =
      document.querySelector('.goog-te-combo');

    if (!combo) return false;

    const available = Array.from(combo.options).some(
      option => option.value === requestedLanguage
    );

    if (!available) return false;

    if (combo.value !== requestedLanguage) {
      combo.value = requestedLanguage;

      combo.dispatchEvent(
        new Event('change',{
          bubbles:true
        })
      );
    }

    return true;
  }

  // =========================================================
  // RESTORE ORIGINAL ENGLISH
  // =========================================================

  function restoreOriginalLanguage(
    {reloadOriginal=false}={}
  ) {
    const wasTranslated =
      isTranslated() || pendingOriginalReload;

    pendingOriginalReload = wasTranslated;
    requestedLanguage = '';

    stopTranslationObserver();

    const combo =
      document.querySelector('.goog-te-combo');

    if (combo) {
      const originalOption = Array.from(combo.options).find(
        option =>
          option.value === 'en' ||
          option.value === ''
      );

      if (originalOption) {
        combo.value = originalOption.value;

        combo.dispatchEvent(
          new Event('change',{
            bubbles:true
          })
        );
      }
    }

    clearTranslationCookies();

    root.lang = 'en';
    root.dataset.ocsLanguage = '';

    if (pendingOriginalReload && reloadOriginal) {
      pendingOriginalReload = false;

      location.reload();
    }

    return wasTranslated;
  }

  // =========================================================
  // APPLY SELECTED LANGUAGE
  // =========================================================

  function translate(
    lang,
    {reloadOriginal=false}={}
  ) {
    if (!lang || lang === 'en' || !has(LANGUAGES,lang)) {
      restoreOriginalLanguage({
        reloadOriginal
      });

      return;
    }

    pendingOriginalReload = false;
    requestedLanguage = lang;

    root.dataset.ocsLanguage = lang;

    clearTranslationCookies();

    document.cookie =
      `googtrans=/en/${encodeURIComponent(lang)};` +
      'path=/;SameSite=Lax';

    if (applyGoogleLanguage()) {
      return;
    }

    if (translateLoaded) {
      return;
    }

    translateLoaded = true;

    window.googleTranslateElementInit = () => {
      if (!requestedLanguage) {
        translateLoaded = false;
        return;
      }

      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage:'en',
            autoDisplay:false
          },
          'ocs_google_translate_element'
        );

        if (!applyGoogleLanguage()) {
          stopTranslationObserver();

          translationObserver =
            new MutationObserver(() => {
              if (applyGoogleLanguage()) {
                stopTranslationObserver();
              }
            });

          const target = document.getElementById(
            'ocs_google_translate_element'
          );

          if (target) {
            translationObserver.observe(target,{
              childList:true,
              subtree:true
            });
          }
        }
      }
    };

    let target = document.getElementById(
      'ocs_google_translate_element'
    );

    if (!target) {
      target = el('div',{
        id:'ocs_google_translate_element',
        hidden:true
      });

      document.body.append(target);
    }

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
      return;
    }

    const script = el('script',{
      src:
        'https://translate.google.com/translate_a/element.js' +
        '?cb=googleTranslateElementInit',
      async:true
    });

    script.onerror = () => {
      translateLoaded = false;

      script.remove();

      console.warn(
        'Google Translate could not be loaded.'
      );
    };

    document.head.append(script);
  }

  function finishLanguageSave() {
    translate(saved.language,{
      reloadOriginal:true
    });
  }

  // =========================================================
  // TEXT TO SPEECH
  // =========================================================

  function speak(text) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (!text.trim()) return;

    const msg = new SpeechSynthesisUtterance(text);

    const voice = window.speechSynthesis
      .getVoices()
      .find(v => v.name === draft.ttsVoice);

    if (voice) msg.voice = voice;

    msg.rate = draft.ttsRate;
    msg.pitch = draft.ttsPitch;
    msg.volume = draft.ttsVolume;

    window.speechSynthesis.speak(msg);
  }

  // =========================================================
  // LANGUAGE AND VOICE SETTINGS
  // =========================================================

  function voice(grid) {
    const languageField = select(
      'Language',
      Object.entries(LANGUAGES),
      draft.language,
      v => {
        update({language:v});
      }
    );

    languageField.classList.add('notranslate');

    languageField.setAttribute(
      'translate',
      'no'
    );

    grid.append(languageField);

    const voices = 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : [];

    grid.append(select(
      'Read-aloud voice',
      [
        ['','Browser default'],
        ...voices.map(v => [
          v.name,
          `${v.name} (${v.lang})`
        ])
      ],
      draft.ttsVoice,
      v => update({ttsVoice:v})
    ));

    for (const [key,label,min,max,step] of [
      ['ttsRate','Speech speed',0.5,2,0.1],
      ['ttsPitch','Speech pitch',0.5,2,0.1],
      ['ttsVolume','Speech volume',0,1,0.1]
    ]) {
      const slider = el('input',{
        type:'range',
        min,
        max,
        step,
        value:draft[key]
      });

      const note = el(
        'small',
        {},
        String(draft[key])
      );

      slider.addEventListener('input',() => {
        update({
          [key]:Number(slider.value)
        });

        note.textContent = slider.value;
      });

      const wrap = field(label,slider);

      wrap.append(note);

      grid.append(wrap);
    }

    const read = el(
      'button',
      {
        type:'button',
        className:'ocs-prefs-action'
      },
      'Read selected text'
    );

    read.addEventListener('click',() => {
      speak(
        window.getSelection()?.toString() ||
        'Select some text on the page and choose Read selected text.'
      );
    });

    const stop = el(
      'button',
      {
        type:'button',
        className:'ocs-prefs-action'
      },
      'Stop reading'
    );

    stop.addEventListener('click',() => {
      window.speechSynthesis?.cancel();
    });

    const actions = el('div',{
      className:'ocs-prefs-tools'
    });

    actions.append(read,stop);

    grid.append(actions);

    grid.append(el(
      'p',
      {className:'ocs-prefs-note'},
      'Language preferences apply across the website after saving. Select English (Original) to restore the original website language.'
    ));
  }

  // =========================================================
  // OCS HEAD TRACKING
  // =========================================================

  const tracking = {
    stream:null,
    video:null,
    model:null,
    cursor:null,
    raf:0,
    last:null,
    active:false,
    starting:false,
    generation:0,
    cal:null,
    error:''
  };

  function stopTracking() {
    tracking.active = false;
    tracking.starting = false;
    tracking.generation++;

    if (tracking.raf) {
      cancelAnimationFrame(tracking.raf);
    }

    tracking.raf = 0;

    if (tracking.stream) {
      tracking.stream.getTracks().forEach(t => t.stop());
      tracking.stream = null;
    }

    if (tracking.video) {
      tracking.video.pause();
      tracking.video.srcObject = null;
      tracking.video.remove();
      tracking.video = null;
    }

    tracking.model?.close?.();
    tracking.model = null;

    tracking.cursor?.remove();

    tracking.cursor = null;
    tracking.last = null;
    tracking.cal = null;
  }

  async function startTracking() {
    if (tracking.active || tracking.starting) return;

    tracking.error = '';

    if (!navigator.mediaDevices?.getUserMedia) {
      tracking.error =
        'Camera unavailable. Use HTTPS and a supported browser.';

      return;
    }

    tracking.starting = true;

    const generation = ++tracking.generation;

    try {
      const vision = await import(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm'
      );

      const fileset =
        await vision.FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );

      const model =
        await vision.FaceLandmarker.createFromOptions(
          fileset,
          {
            baseOptions:{
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
            },
            runningMode:'VIDEO',
            numFaces:1
          }
        );

      if (generation !== tracking.generation) {
        model.close?.();
        return;
      }

      tracking.model = model;

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video:{
            width:{ideal:640},
            height:{ideal:480},
            facingMode:'user'
          },
          audio:false
        });

      if (generation !== tracking.generation) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      tracking.stream = stream;

      tracking.video = el('video',{
        autoplay:true,
        muted:true,
        playsInline:true
      });

      tracking.video.className = 'ocs-head-video';
      tracking.video.srcObject = tracking.stream;

      document.body.append(tracking.video);

      await tracking.video.play();

      if (generation !== tracking.generation) {
        return;
      }

      tracking.cursor = el('div',{
        className:'ocs-head-cursor'
      });

      tracking.cursor.setAttribute(
        'aria-hidden',
        'true'
      );

      document.body.append(tracking.cursor);

      tracking.active = true;
      tracking.starting = false;
      tracking.last = null;
      tracking.cal = null;

      const tick = () => {
        if (!tracking.active) return;

        try {
          if (tracking.video.readyState >= 2) {
            const pts = tracking.model.detectForVideo(
              tracking.video,
              performance.now()
            )?.faceLandmarks?.[0];

            const nose = pts?.[1];

            if (nose) {
              const nx = 1-nose.x;
              const ny = nose.y;

              if (!tracking.cal) {
                tracking.cal = {
                  x:nx,
                  y:ny
                };
              }

              const dx = (nx-tracking.cal.x)*3;
              const dy = (ny-tracking.cal.y)*3;

              const x = Math.max(
                0,
                Math.min(
                  innerWidth-1,
                  innerWidth*(0.5+dx)
                )
              );

              const y = Math.max(
                0,
                Math.min(
                  innerHeight-1,
                  innerHeight*(0.5+dy)
                )
              );

              const alpha = draft.nodSensitivity;

              if (!tracking.last) {
                tracking.last = {x,y};
              } else {
                tracking.last.x +=
                  (x-tracking.last.x)*alpha;

                tracking.last.y +=
                  (y-tracking.last.y)*alpha;
              }

              tracking.cursor.style.transform =
                `translate(${tracking.last.x|0}px,${tracking.last.y|0}px)`;

              const target = document.elementFromPoint(
                tracking.last.x,
                tracking.last.y
              );

              const move = new MouseEvent('mousemove',{
                bubbles:true,
                clientX:tracking.last.x,
                clientY:tracking.last.y
              });

              target?.dispatchEvent(move);
            }
          }

          tracking.raf = requestAnimationFrame(tick);

        } catch (err) {
          tracking.error =
            err?.message ||
            'Head tracking stopped unexpectedly.';

          stopTracking();
        }
      };

      tracking.raf = requestAnimationFrame(tick);

    } catch (err) {
      if (generation === tracking.generation) {
        tracking.error =
          err?.message || 'Could not start tracking';

        stopTracking();
      }
    }
  }

  // =========================================================
  // HEAD TRACKING SETTINGS
  // =========================================================

  function head(grid) {
    grid.append(el(
      'p',
      {className:'ocs-prefs-note'},
      'Use head movement to position an on-screen cursor. Camera frames are processed locally. Click with a mouse, touchscreen, keyboard, or switch device. The camera is never started automatically.'
    ));

    const slider = el('input',{
      type:'range',
      min:0.1,
      max:0.9,
      step:0.05,
      value:draft.nodSensitivity
    });

    slider.addEventListener('input',() => {
      update({
        nodSensitivity:Number(slider.value)
      });
    });

    grid.append(
      field('Pointer sensitivity',slider)
    );

    const start = el(
      'button',
      {
        type:'button',
        className:'ocs-prefs-action'
      },
      'Start camera head pointer'
    );

    const stop = el(
      'button',
      {
        type:'button',
        className:'ocs-prefs-action'
      },
      'Stop camera'
    );

    const recenter = el(
      'button',
      {
        type:'button',
        className:'ocs-prefs-action'
      },
      'Recenter head pointer'
    );

    const status = el(
      'p',
      {
        className:'ocs-prefs-note',
        role:'status'
      },
      tracking.active
        ? 'Tracking active'
        : tracking.error || 'Camera is off'
    );

    start.addEventListener('click',async () => {
      status.textContent =
        'Requesting camera permission…';

      await startTracking();

      status.textContent = tracking.active
        ? 'Tracking active. Camera stays on until stopped or page closes.'
        : tracking.error || 'Camera could not start.';
    });

    stop.addEventListener('click',() => {
      stopTracking();

      status.textContent = 'Camera stopped';
    });

    recenter.addEventListener('click',() => {
      tracking.cal = null;

      status.textContent =
        'Head pointer recentered';
    });

    const tools = el('div',{
      className:'ocs-prefs-tools'
    });

    tools.append(start,stop,recenter);

    grid.append(tools,status);

    grid.append(el(
      'p',
      {className:'ocs-prefs-note'},
      'Note: This provides OCS-style head cursor tracking, not a nod-to-click action. On phones the camera and MediaPipe may be unavailable or slow.'
    ));
  }

  // =========================================================
  // MOUNT PREFERENCE SECTIONS
  // =========================================================

  function mount(grid,section) {
    mountedGrid = grid;
    mountedSection = section;

    grid.replaceChildren();

    grid.classList.add('ocs-prefs-grid');

    contrastEl = null;
    presetSelect = null;
    enableCheckbox = null;

    if (section === 0) appearance(grid);
    if (section === 1) voice(grid);
    if (section === 2) head(grid);
  }

  // =========================================================
  // GLOBAL WEBSITE SYNCHRONIZATION
  // =========================================================

  function synchronizePreferences() {
    saved = getLocal();
    draft = clone(saved);

    apply(saved);

    translate(saved.language,{
      reloadOriginal:true
    });

    refreshMountedSection();
  }

  // Synchronize changes across all open browser tabs.

  window.addEventListener('storage',event => {
    if (event.key !== KEY && event.key !== null) {
      return;
    }

    synchronizePreferences();
  });

  // Reapply preferences when returning to cached pages.

  window.addEventListener('pageshow',event => {
    if (event.persisted) {
      synchronizePreferences();
    }
  });

  // =========================================================
  // PUBLIC OCS PREFERENCES API
  // =========================================================

  window.NCSNCFOCS = {
    mount,
    apply,
    beginPreview,
    cancelPreview,
    commit,
    resetPreview,
    loadFromAccount,
    getSaved,
    stopTracking,
    finishLanguageSave,
    synchronizePreferences
  };

  // =========================================================
  // GLOBAL WEBSITE INITIALIZATION
  // =========================================================

  apply(saved);

  function initializeLanguage() {
    translate(saved.language,{
      reloadOriginal:true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initializeLanguage,
      {once:true}
    );
  } else {
    initializeLanguage();
  }

  // =========================================================
  // CLEANUP
  // =========================================================

  window.addEventListener('pagehide',() => {
    stopTracking();
    stopTranslationObserver();
  });

})();