class QuantitySelector extends HTMLElement {
  constructor() {
    super();

    this.btns = this.querySelectorAll("button");
    this.qtyInput = this.querySelector("input");

    this.addEventListeners();
  }

  addEventListeners() {
    this.btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (btn.dataset.action === "increase") {
          this.increaseQty();
        } else if (btn.dataset.action === "decrease") {
          this.decreaseQty();
        }
      });
    });
  }

  increaseQty() {
    if (this.qtyInput.value == this.qtyInput.max) return;
    this.qtyInput.value = parseInt(this.qtyInput.value) + 1;

    this.dispatchEvent(
      new CustomEvent("triggerAddToCart", {
        bubbles: true,
        detail: {
          step: this.qtyInput.step,
          variantId: this.qtyInput.dataset.variantId,
        },
      })
    );
  }

  decreaseQty() {
    if (this.qtyInput.value == this.qtyInput.min) return;
    this.qtyInput.value = parseInt(this.qtyInput.value) - 1;
    this.dispatchEvent(
      new CustomEvent("triggerUpdateCart", {
        bubbles: true,
        detail: {
          qty: this.qtyInput.value,
          variantId: this.qtyInput.dataset.variantId,
        },
      })
    );
  }
}

customElements.define("quantity-selector", QuantitySelector);
