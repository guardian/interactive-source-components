import { codeToHtml } from "shiki";

// Shared Shiki highlighter config
const SHIKI_OPTIONS = {
  lang: "html",
  theme: "github-dark",
};

/**
 * <component-playground> - Interactive component preview with code display
 *
 * Uses a <template slot="code"> element for exact code formatting control.
 * The template content is used as-is, with only class attributes updated
 * when variants change.
 */
class ComponentPlayground extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.baseCode = "";
  }

  connectedCallback() {
    this.render();
    this.cacheBaseCode();
    this.setupEventListeners();
    requestAnimationFrame(() => this.updateCode());
  }

  cacheBaseCode() {
    const template = this.querySelector('template[slot="code"]');
    if (template) {
      const lines = template.innerHTML.split("\n");

      // Find first non-empty line and use its indentation as the baseline
      const firstNonEmptyLine = lines.find((line) => line.trim());
      if (!firstNonEmptyLine) return;

      const baseIndent = firstNonEmptyLine.match(/^(\s*)/)[1].length;

      // Remove that indentation from all lines
      this.baseCode = lines
        .map((line) => {
          // Only slice if line has enough leading whitespace
          if (line.slice(0, baseIndent).trim() === "") {
            return line.slice(baseIndent);
          }
          return line;
        })
        .join("\n")
        .trim();
    }
  }

  render() {
    const name = this.getAttribute("name") || "Component";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: white;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
        }
        h2 {
          font-family: GuardianTextSans, "Guardian Text Sans Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 1.25rem;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #dcdcdc;
        }
        .playground {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .playground__preview {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 120px;
          background: #f6f6f6;
          border-radius: 4px;
          padding: 1rem;
        }
        .playground__code {
          background: #24292e;
          border-radius: 4px;
          overflow: auto;
          margin: 0;
          max-height: 300px;
        }
        .playground__code pre {
          margin: 0;
          padding: 1rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          font-size: 0.8rem;
          line-height: 1.5;
        }
        .playground__code code {
          background: none !important;
        }
        .playground__controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        ::slotted(fieldset) {
          border: none;
          padding: 0;
          margin: 0;
        }
      </style>
      <h2>${name}</h2>
      <div class="playground">
        <div class="playground__preview">
          <slot name="preview"></slot>
        </div>
        <div class="playground__code"><pre><code></code></pre></div>
      </div>
      <div class="playground__controls">
        <slot name="controls"></slot>
      </div>
    `;
  }

  setupEventListeners() {
    this.addEventListener("change", (e) => {
      if (e.target.matches('input[type="radio"], input[type="checkbox"]')) {
        this.updatePreview();
        this.updateCode();
      }
    });
  }

  updatePreview() {
    const fieldsets = this.querySelectorAll("fieldset[data-target]");

    fieldsets.forEach((fieldset) => {
      const targetSelector = fieldset.dataset.target;
      const target = this.querySelector(targetSelector);
      if (!target) return;

      const baseClass = [...target.classList].find((c) => c.startsWith("src-"));

      const variants = [
        ...this.querySelectorAll(
          `fieldset[data-target="${targetSelector}"] input:checked`,
        ),
      ]
        .map((input) => input.value)
        .filter(Boolean);

      target.className = [baseClass, ...variants].filter(Boolean).join(" ");
    });
  }

  getCodeWithCurrentClasses() {
    if (!this.baseCode) return "";

    let code = this.baseCode;

    // Update class attributes in the code template based on current preview state
    const fieldsets = this.querySelectorAll("fieldset[data-target]");
    const classUpdates = new Map();

    fieldsets.forEach((fieldset) => {
      const targetSelector = fieldset.dataset.target;
      const target = this.querySelector(targetSelector);
      if (!target) return;

      const baseClass = [...target.classList].find((c) => c.startsWith("src-"));
      if (baseClass) {
        const currentClasses = target.className;
        classUpdates.set(baseClass, currentClasses);
      }
    });

    // Replace class="src-xxx" or class="src-xxx src-xxx--yyy" patterns
    classUpdates.forEach((newClasses, baseClass) => {
      // Match class attribute containing this base class
      const pattern = new RegExp(`class="(${baseClass}[^"]*)"`, "g");
      code = code.replace(pattern, `class="${newClasses}"`);
    });

    return code;
  }

  async updateCode() {
    const codeContainer = this.shadowRoot.querySelector(".playground__code");
    const code = this.getCodeWithCurrentClasses();

    if (!code) {
      codeContainer.innerHTML = "<pre><code>No template provided</code></pre>";
      return;
    }

    try {
      const highlighted = await codeToHtml(code, SHIKI_OPTIONS);
      codeContainer.innerHTML = highlighted;
    } catch (e) {
      // Fallback to plain text if Shiki fails
      codeContainer.innerHTML = `<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
    }
  }
}

/**
 * <icon-playground> - Paginated icon browser with code display
 */
class IconPlayground extends HTMLElement {
  static ICONS_PER_PAGE = 6;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentPage = 0;
    this.selectedIcon = null;
    this.icons = [];
  }

  async connectedCallback() {
    this.render();
    this.icons = await this.loadIconsFromCss();
    this.setupEventListeners();
    this.updateGrid();
  }

  async loadIconsFromCss() {
    try {
      const response = await fetch("/dist/icons.css");
      const css = await response.text();

      // Extract icon names from .src-icon--{name} { patterns
      // Skip size variants (medium, small, xsmall)
      const matches = css.matchAll(/\.src-icon--([a-z0-9-]+)\s*\{/g);
      const sizeVariants = new Set(["medium", "small", "xsmall"]);

      const icons = [...matches]
        .map((m) => m[1])
        .filter((name) => !sizeVariants.has(name))
        .sort();

      return icons;
    } catch (e) {
      console.error("Failed to load icons from CSS:", e);
      return [];
    }
  }

  get totalPages() {
    return Math.ceil(this.icons.length / IconPlayground.ICONS_PER_PAGE);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: white;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
        }
        h2 {
          font-family: GuardianTextSans, "Guardian Text Sans Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 1.25rem;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #dcdcdc;
        }
        .playground {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .playground__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background: #f6f6f6;
          padding: 1rem;
          border-radius: 4px;
        }
        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.15s;
        }
        .icon-item:hover {
          background: #e0e0e0;
        }
        .icon-item.selected {
          background: #052962;
        }
        .icon-item.selected span {
          color: white;
        }
        .icon-item > div {
          width: 24px;
          height: 24px;
        }
        .icon-item.selected > div {
          background-color: white;
        }
        .icon-item span {
          font-size: 0.65rem;
          color: #707070;
          text-align: center;
          word-break: break-word;
        }
        .playground__code {
          background: #24292e;
          border-radius: 4px;
          overflow: auto;
          margin: 0;
          display: flex;
          align-items: center;
        }
        .playground__code pre {
          margin: 0;
          padding: 1rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          font-size: 0.8rem;
          line-height: 1.5;
        }
        .playground__code code {
          background: none !important;
        }
        .playground__code .placeholder {
          color: #6a737d;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          font-size: 0.8rem;
          padding: 1rem;
        }
        .pagination {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: GuardianTextSans, "Guardian Text Sans Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 0.875rem;
        }
        .pagination button {
          padding: 0.25rem 0.5rem;
          border: 1px solid #dcdcdc;
          background: white;
          border-radius: 4px;
          cursor: pointer;
        }
        .pagination button:hover:not(:disabled) {
          background: #f6f6f6;
        }
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination__info {
          color: #707070;
        }
      </style>
      <h2>Icons</h2>
      <div class="playground">
        <div class="playground__grid"></div>
        <div class="playground__code"><span class="placeholder">Select an icon</span></div>
      </div>
      <div class="pagination">
        <button class="prev">Prev</button>
        <span class="pagination__info"></span>
        <button class="next">Next</button>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelector(".prev").addEventListener("click", () => {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.updateGrid();
      }
    });

    this.shadowRoot.querySelector(".next").addEventListener("click", () => {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.updateGrid();
      }
    });

    this.shadowRoot
      .querySelector(".playground__grid")
      .addEventListener("click", (e) => {
        const item = e.target.closest(".icon-item");
        if (item) {
          this.selectIcon(item.dataset.icon);
        }
      });
  }

  updateGrid() {
    const grid = this.shadowRoot.querySelector(".playground__grid");
    const start = this.currentPage * IconPlayground.ICONS_PER_PAGE;
    const end = start + IconPlayground.ICONS_PER_PAGE;
    const pageIcons = this.icons.slice(start, end);

    grid.innerHTML = pageIcons
      .map(
        (icon) => `
      <div class="icon-item ${this.selectedIcon === icon ? "selected" : ""}" data-icon="${icon}">
        <div class="src-icon--${icon}"></div>
        <span>${icon}</span>
      </div>
    `,
      )
      .join("");

    const info = this.shadowRoot.querySelector(".pagination__info");
    info.textContent = `${start + 1}-${Math.min(end, this.icons.length)} of ${this.icons.length}`;

    this.shadowRoot.querySelector(".prev").disabled = this.currentPage === 0;
    this.shadowRoot.querySelector(".next").disabled =
      this.currentPage >= this.totalPages - 1;
  }

  selectIcon(iconName) {
    this.selectedIcon = iconName;
    this.updateGrid();
    this.updateCode();
  }

  async updateCode() {
    const codeContainer = this.shadowRoot.querySelector(".playground__code");

    if (!this.selectedIcon) {
      codeContainer.innerHTML =
        '<span class="placeholder">Select an icon</span>';
      return;
    }

    const code = `<div class="src-icon--${this.selectedIcon}"></div>`;

    try {
      const highlighted = await codeToHtml(code, SHIKI_OPTIONS);
      codeContainer.innerHTML = highlighted;
    } catch (e) {
      codeContainer.innerHTML = `<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
    }
  }
}

customElements.define("component-playground", ComponentPlayground);
customElements.define("icon-playground", IconPlayground);
