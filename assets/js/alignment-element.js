class BaseElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
}

function innerHTML(alignment) {
  return `
    <style>
      :host {
        text-align: ${alignment};
        width: 100%;
        display: block;
      }
    </style>

    <slot></slot>
  `;
}

export class AlignLeftElement extends BaseElement {
  constructor() {
    super();

    this.shadowRoot.innerHTML = innerHTML("left");
  }
}

export class AlignCenterElement extends BaseElement {
  constructor() {
    super();

    this.shadowRoot.innerHTML = innerHTML("center");
  }
}

export class AlignRightElement extends BaseElement {
  constructor() {
    super();

    this.shadowRoot.innerHTML = innerHTML("right");
  }
}

export class AlignJustifyElement extends BaseElement {
  constructor() {
    super();

    this.shadowRoot.innerHTML = innerHTML("justify");
  }
}
window.customElements.define("align-left", AlignLeftElement);
window.customElements.define("align-center", AlignCenterElement);
window.customElements.define("align-right", AlignRightElement);
window.customElements.define("align-justify", AlignJustifyElement);
