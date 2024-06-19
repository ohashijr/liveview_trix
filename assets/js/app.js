// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html";
// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix";
import { LiveSocket } from "phoenix_live_view";
import topbar from "../vendor/topbar";
import "./alignment-element";

window.Trix = Trix; // Don't need to bind to the window, but useful for debugging.
Trix.config.toolbar.getDefaultHTML = toolbarDefaultHTML;

Trix.config.blockAttributes.alignLeft = {
  tagName: "align-left",
  parse: false,
  nestable: false,
  exclusive: true,
};

Trix.config.blockAttributes.alignCenter = {
  tagName: "align-center",
  parse: false,
  nestable: false,
  exclusive: true,
};

Trix.config.blockAttributes.alignRight = {
  tagName: "align-right",
  parse: false,
  nestable: false,
  exclusive: true,
};

Trix.config.blockAttributes.alignJustify = {
  tagName: "align-justify",
  parse: false,
  nestable: false,
  exclusive: true,
};

// trix-before-initialize runs too early.
// We only need to do this once. Everything after initialize will get the
// defaultHTML() call automatically.
document.addEventListener("trix-initialize", updateToolbars, { once: true });

function updateToolbars(event) {
  const toolbars = document.querySelectorAll("trix-toolbar");
  const html = Trix.config.toolbar.getDefaultHTML();
  toolbars.forEach((toolbar) => (toolbar.innerHTML = html));
}

function toolbarDefaultHTML() {
  const { lang } = Trix.config;
  return `
  <div class="trix-button-row">
    <span class="trix-button-group trix-button-group--alignment-tools">
      <button type="button" class="trix-button trix-button--icon trix-button--icon-align-left" data-trix-attribute="alignLeft" title="Align Left" tabindex="-1">Align Left</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-align-center" data-trix-attribute="alignCenter" title="Align Left" tabindex="-1">Align Center</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-align-right" data-trix-attribute="alignRight" title="Align Right" tabindex="-1">Align Right</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-align-justify" data-trix-attribute="alignJustify" title="Align Justify" tabindex="-1">Align Justify</button>
    </span>
    <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
      <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="${lang.bold}" tabindex="-1">${lang.bold}</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="${lang.italic}" tabindex="-1">${lang.italic}</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="${lang.strike}" tabindex="-1">${lang.strike}</button>
    </span>
    <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">
      <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="${lang.heading1}" tabindex="-1">${lang.heading1}</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="${lang.bullets}" tabindex="-1">${lang.bullets}</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="${lang.numbers}" tabindex="-1">${lang.numbers}</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="${lang.outdent}" tabindex="-1">${lang.outdent}</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="${lang.indent}" tabindex="-1">${lang.indent}</button>
    </span>
    <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
      <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="${lang.undo}" tabindex="-1">${lang.undo}</button>
      <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="${lang.redo}" tabindex="-1">${lang.redo}</button>
    </span>
  </div>
`;
}

let Hooks = {};
Hooks.TrixEditor = {
  mounted() {
    const element = document.querySelector("trix-editor");
    element.editor.element.addEventListener("trix-change", (e) => {
      // esse buble apaga o texto todo qd aperta espaço
      // this.el.dispatchEvent(new Event("change", { bubbles: true }));
    });
    element.editor.element.addEventListener("trix-initialize", () => {
      element.editor.element.focus();
      var length = element.editor.getDocument().toString().length;
      window.setTimeout(() => {
        element.editor.setSelectedRange(length, length);
      }, 1);
    });
    this.handleEvent("updateContent", (data) => {
      element.editor.loadHTML(data.content || "");
    });
  },
};

let csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");
let liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: { _csrf_token: csrfToken },
  hooks: Hooks,
});

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", (_info) => topbar.show(300));
window.addEventListener("phx:page-loading-stop", (_info) => topbar.hide());

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;
