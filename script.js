const MENU_URL = "https://ak-alb0.github.io/";

const products = [
  { id: 1, category: "Entrées", name: "Burrata crémeuse", description: "Tomates anciennes, basilic frais, huile d'olive et fleur de sel.", price: 11.90, image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=900&q=78" },
  { id: 2, category: "Entrées", name: "Saumon mariné", description: "Saumon, agrumes, fenouil croquant et crème citronnée.", price: 13.50, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=78" },
  { id: 3, category: "Plats", name: "Pasta al tartufo", description: "Tagliatelles fraîches, crème légère, parmesan et truffe.", price: 19.90, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=78" },
  { id: 4, category: "Plats", name: "Filet de bœuf", description: "Jus réduit, pommes grenailles rôties et légumes de saison.", price: 27.90, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=78" },
  { id: 5, category: "Burgers", name: "Alba Burger", description: "Bœuf français, comté, oignons confits et sauce maison.", price: 16.90, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=78" },
  { id: 6, category: "Burgers", name: "Crispy Chicken", description: "Poulet croustillant, cheddar, salade et sauce fumée.", price: 15.50, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=78" },
  { id: 7, category: "Desserts", name: "Tarte citron", description: "Crémeux citron, meringue légère et sablé breton.", price: 8.50, image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=900&q=78" },
  { id: 8, category: "Desserts", name: "Fondant chocolat", description: "Chocolat noir, cœur coulant et glace vanille.", price: 8.90, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476a?auto=format&fit=crop&w=900&q=78" },
  { id: 9, category: "Boissons", name: "Citronnade maison", description: "Citron frais, menthe et eau pétillante.", price: 5.50, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=78" },
  { id: 10, category: "Boissons", name: "Espresso", description: "Un café intense fraîchement extrait.", price: 2.80, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=78" }
];

const state = {
  category: "Tous",
  cart: JSON.parse(localStorage.getItem("alba-cart") || "{}")
};

const categoriesEl = document.getElementById("categories");
const productsGrid = document.getElementById("productsGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const money = value => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function saveCart() {
  localStorage.setItem("alba-cart", JSON.stringify(state.cart));
}

function renderCategories() {
  const categories = ["Tous", ...new Set(products.map(p => p.category))];
  categoriesEl.innerHTML = categories.map(cat => `
    <button class="category ${cat === state.category ? "active" : ""}" data-category="${cat}">
      ${cat}
    </button>
  `).join("");

  categoriesEl.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const filtered = state.category === "Tous"
    ? products
    : products.filter(p => p.category === state.category);

  productsGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <img class="product-image"
           src="${product.image}"
           alt="${product.name}"
           loading="lazy"
           width="900"
           height="506"
           onerror="this.onerror=null;this.src='assets/placeholder.svg';">
      <div class="product-body">
        <div class="product-top">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-price">${money(product.price)}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <button class="add-button" type="button" data-add="${product.id}">+ Ajouter</button>
      </div>
    </article>
  `).join("");

  productsGrid.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.add)));
  });
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  renderCart();
  showToast("Ajouté au panier");
}

function changeQuantity(id, delta) {
  state.cart[id] = (state.cart[id] || 0) + delta;
  if (state.cart[id] <= 0) delete state.cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = Object.entries(state.cart);
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === Number(id));
    return sum + product.price * qty;
  }, 0);

  cartCount.textContent = count;
  cartTotal.textContent = money(total);

  if (!entries.length) {
    cartItems.innerHTML = `<div class="empty-cart">Votre panier est vide.<br>Ajoutez quelques gourmandises à la carte.</div>`;
    return;
  }

  cartItems.innerHTML = entries.map(([id, qty]) => {
    const product = products.find(p => p.id === Number(id));
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="" loading="lazy">
        <div>
          <p class="cart-item-name">${product.name}</p>
          <span class="cart-item-price">${money(product.price)} · ${money(product.price * qty)}</span>
          <div class="qty">
            <button type="button" data-minus="${id}" aria-label="Retirer une unité">−</button>
            <strong>${qty}</strong>
            <button type="button" data-plus="${id}" aria-label="Ajouter une unité">+</button>
          </div>
        </div>
        <button class="close-button" type="button" data-remove="${id}" aria-label="Supprimer">×</button>
      </div>
    `;
  }).join("");

  cartItems.querySelectorAll("[data-minus]").forEach(btn =>
    btn.addEventListener("click", () => changeQuantity(Number(btn.dataset.minus), -1))
  );
  cartItems.querySelectorAll("[data-plus]").forEach(btn =>
    btn.addEventListener("click", () => changeQuantity(Number(btn.dataset.plus), 1))
  );
  cartItems.querySelectorAll("[data-remove]").forEach(btn =>
    btn.addEventListener("click", () => {
      delete state.cart[btn.dataset.remove];
      saveCart();
      renderCart();
    })
  );
}

function openCart() {
  cartOverlay.hidden = false;
  requestAnimationFrame(() => cartDrawer.classList.add("open"));
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setTimeout(() => { cartOverlay.hidden = true; }, 280);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1600);
}

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeCart();
});

renderCategories();
renderProducts();
renderCart();

if (window.QRCode) {
  new QRCode(document.getElementById("qrCode"), {
    text: MENU_URL,
    width: 184,
    height: 184,
    colorDark: "#171717",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}