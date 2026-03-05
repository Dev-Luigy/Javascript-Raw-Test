const DEFAULT_CONFIG = {
  width: 1920,
  height: 1080,
  duration: 7,
  __type: "visual",
  font: {
    name: "Roboto",
    source:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
    default_name: "sans-serif",
    default_source:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
  },
  values: {
    item1: {
      display_name: "Item 1 Text",
      description: "Text for the first bullet point.",
      type: "text",
      value: "1) Production Model",
    },
    item2: {
      display_name: "Item 2 Text",
      description: "Text for the second bullet point.",
      type: "text",
      value: "2) Marketing Investment",
    },
    item3: {
      display_name: "Item 3 Text",
      description: "Text for the third bullet point.",
      type: "text",
      value: "3) Professional Standards",
    },
    item4: {
      display_name: "Item 4 Text",
      description: "Text for the fourth bullet point.",
      type: "text",
      value: "4) Daily Schedule",
    },
    activeItem: {
      display_name: "Active Item",
      description:
        "Which item to animate in (1-4). Previous items stay visible.",
      type: "number",
      value: 1,
    },
    primaryColor: {
      display_name: "Primary Color",
      description: "The color for text and icons.",
      type: "color",
      value: "#000000",
    },
    accentColor: {
      display_name: "Accent Color",
      description: "The background highlight color.",
      type: "color",
      value: "#000000",
    },
    horizontalPosition: {
      display_name: "Horizontal Position (%)",
      description: "Distance from the left edge.",
      type: "number",
      value: 65,
    },
  },
};

function createAnimation(container, userConfig = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...userConfig };
  cfg.values = { ...DEFAULT_CONFIG.values, ...(userConfig.values || {}) };

  for (const key of Object.keys(DEFAULT_CONFIG.values)) {
    if (userConfig.values && userConfig.values[key]) {
      cfg.values[key] = {
        ...DEFAULT_CONFIG.values[key],
        ...userConfig.values[key],
      };
    }
  }

  const fontLink = document.createElement("link");
  fontLink.href = cfg.font.source;
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);
  container.style.fontFamily = `"${cfg.font.name}", ${cfg.font.default_name}`;

  container.style.width = `${cfg.width}px`;
  container.style.height = `${cfg.height}px`;
  container.style.position = "relative";
  container.style.overflow = "hidden";

  const content = document.createElement("div");
  content.id = "content";
  content.style.position = "absolute";
  content.style.left = `${cfg.values.horizontalPosition.value}%`;
  content.style.top = "20%";
  content.style.width = "30%";
  content.style.display = "flex";
  content.style.flexDirection = "column";
  content.style.gap = "30px";
  container.appendChild(content);

  const active = Number(cfg.values.activeItem.value) || 1;
  const color = cfg.values.primaryColor.value;

  const itemsData = [
    {
      text: cfg.values.item1.value,
      icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    },
    {
      text: cfg.values.item2.value,
      icon: "M3 3v18h18V3H3zm16 16H5V5h14v14zM11 7h2v10h-2V7zm-4 3h2v7H7v-7zm8 4h2v3h-2v-3z",
    },
    {
      text: cfg.values.item3.value,
      icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
    },
    {
      text: cfg.values.item4.value,
      icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
    },
  ];

  const itemElements = [];

  for (let i = 0; i < itemsData.length; i++) {
    const data = itemsData[i];
    const itemIndex = i + 1;
    const isVisible = itemIndex < active;
    const isActive = itemIndex === active;
    const isHidden = itemIndex > active;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "20px";
    row.style.padding = "15px 25px";
    row.style.borderRadius = "8px";
    row.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    row.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
    row.style.borderLeft = `8px solid ${color}`;

    if (isVisible) {
      row.style.opacity = "1";
      row.style.transform = "translateX(0)";
    } else {
      row.style.opacity = "0";
      row.style.transform = "translateX(50px)";
    }

    const iconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    iconSvg.setAttribute("viewBox", "0 0 24 24");
    iconSvg.setAttribute("width", "48");
    iconSvg.setAttribute("height", "48");
    iconSvg.style.fill = color;
    iconSvg.style.flexShrink = "0";

    const pathEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    pathEl.setAttribute("d", data.icon);
    iconSvg.appendChild(pathEl);

    const textEl = document.createElement("div");
    textEl.innerText = data.text;
    textEl.style.color = color;
    textEl.style.fontSize = "32px";
    textEl.style.fontWeight = "700";
    textEl.style.lineHeight = "1.2";

    row.appendChild(iconSvg);
    row.appendChild(textEl);
    content.appendChild(row);

    itemElements.push({ el: row, isVisible, isActive, isHidden });
  }

  const tl = gsap.timeline();

  for (let j = 0; j < itemElements.length; j++) {
    const item = itemElements[j];
    if (item.isVisible) {
      tl.set(item.el, { opacity: 1, x: 0 }, 0);
    }
    if (item.isActive) {
      tl.to(
        item.el,
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
        0.5,
      );
      tl.to(
        item.el,
        {
          scale: 1.03,
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        1.5,
      );
    }
    if (item.isHidden) {
      tl.set(item.el, { opacity: 0, x: 50 }, 0);
    }
  }

  return {
    get duration() {
      return cfg.duration;
    },
    get currentTime() {
      return tl.time();
    },
    get paused() {
      return tl.paused();
    },
    play() {
      tl.play();
    },
    pause() {
      tl.pause();
    },
    seek(time) {
      tl.totalTime(time).pause();
    },
    restart() {
      tl.restart();
    },
    destroy() {
      tl.kill();
      container.innerHTML = "";
    },
    getTimeline() {
      return tl;
    },
    getConfig() {
      return { ...cfg };
    },
    updateConfig(newConfig) {
      this.destroy();
      return createAnimation(container, { ...cfg, ...newConfig });
    },
  };
}

export { createAnimation };
