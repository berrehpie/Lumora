(() => {
  const PICKUP_ADDRESS = "17 Kishore Kumar Street, Laucala Beach";
  const POSTAGE_COST = 5;
  const $ = (s, el = document) => el.querySelector(s);
  const money = (n) => `$${n.toFixed(2)}`;
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

  // ---------- Product illustration (used when no photo is supplied) ----------
  function bottleSVG(p) {
    const c = p.color;
    const shapes = {
      tube: `<rect x="70" y="40" width="60" height="120" rx="14" fill="${c}"/><rect x="82" y="160" width="36" height="22" rx="4" fill="#3b3330"/>`,
      pump: `<rect x="68" y="70" width="64" height="112" rx="16" fill="${c}"/><rect x="88" y="48" width="24" height="22" fill="#3b3330"/><rect x="88" y="40" width="40" height="10" rx="4" fill="#3b3330"/>`,
      dropper: `<rect x="72" y="80" width="56" height="100" rx="12" fill="${c}"/><rect x="84" y="58" width="32" height="22" rx="4" fill="#3b3330"/><rect x="92" y="28" width="16" height="32" rx="8" fill="#3b3330"/>`,
      jar: `<rect x="58" y="98" width="84" height="74" rx="14" fill="${c}"/><rect x="54" y="80" width="92" height="24" rx="8" fill="#3b3330"/>`,
      set: `<rect x="30" y="70" width="44" height="104" rx="12" fill="${c}"/><rect x="40" y="56" width="24" height="16" fill="#3b3330"/>
            <rect x="80" y="86" width="40" height="88" rx="10" fill="#d6e2f0"/><rect x="90" y="70" width="20" height="16" fill="#3b3330"/>
            <rect x="126" y="60" width="44" height="114" rx="12" fill="#f6e7c1"/><rect x="136" y="174" width="24" height="10" fill="#3b3330"/>`,
    };
    const label = p.shape === "set" ? "" :
      `<text x="100" y="${p.shape === "jar" ? 140 : 125}" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="12" fill="#3b3330" opacity=".75" letter-spacing="1">LUMORA</text>`;
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${p.name}"><ellipse cx="100" cy="188" rx="60" ry="6" fill="#000" opacity=".06"/>${shapes[p.shape] || shapes.tube}${label}</svg>`;
  }
  const media = (p) =>
    p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />` : bottleSVG(p);
  const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

  // ---------- Catalog ----------
  const state = { category: "All", query: "", sort: "featured" };
  const categories = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

  function renderFilters() {
    $("#filters").innerHTML = categories
      .map((c) => `<button class="chip ${c === state.category ? "active" : ""}" data-cat="${c}">${c}</button>`)
      .join("");
  }

  function renderProducts() {
    const q = state.query.toLowerCase();
    let list = PRODUCTS.filter(
      (p) =>
        (state.category === "All" || p.category === state.category) &&
        (!q || `${p.name} ${p.category} ${p.description} ${p.skinType}`.toLowerCase().includes(q))
    );
    if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (state.sort === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    $("#emptyState").hidden = list.length > 0;
    $("#productGrid").innerHTML = list
      .map(
        (p) => `
      <article class="card" data-id="${p.id}">
        <button class="card-media" data-view="${p.id}" aria-label="View ${p.name}">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          ${media(p)}
        </button>
        <div class="card-body">
          <p class="card-cat">${p.category} · ${p.size}</p>
          <h3><button class="link" data-view="${p.id}">${p.name}</button></h3>
          ${p.rating ? `<p class="rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} (${p.reviews})</p>` : `<p class="rating">&nbsp;</p>`}
          <div class="card-foot">
            <span class="price">${money(p.price)}${p.compareAt ? ` <s>${money(p.compareAt)}</s>` : ""}</span>
            <button class="btn btn-small" data-add="${p.id}">Add to cart</button>
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  // ---------- Cart ----------
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem("lumora-cart") || "{}") || {}; } catch { cart = {}; }
  // Drop any items that no longer exist in the catalog
  for (const id in cart) if (!byId[id]) delete cart[id];

  const save = () => { try { localStorage.setItem("lumora-cart", JSON.stringify(cart)); } catch {} };
  const subtotal = () => Object.entries(cart).reduce((s, [id, q]) => s + byId[id].price * q, 0);
  const itemCount = () => Object.values(cart).reduce((a, b) => a + b, 0);

  function addToCart(id, qty = 1) {
    cart[id] = (cart[id] || 0) + qty;
    save();
    renderCart();
    toast(`Added ${byId[id].name} to your cart`);
    const badge = $("#cartCount");
    badge.classList.remove("bump");
    void badge.offsetWidth;
    badge.classList.add("bump");
  }
  function setQty(id, qty) {
    if (qty <= 0) delete cart[id];
    else cart[id] = qty;
    save();
    renderCart();
  }

  function renderCart() {
    const count = itemCount();
    $("#cartCount").textContent = count;
    const sub = subtotal();
    $("#cartSubtotal").textContent = money(sub);
    $("#checkoutBtn").disabled = count === 0;

    const items = Object.entries(cart);
    $("#cartItems").innerHTML = items.length
      ? items
          .map(([id, q]) => {
            const p = byId[id];
            return `
        <div class="cart-item">
          <div class="thumb">${media(p)}</div>
          <div class="ci-info">
            <p class="ci-name">${p.name}</p>
            <p class="muted small">${p.size}</p>
            <div class="qty">
              <button data-dec="${id}" aria-label="Decrease quantity">−</button>
              <span>${q}</span>
              <button data-inc="${id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="ci-right">
            <strong>${money(p.price * q)}</strong>
            <button class="link small" data-remove="${id}">Remove</button>
          </div>
        </div>`;
          })
          .join("")
      : `<div class="cart-empty"><p>Your cart is empty.</p><a href="#shop" class="btn btn-ghost" data-closecart>Start shopping</a></div>`;
  }

  function openCart() {
    $("#cartDrawer").classList.add("open");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
    $("#overlay").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    $("#cartDrawer").classList.remove("open");
    $("#cartDrawer").setAttribute("aria-hidden", "true");
    $("#overlay").hidden = true;
    document.body.style.overflow = "";
  }

  // ---------- Product modal ----------
  function openProduct(id) {
    const p = byId[id];
    $("#productModalBody").innerHTML = `
      <div class="pm">
        <div class="pm-media">${media(p)}</div>
        <div class="pm-info">
          <p class="card-cat">${p.category} · ${p.size}</p>
          <h3>${p.name}</h3>
          ${p.rating ? `<p class="rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} · ${p.reviews} reviews</p>` : ""}
          <p class="price big">${money(p.price)}${p.compareAt ? ` <s>${money(p.compareAt)}</s>` : ""}</p>
          <p>${p.description}</p>
          <dl>
            <dt>Key ingredients</dt><dd>${p.ingredients}</dd>
            <dt>Best for</dt><dd>${p.skinType}</dd>
          </dl>
          <div class="pm-actions">
            <div class="qty"><button id="pmDec">−</button><span id="pmQty">1</span><button id="pmInc">+</button></div>
            <button class="btn btn-primary" id="pmAdd">Add to cart</button>
          </div>
        </div>
      </div>`;
    let q = 1;
    $("#pmDec").onclick = () => ($("#pmQty").textContent = q = Math.max(1, q - 1));
    $("#pmInc").onclick = () => ($("#pmQty").textContent = ++q);
    $("#pmAdd").onclick = () => {
      addToCart(id, q);
      $("#productModal").close();
    };
    $("#productModal").showModal();
  }

  // ---------- Checkout ----------
  const checkoutMethod = () => $("#checkoutForm").elements.method.value;

  function renderCheckoutSummary() {
    const sub = subtotal();
    const postage = checkoutMethod() === "postage";
    const fee = postage ? POSTAGE_COST : 0;
    $("#postageFields").hidden = !postage;
    $("#postageFields").querySelectorAll("input").forEach((i) => (i.required = postage));
    $("#checkoutSummary").innerHTML = `
      ${Object.entries(cart).map(([id, q]) => `<div class="row"><span>${byId[id].name} × ${q}</span><span>${money(byId[id].price * q)}</span></div>`).join("")}
      <div class="row"><span>${postage ? "Postage" : "Pickup"}</span><span>${postage ? money(fee) : "Free"}</span></div>
      <div class="row total"><span>Total</span><span>${money(sub + fee)}</span></div>`;
  }

  function openCheckout() {
    renderCheckoutSummary();
    closeCart();
    $("#checkoutModal").showModal();
  }

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // ---------- Events ----------
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;
    const d = t.dataset;
    if (d.cat) { state.category = d.cat; renderFilters(); renderProducts(); }
    else if (d.add) addToCart(d.add);
    else if (d.view) openProduct(d.view);
    else if (d.inc) setQty(d.inc, cart[d.inc] + 1);
    else if (d.dec) setQty(d.dec, cart[d.dec] - 1);
    else if (d.remove) setQty(d.remove, 0);
    else if ("closecart" in d) closeCart();
    else if ("close" in d) t.closest("dialog").close();
  });

  // Close dialogs when clicking the backdrop
  document.querySelectorAll("dialog").forEach((dlg) =>
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); })
  );

  $("#cartOpen").onclick = openCart;
  $("#cartClose").onclick = closeCart;
  $("#overlay").onclick = closeCart;
  $("#checkoutBtn").onclick = openCheckout;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  $("#search").addEventListener("input", (e) => { state.query = e.target.value; renderProducts(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderProducts(); });
  $("#menuBtn").onclick = () => $("#mainNav").classList.toggle("open");
  $("#mainNav").addEventListener("click", (e) => { if (e.target.tagName === "A") $("#mainNav").classList.remove("open"); });

  $("#checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get("first");
    const postage = data.get("method") === "postage";
    // TODO: replace with a real payment integration (Stripe Checkout, Shopify Buy Button, etc.)
    cart = {};
    save();
    renderCart();
    e.target.reset();
    $("#checkoutModal").close();
    toast(postage
      ? `Thank you, ${name}! We'll let you know once your order has been posted.`
      : `Thank you, ${name}! We'll contact you when it's ready for pickup at ${PICKUP_ADDRESS}.`);
  });

  $("#checkoutForm").addEventListener("change", (e) => { if (e.target.name === "method") renderCheckoutSummary(); });

  $("#newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast("You're subscribed! Check your inbox for 10% off.");
  });

  // ---------- Light / dark mode ----------
  function setThemeLabel() {
    const light = document.documentElement.dataset.theme === "light";
    const label = light ? "Switch to dark mode" : "Switch to light mode";
    $("#themeToggle").setAttribute("aria-label", label);
    $("#themeToggle").title = label;
  }
  $("#themeToggle").onclick = () => {
    const root = document.documentElement;
    const light = root.dataset.theme !== "light";
    if (light) root.dataset.theme = "light"; else delete root.dataset.theme;
    try { localStorage.setItem("lumora-theme", light ? "light" : "dark"); } catch {}
    setThemeLabel();
  };
  setThemeLabel();

  // ---------- Init ----------
  $("#year").textContent = new Date().getFullYear();
  $("#heroBottles").innerHTML = ["hydra-serum", "barrier-cream", "spf50"]
    .map((id) => `<div class="hb">${bottleSVG(byId[id])}</div>`)
    .join("");
  renderFilters();
  renderProducts();
  renderCart();
})();
