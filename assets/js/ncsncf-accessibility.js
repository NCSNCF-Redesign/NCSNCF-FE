
(() => {
  "use strict";

  const categories = [
    ["🎨 Theme & Colors", "Choose light, dark, system, or your own colors.", []],
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
    ]
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
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    function applyTheme() {
      const root = document.documentElement;
      const mode = themeState.themeMode;
      const dark = mode === "dark" || (mode === "system" && systemDark.matches);
      root.dataset.ncsncfTheme = dark ? "dark" : "light";
      root.dataset.ncsncfPalette = themeState.palette;
      const colors = themeState.palette === "custom" ? themeState : palettes[themeState.palette];
      for (const name of ["background", "surface", "text", "accent", "links"]) {
        if (colors && /^#[0-9a-f]{6}$/i.test(colors[name] || "")) root.style.setProperty("--ncsncf-" + name, colors[name]);
        else root.style.removeProperty("--ncsncf-" + name);
      }
      // Explicitly disable the older dark-background toggle when theme mode is managed here.
      root.classList.toggle("ncsncf-theme-active", themeState.palette !== "original" || dark);
    }
    systemDark.addEventListener?.("change", () => { if (themeState.themeMode === "system") applyTheme(); });
    let saved = readSavedPreferences();
    let state = { ...saved };
    let activeCategory = 0;
    let shouldRestoreOnClose = true;

    count.textContent =
      `${allSettings.length} preferences • saved on this device`;

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
        select.addEventListener("change", () => { themeState[key] = select.value; applyTheme(); render(); });
        field.append(caption, select); panel.append(field);
      };
      addSelect("Appearance", "themeMode", [["system","Follow device"],["light","Light"],["dark","Dark"]]);
      addSelect("Color palette (choose Custom colors for individual pickers)", "palette", [["original","Original NCSNCF"],["ocean","Ocean blue"],["forest","Forest green"],["sunset","Warm sunset"],["lavender","Lavender"],["custom","Custom colors"]]);
      if (themeState.palette === "custom") {
        for (const [key, label] of [["background","Page background"],["surface","Cards and panels"],["text","Text color"],["accent","Accent / buttons"],["links","Links"]]) {
          const field = document.createElement("label"); field.className = "a11y-theme-field ocs__grid-cell";
          const caption = document.createElement("strong"); caption.textContent = label;
          const input = document.createElement("input"); input.type = "color"; input.value = themeState[key]; input.setAttribute("aria-label", label);
          const hex = document.createElement("span"); hex.textContent = themeState[key];
          input.addEventListener("input", () => { themeState[key] = input.value; hex.textContent = input.value; applyTheme(); });
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

      for (const [id, label, help] of items) {
        grid.appendChild(createSettingCard(id, label, help));
      }

      count.textContent =
        `${allSettings.length} preferences • saved on this device`;
    }

    function openDialog() {
      state = { ...saved };
      themeState = { ...savedTheme };
      shouldRestoreOnClose = true;

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

    function savePreferences() {
      saved = { ...state };
      savedTheme = { ...themeState };

      try {
        localStorage.setItem(storageKey, JSON.stringify(saved));
        localStorage.setItem(themeStorageKey, JSON.stringify(savedTheme));
      } catch (error) {
        console.warn(
          "Accessibility Hub: preferences could not be saved.",
          error
        );
      }

      shouldRestoreOnClose = false;
      closeDialog();
    }

    function restoreDefaults() {
      state = { ...defaults };
      themeState = { ...themeDefaults };

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
      }

      shouldRestoreOnClose = true;
    });

    dialog.addEventListener("click", event => {
      if (event.target === dialog) {
        closeDialog();
      }
    });

    applyPreferences();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeAccessibilityHub
    );
  } else {
    initializeAccessibilityHub();
  }
})();
