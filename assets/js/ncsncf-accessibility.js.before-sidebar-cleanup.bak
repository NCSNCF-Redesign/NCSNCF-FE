
(() => {
  "use strict";

  const categories = [
    ["🎨 Theme & Colors", "Choose the original site appearance, light, dark, or your own colors.", []],
    [
      "Vision",
      "Adjust colors, text size, and visibility.",
      [
        ["largeText", "Larger text", "Increase the base text size."],
        ["extraLargeText", "Extra-large text", "Increase the base text size further."],
        ["smallText", "Smaller text", "Use a more compact base text size."],
        ["highContrast", "High contrast", "Use stronger black-and-white contrast."],
        ["darkMode", "Dark background", "Use a darker page background."],
        ["grayscale", "Grayscale", "Remove color from the page."],
        ["saturate", "Stronger colors", "Increase color saturation."],
        ["invert", "Invert colors", "Invert page colors."],
        ["zoom110", "Page zoom 110%", "Enlarge the page layout."],
        ["zoom125", "Page zoom 125%", "Enlarge the page layout further."]
      ]
    ],
    [
      "Reading",
      "Make written content easier to follow.",
      [
        ["underlineLinks", "Underline links", "Show link underlines."],
        ["boldLinks", "Bold links", "Emphasize linked text."],
        ["highlightLinks", "Outline links", "Add an outline around links."],
        ["readableFont", "Simple sans-serif font", "Use Verdana and Arial."],
        ["serifFont", "Serif font", "Use Georgia."],
        ["monoFont", "Monospace font", "Use fixed-width lettering."],
        ["lineSpacing", "Extra line spacing", "Increase line height."],
        ["letterSpacing", "Extra letter spacing", "Spread letters apart."],
        ["wordSpacing", "Extra word spacing", "Spread words apart."],
        ["leftAlign", "Left-align text", "Align headings and paragraphs left."],
        ["limitWidth", "Narrower reading lines", "Limit paragraph line length."]
      ]
    ],
    [
      "Focus & Attention",
      "Reduce visual distractions.",
      [
        ["hideImages", "Hide images", "Hide page images while retaining layout."],
        ["hideDecorations", "Remove shadows", "Remove decorative shadows."],
        ["hideBackgroundImages", "Remove background images", "Simplify visual backgrounds."],
        ["highlightHeadings", "Mark headings", "Add a colored line to headings."],
        ["highlightParagraphs", "Mark paragraphs", "Add a subtle reading guide."]
      ]
    ],
    [
      "Navigation",
      "Make interactive elements easier to find.",
      [
        ["largeCursor", "Crosshair cursor", "Use a distinctive pointer over the page."],
        ["strongFocus", "Strong keyboard focus", "Emphasize focused controls."],
        ["highlightButtons", "Outline buttons", "Make buttons stand out."],
        ["showSkipLink", "Keyboard navigation hint", "Show a navigation tip at page top."]
      ]
    ],
    [
      "Cognitive Support",
      "Simplify the page presentation.",
      [
        ["reducedTransparency", "Reduce transparency", "Remove header and navigation blur."],
        ["simpleLayout", "Simpler page backgrounds", "Remove background imagery."],
        ["readingGuide", "Paragraph guides", "Add visual guides beside paragraphs."],
        ["clearHeadings", "Heading markers", "Visually identify headings."]
      ]
    ],
    [
      "Forms & Inputs",
      "Make form controls easier to use.",
      [
        ["largeControls", "Larger controls", "Increase the minimum height of controls."],
        ["inputBorders", "Strong input borders", "Make input fields more visible."],
        ["formSpacing", "Extra form spacing", "Increase spacing around form fields."],
        ["formFocus", "Visible form focus", "Emphasize keyboard focus."]
      ]
    ],
    [
      "Motion & Media",
      "Reduce unwanted motion and effects.",
      [
        ["reduceMotion", "Reduce motion", "Minimize animations and transitions."],
        ["hideAnimations", "Hide embedded media", "Hide videos and embedded frames."],
        ["noBackgrounds", "No background imagery", "Remove decorative background images."],
        ["noShadows", "No visual shadows", "Remove box and text shadows."]
      ]
    ],
    [
      "Personal Preferences",
      "Fine-tune your preferred view.",
      [
        ["comfortableReading", "Comfortable reading", "Increase line spacing and limit line width."],
        ["minimalView", "Minimal view", "Remove shadows and background images."],
        ["emphasizeActions", "Emphasize actions", "Highlight links and buttons."],
        ["keyboardFriendly", "Keyboard-friendly focus", "Use stronger focus indicators."]
      ]
    ],
    ["OCS Appearance", "Full OCS presets, custom themes, font, and contrast preview.", []],
    ["OCS Language & Voice", "Translation and read-aloud settings.", []],
    ["OCS Head Tracking", "Optional camera-based head pointer and nod accessibility.", []]
  ];

  const aliases = {
    simpleLayout: ["hideBackgroundImages"],
    readingGuide: ["highlightParagraphs"],
    clearHeadings: ["highlightHeadings"],
    formFocus: ["strongFocus"],
    noBackgrounds: ["hideBackgroundImages"],
    noShadows: ["hideDecorations"],
    comfortableReading: ["lineSpacing", "limitWidth"],
    minimalView: ["hideDecorations", "hideBackgroundImages"],
    emphasizeActions: ["highlightLinks", "highlightButtons"],
    keyboardFriendly: ["strongFocus"]
  };

  const themeDefaults = { themeMode: "system", palette: "original", background: "#ffffff", surface: "#f3f0ee", text: "#242124", accent: "#604140", links: "#604140" };
  const palettes = {
    original: null,
    ocean: { background: "#f2f9ff", surface: "#dceeff", text: "#142c40", accent: "#146b99", links: "#075f96" },
    forest: { background: "#f4faf3", surface: "#e0efdd", text: "#203524", accent: "#386c42", links: "#285b38" },
    sunset: { background: "#fff7f1", surface: "#ffe9db", text: "#422820", accent: "#a34d37", links: "#93402b" },
    lavender: { background: "#f8f5ff", surface: "#ebe3fa", text: "#302440", accent: "#7252a4", links: "#634294" }
  };
  const themeStorageKey = "ncsncfThemeHubV1";
  const storageKey = "ncsncfAccessibilityHubV1";

  // Set window.NCSNCF_API_BASE_URL to the deployed Flask origin before this script.
  // Without it, settings continue to work locally but cannot sync across devices.
  const apiBase = typeof window.NCSNCF_API_BASE_URL === "string"
    ? window.NCSNCF_API_BASE_URL.replace(/\/$/, "")
    : (location.hostname === "localhost" || location.hostname === "127.0.0.1")
      ? "http://localhost:8460" : "https://ncsncf-api.opencodingsociety.com";
  const preferenceUrl = apiBase ? apiBase + "/api/user/preferences" : null;
  let preferencesEdited = false;
  document.addEventListener("ncsncf-ocs-dirty", () => { preferencesEdited = true; });
  let accountSyncAvailable = false;
  const syncEvent = "ncsncf-preferences-loaded";

  function saveLocal(theme, accessibility) {
    try {
      localStorage.setItem(themeStorageKey, JSON.stringify(theme));
      localStorage.setItem(storageKey, JSON.stringify(accessibility));
      return true;
    } catch (error) {
      console.warn("Accessibility Hub: local save failed", error);
      return false;
    }
  }

  async function loadAccountPreferences() {
    if (!preferenceUrl) return;
    try {
      const response = await fetch(preferenceUrl, { credentials: "include", cache: "no-store" });
      if (!response.ok) return; // Signed out, unavailable, or backend not yet migrated.
      accountSyncAvailable = true;
      const data = await response.json();
      const prefs = data && data.preferences;
      if (!prefs || typeof prefs !== "object" || Array.isArray(prefs)) return;
      // Do not overwrite changes made while the account request was in flight.
      if (preferencesEdited) return;
      const theme = prefs.theme;
      const accessibility = prefs.accessibility;
      if (!theme || typeof theme !== "object" || Array.isArray(theme) ||
          !accessibility || typeof accessibility !== "object" || Array.isArray(accessibility)) return;
      const safeTheme = { ...themeDefaults };
      for (const key of Object.keys(themeDefaults)) {
        if (typeof theme[key] === "string") safeTheme[key] = theme[key];
      }
      if (!["system", "light", "dark"].includes(safeTheme.themeMode)) safeTheme.themeMode = "system";
      if (![...Object.keys(palettes), "custom"].includes(safeTheme.palette)) safeTheme.palette = "original";
      const safeAccessibility = {};
      for (const [, , settings] of categories) {
        for (const [id] of settings) safeAccessibility[id] = accessibility[id] === true;
      }
      saveLocal(safeTheme, safeAccessibility);
      if (prefs.ocs && typeof prefs.ocs === "object" && !Array.isArray(prefs.ocs)) {
        window.NCSNCFOCS?.loadFromAccount(prefs.ocs);
      }
      restoreSitewidePreferences();
      document.dispatchEvent(new CustomEvent(syncEvent));
    } catch (error) {
      console.warn("Accessibility Hub: account preferences unavailable; using this device", error);
    }
  }

  async function saveAccountPreferences(theme, accessibility) {
    if (!preferenceUrl) return false;
    try {
      const response = await fetch(preferenceUrl, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: { theme, accessibility, ocs: window.NCSNCFOCS?.getSaved() || {} } })
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      accountSyncAvailable = true;
      return true;
    } catch (error) {
      console.warn("Accessibility Hub: account sync failed; preferences saved on this device", error);
      return false;
    }
  }


  // Restore preferences on EVERY page, including pages without the Settings dialog.
  // The hub below remains responsible for editing and saving those preferences.
  function restoreSitewidePreferences() {
    const root = document.documentElement;
    let theme = { ...themeDefaults };
    let saved = {};
    try {
      const rawTheme = JSON.parse(localStorage.getItem(themeStorageKey) || "{}");
      if (rawTheme && typeof rawTheme === "object" && !Array.isArray(rawTheme)) {
        for (const key of Object.keys(themeDefaults)) {
          if (typeof rawTheme[key] === "string") theme[key] = rawTheme[key];
        }
      }
      const rawSaved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (rawSaved && typeof rawSaved === "object" && !Array.isArray(rawSaved)) saved = rawSaved;
    } catch (error) {
      console.warn("Accessibility Hub: could not read saved preferences.", error);
    }

    const flags = {};
    for (const [id, enabled] of Object.entries(saved)) {
      if (enabled !== true) continue;
      for (const setting of aliases[id] || [id]) flags[setting] = true;
    }
    for (const [, , settings] of categories) {
      for (const [id] of settings) {
        const attribute = "data-a11y-" + id.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase());
        if (flags[id]) root.setAttribute(attribute, "true");
        else root.removeAttribute(attribute);
      }
    }

    // System Default deliberately leaves the original OCS theme untouched.
    if (theme.themeMode === "system") delete root.dataset.ncsncfTheme;
    else root.dataset.ncsncfTheme = theme.themeMode === "dark" ? "dark" : "light";
    root.dataset.ncsncfPalette = theme.palette;
    const colors = theme.palette === "custom" ? theme : palettes[theme.palette];
    for (const name of ["background", "surface", "text", "accent", "links"]) {
      if (colors && /^#[0-9a-f]{6}$/i.test(colors[name] || "")) {
        root.style.setProperty("--ncsncf-" + name, colors[name]);
      } else {
        root.style.removeProperty("--ncsncf-" + name);
      }
    }
    root.classList.toggle("ncsncf-theme-active", theme.palette !== "original" || theme.themeMode !== "system");
  }

  function initializeAccessibilityHub() {
    const dialog = document.getElementById("accessibilityDialog");

    if (!dialog || dialog.dataset.hubReady === "true") {
      return;
    }

    // Keep the modal outside theme wrappers that may clip or obscure it.
    if (dialog.parentElement !== document.body) document.body.appendChild(dialog);

    const tabs = document.getElementById("a11yCategories");
    const grid = document.getElementById("a11ySettings");
    const title = document.getElementById("a11ySectionTitle");
    const description = document.getElementById("a11ySectionDescription");
    const count = document.getElementById("a11yCount");

    const closeButton = document.getElementById("closeAccessibility");
    const saveButton = document.getElementById("saveAccessibility");
    const resetButton = document.getElementById("resetAccessibility");

    if (
      !tabs ||
      !grid ||
      !title ||
      !description ||
      !count ||
      !closeButton ||
      !saveButton ||
      !resetButton
    ) {
      console.warn("Accessibility Hub: required elements are missing.");
      return;
    }

    dialog.dataset.hubReady = "true";

    const allSettings = categories.flatMap(category => category[2]);

    const defaults = Object.fromEntries(
      allSettings.map(([id]) => [id, false])
    );

    function readSavedPreferences() {
      try {
        const stored = JSON.parse(
          localStorage.getItem(storageKey) || "{}"
        );

        if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
          return { ...defaults };
        }

        const result = { ...defaults };

        for (const id of Object.keys(defaults)) {
          result[id] = stored[id] === true;
        }

        return result;
      } catch (error) {
        return { ...defaults };
      }
    }

    function readTheme() {
      try {
        const stored = JSON.parse(localStorage.getItem(themeStorageKey) || "{}");
        return { ...themeDefaults, ...Object.fromEntries(Object.entries(stored).filter(([key, value]) => key in themeDefaults && typeof value === "string")) };
      } catch { return { ...themeDefaults }; }
    }
    let savedTheme = readTheme();
    let themeState = { ...savedTheme };
    function applyTheme() {
      const root = document.documentElement;
      const mode = themeState.themeMode;
      if (mode === "system") delete root.dataset.ncsncfTheme;
      else root.dataset.ncsncfTheme = mode;
      root.dataset.ncsncfPalette = themeState.palette;
      const colors = themeState.palette === "custom" ? themeState : palettes[themeState.palette];
      for (const name of ["background", "surface", "text", "accent", "links"]) {
        if (colors && /^#[0-9a-f]{6}$/i.test(colors[name] || "")) root.style.setProperty("--ncsncf-" + name, colors[name]);
        else root.style.removeProperty("--ncsncf-" + name);
      }
      // Explicitly disable the older dark-background toggle when theme mode is managed here.
      root.classList.toggle("ncsncf-theme-active", themeState.palette !== "original" || mode !== "system");
    }
    let saved = readSavedPreferences();
    let state = { ...saved };
    let activeCategory = 0;
    let shouldRestoreOnClose = true;

    count.textContent =
      `${allSettings.length} preferences • ${accountSyncAvailable ? "account connected" : "this device"}`;

    function applyPreferences() {
      const flags = {};

      for (const [id, enabled] of Object.entries(state)) {
        if (!enabled) continue;

        const affectedSettings = aliases[id] || [id];

        for (const setting of affectedSettings) {
          flags[setting] = true;
        }
      }

      for (const [id] of allSettings) {
        const attribute = "data-a11y-" +
          id.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase());

        if (flags[id]) {
          document.documentElement.setAttribute(attribute, "true");
        } else {
          document.documentElement.removeAttribute(attribute);
        }
      }

      applyTheme();
      window.NCSNCFOCS?.apply();

      // Remove old three-setting implementation attributes.
      ["highContrast", "underlineLinks", "reduceMotion"].forEach(id => {
        if (document.body) {
          delete document.body.dataset[id];
        }
      });
    }

    function createCategoryButton(name, index) {
      const button = document.createElement("button");

      button.type = "button";

      // Dedicated category button class to avoid theme conflicts.
      button.className = "a11y-tab";

      button.textContent = name;

      button.setAttribute(
        "aria-current",
        activeCategory === index ? "true" : "false"
      );

      button.setAttribute(
        "aria-selected",
        String(activeCategory === index)
      );

      button.addEventListener("click", () => {
        activeCategory = index;
        render();
      });

      return button;
    }

    function createSettingCard(id, label, helpText) {
      const card = document.createElement("label");

      // Dedicated setting card class to avoid theme conflicts.
      card.className = "a11y-setting ocs__grid-cell";

      const copy = document.createElement("span");
      copy.className = "a11y-setting-copy";

      const heading = document.createElement("strong");
      heading.textContent = label;

      const help = document.createElement("small");
      help.textContent = helpText;

      copy.append(heading, help);

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(state[id]);

      input.className = "a11y-toggle";

      input.setAttribute("aria-label", label);

      input.addEventListener("change", () => {
        state[id] = input.checked;
        preferencesEdited = true;
        applyPreferences();
      });

      card.append(copy, input);

      return card;
    }

    function createThemePanel() {
      const panel = document.createElement("div");
      panel.className = "a11y-theme-panel ocs__grid ocs__grid--card";
      const addSelect = (label, key, options) => {
        const field = document.createElement("label"); field.className = "a11y-theme-field ocs__grid-cell";
        const caption = document.createElement("strong"); caption.textContent = label;
        const select = document.createElement("select"); select.setAttribute("aria-label", label);
        for (const [value, text] of options) { const opt = document.createElement("option"); opt.value = value; opt.textContent = text; select.append(opt); }
        select.value = themeState[key];
        select.addEventListener("change", () => { themeState[key] = select.value; preferencesEdited = true; applyTheme(); render(); });
        field.append(caption, select); panel.append(field);
      };
      addSelect("Appearance", "themeMode", [["system","System Default (original site)"],["light","Light"],["dark","Dark"]]);
      addSelect("Color palette (choose Custom colors for individual pickers)", "palette", [["original","Original NCSNCF"],["ocean","Ocean blue"],["forest","Forest green"],["sunset","Warm sunset"],["lavender","Lavender"],["custom","Custom colors"]]);
      if (themeState.palette === "custom") {
        for (const [key, label] of [["background","Page background"],["surface","Cards and panels"],["text","Text color"],["accent","Accent / buttons"],["links","Links"]]) {
          const field = document.createElement("label"); field.className = "a11y-theme-field ocs__grid-cell";
          const caption = document.createElement("strong"); caption.textContent = label;
          const input = document.createElement("input"); input.type = "color"; input.value = themeState[key]; input.setAttribute("aria-label", label);
          const hex = document.createElement("span"); hex.textContent = themeState[key];
          input.addEventListener("input", () => { themeState[key] = input.value; preferencesEdited = true; hex.textContent = input.value; applyTheme(); });
          field.append(caption, input, hex); panel.append(field);
        }
      }
      const hint = document.createElement("p"); hint.className = "a11y-theme-hint";
      hint.textContent = "Preview changes instantly. Select Save Preferences to keep them. Custom colors may reduce contrast; choose readable combinations.";
      panel.append(hint);
      return panel;
    }

    function render() {
      tabs.replaceChildren();

      categories.forEach(([name], index) => {
        tabs.appendChild(createCategoryButton(name, index));
      });

      const [name, helpText, items] = categories[activeCategory];

      title.textContent = name;
      description.textContent = helpText;

      grid.replaceChildren();

      if (activeCategory === 0) grid.appendChild(createThemePanel());
      if (activeCategory >= 8 && window.NCSNCFOCS) window.NCSNCFOCS.mount(grid, activeCategory - 8);

      for (const [id, label, help] of items) {
        grid.appendChild(createSettingCard(id, label, help));
      }

      count.textContent =
        `${allSettings.length} preferences • ${accountSyncAvailable ? "account connected" : "this device"}`;
    }

    function openDialog() {
      state = { ...saved };
      themeState = { ...savedTheme };
      shouldRestoreOnClose = true;
      window.NCSNCFOCS?.beginPreview();

      applyPreferences();
      activeCategory = 0; // Always reveal color customization when Settings opens.
      render();

      if (typeof dialog.showModal === "function") {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        dialog.setAttribute("open", "");
      }
    }

    function closeDialog() {
      if (shouldRestoreOnClose) {
        state = { ...saved };
        themeState = { ...savedTheme };
        applyPreferences();
        window.NCSNCFOCS?.cancelPreview();
      }
      if (typeof dialog.close === "function" && dialog.open) {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
        if (shouldRestoreOnClose) {
          state = { ...saved };
          themeState = { ...savedTheme };
          applyPreferences();
        }
      }
    }

    async function savePreferences() {
      const nextSaved = { ...state };
      const nextTheme = { ...themeState };
      saved = nextSaved;
      savedTheme = nextTheme;
      window.NCSNCFOCS?.commit();
      preferencesEdited = true;
      const localSaved = saveLocal(nextTheme, nextSaved);
      shouldRestoreOnClose = false;
      closeDialog();
      const synced = await saveAccountPreferences(nextTheme, nextSaved);
      count.textContent = `${allSettings.length} preferences • ${synced ? "saved to account" : localSaved ? "saved on this device" : "save failed"}`;
    }

    function restoreDefaults() {
      state = { ...defaults };
      themeState = { ...themeDefaults };
      window.NCSNCFOCS?.resetPreview();
      preferencesEdited = true;

      applyPreferences();
      render();

      // Preview defaults immediately.
      // Save Preferences commits the reset.
    }

    document.addEventListener("click", event => {
      const button = event.target.closest("[data-open-accessibility]");
      if (!button) return;
      event.preventDefault();
      if (!dialog.open) openDialog();
    });

    closeButton.addEventListener("click", () => {
      closeDialog();
    });

    saveButton.addEventListener("click", savePreferences);

    resetButton.addEventListener("click", restoreDefaults);

    dialog.addEventListener("close", () => {
      if (shouldRestoreOnClose) {
        state = { ...saved };
        themeState = { ...savedTheme };
        applyPreferences();
        window.NCSNCFOCS?.cancelPreview();
      }

      shouldRestoreOnClose = true;
    });

    dialog.addEventListener("click", event => {
      if (event.target === dialog) {
        closeDialog();
      }
    });

    document.addEventListener(syncEvent, () => {
      saved = readSavedPreferences();
      savedTheme = readTheme();
      if (!dialog.open) {
        window.NCSNCFOCS?.apply();
        state = { ...saved };
        themeState = { ...savedTheme };
        applyPreferences();
        render();
      }
    });

    applyPreferences();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => { restoreSitewidePreferences(); initializeAccessibilityHub(); loadAccountPreferences(); }
    );
  } else {
    restoreSitewidePreferences();
    initializeAccessibilityHub();
    loadAccountPreferences();
  }
})();
