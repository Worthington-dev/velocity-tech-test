class MiniCart extends HTMLElement {
  constructor() {
    super();

    this.close = this.querySelector(".js-mini-cart-close");
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener("triggerAddToCart", (event) => {
      const { detail } = event;
      if (detail && detail.variantId) {
        this.addToCart(detail.variantId, detail.step || 1);
      }
    });

    document.addEventListener("triggerUpdateCart", () => {
      const { detail } = event;
      if (detail && detail.variantId) {
        this.updateMiniCart(detail.variantId, detail.qty);
      }
    });

    this.close.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeMiniCart();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMiniCart();
      }
    });
  }

  closeMiniCart() {
    this.removeAttribute("open");
  }

  addToCart(variantId, quantity) {
    fetch(window.routes.addToCart, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: variantId,
            quantity: quantity,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then(() => {
        this.renderMiniCart();
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
      });
  }

  updateMiniCart(variantId, quantity) {
    fetch(window.routes.changeCart, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        this.renderMiniCart();
      })
      .catch((error) => {
        console.error("Error changing cart:", error);
      });
  }

  renderMiniCart() {
    fetch("/?section_id=mini-cart")
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const section = parser.parseFromString(html, "text/html");
        const newContent = section.querySelector(".mini-cart__wrapper");
        if (newContent) {
          this.querySelector(".mini-cart__wrapper").innerHTML =
            newContent.innerHTML;
        }
        if (!this.hasAttribute("open")) {
          this.setAttribute("open", "");
        }
      })
      .catch((error) => {
        console.error("Error fetching mini cart:", error);
      });
  }
}

customElements.define("mini-cart", MiniCart);
