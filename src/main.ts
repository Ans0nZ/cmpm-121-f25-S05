// CMPM 121 — Refactored Counter Example (Clean Version)

/**
 * Utility: safe DOM selector with built-in null checking.
 * Prevents repeating type assertions and avoids null errors.
 */
function qs<T extends Element>(selector: string, root: Document | Element = document): T {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`Selector not found: ${selector}`);
  return el as T;
}

/**
 * UI constants and CSS selectors for easy reuse.
 */
const UI = {
  titleText: "CMPM 121 Project",
  sel: {
    counter: "#counter",
    incBtn: "#increment",
    decBtn: "#decrement",
    resetBtn: "#reset",
  },
} as const;

/**
 * Centralized application state.
 * Keeps all mutable data together for clarity and future expansion.
 */
type AppState = {
  count: number;
};

/**
 * Cached DOM references.
 * Collected once at startup to avoid repeated lookups.
 */
type AppRefs = {
  counterEl: HTMLSpanElement;
  incBtn: HTMLButtonElement;
  decBtn: HTMLButtonElement;
  resetBtn: HTMLButtonElement;
};

/**
 * Mounts the static HTML structure of the app.
 * Keeps all layout markup in one place.
 */
function mountAppShell() {
  document.body.innerHTML = `
    <h1>${UI.titleText}</h1>
    <p>Counter: <span id="counter">0</span></p>
    <div class="toolbar">
      <button id="increment" type="button">Increment</button>
      <button id="decrement" type="button">Decrement</button>
      <button id="reset"     type="button">Reset</button>
    </div>
  `;
}

/**
 * Initializes the application:
 *  - Mounts HTML structure
 *  - Gets DOM references
 *  - Returns them for later use
 */
function initApp(): AppRefs {
  mountAppShell();

  const refs: AppRefs = {
    counterEl: qs<HTMLSpanElement>(UI.sel.counter),
    incBtn: qs<HTMLButtonElement>(UI.sel.incBtn),
    decBtn: qs<HTMLButtonElement>(UI.sel.decBtn),
    resetBtn: qs<HTMLButtonElement>(UI.sel.resetBtn),
  };

  return refs;
}

/**
 * Pure state update logic — no DOM operations.
 * Handles the data transitions only.
 */
function update(state: AppState, action: "inc" | "dec" | "reset") {
  switch (action) {
    case "inc":
      state.count += 1;
      break;
    case "dec":
      state.count -= 1;
      break;
    case "reset":
      state.count = 0;
      break;
  }
}

/**
 * Renders the UI to reflect the current state.
 * Centralizes all DOM updates and visual changes here.
 */
function render(state: AppState, refs: AppRefs) {
  // Update the number display
  refs.counterEl.textContent = String(state.count);

  // Update the page title
  document.title = `Clicked ${state.count}`;

  // Toggle background color based on parity
  document.body.style.backgroundColor = state.count % 2 ? "pink" : "lightblue";

  // Optionally disable decrement button at zero
  refs.decBtn.disabled = state.count <= 0;
}

/**
 * Connects UI events to update and render logic.
 * Acts as a bridge between user actions and data changes.
 */
function bindEvents(state: AppState, refs: AppRefs) {
  refs.incBtn.addEventListener("click", () => {
    update(state, "inc");
    render(state, refs);
  });

  refs.decBtn.addEventListener("click", () => {
    update(state, "dec");
    render(state, refs);
  });

  refs.resetBtn.addEventListener("click", () => {
    update(state, "reset");
    render(state, refs);
  });
}

/**
 * Application entry point.
 */
function main() {
  const state: AppState = { count: 0 };
  const refs = initApp();

  // First render
  render(state, refs);

  // Set up event handlers
  bindEvents(state, refs);
}

/**
 * Wait for DOM readiness before launching the app.
 * Ensures safety in slower environments.
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main, { once: true });
} else {
  main();
}
