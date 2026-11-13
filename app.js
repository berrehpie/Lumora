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
      lipstick: `<rect x="78" y="112" width="44" height="70" rx="6" fill="#3b3330"/><rect x="82" y="92" width="36" height="22" rx="3" fill="#c9a76b"/><path d="M87 92 V58 Q87 50 95 46 L113 38 V92 Z" fill="${c}"/>`,
      mascara: `<rect x="84" y="76" width="32" height="106" rx="12" fill="${c}"/><rect x="88" y="28" width="24" height="50" rx="6" fill="#c9a76b"/><rect x="84" y="74" width="32" height="6" fill="#3b3330"/>`,
      gloss: `<rect x="80" y="84" width="40" height="98" rx="12" fill="${c}" opacity=".9"/><rect x="88" y="96" width="8" height="70" rx="4" fill="#fff" opacity=".35"/><rect x="84" y="30" width="32" height="56" rx="8" fill="#3b3330"/>`,
      pencil: `<rect x="92" y="44" width="16" height="122" rx="2" fill="${c}"/><path d="M92 44 L100 18 L108 44 Z" fill="#ecd3b4"/><path d="M97 28 L100 18 L103 28 Z" fill="${c}"/><rect x="92" y="164" width="16" height="16" rx="2" fill="#c9a76b"/>`,
      compact: `<circle cx="100" cy="106" r="66" fill="#3b3330"/><circle cx="100" cy="106" r="52" fill="${c}"/><circle cx="100" cy="106" r="52" fill="url(#sheen)"/>`,
      palette: `<rect x="34" y="52" width="132" height="108" rx="14" fill="#3b3330"/>${["#f1dcc6", "#dcae90", "#b67d5f", "#c99aa4", "#8a5a44", "#5a392c"].map((s, i) => `<circle cx="${62 + (i % 3) * 38}" cy="${86 + Math.floor(i / 3) * 42}" r="15" fill="${s}"/>`).join("")}`,
    };
    const label = !["tube", "pump", "dropper", "jar"].includes(p.shape) ? "" :
      `<text x="100" y="${p.shape === "jar" ? 140 : 125}" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="12" fill="#3b3330" opacity=".75" letter-spacing="1">LUMORA</text>`;
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${p.name}"><defs><radialGradient id="sheen" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><ellipse cx="100" cy="188" rx="60" ry="6" fill="#000" opacity=".06"/>${shapes[p.shape] || shapes.tube}${label}</svg>`;
  }
  const media = (p) =>
    p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />` : bottleSVG(p);
  const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

  // ---------- Catalog ----------
  const state = { category: "All", query: "", sort: "featured", dept: "all" };
  // Departments for the top bar. Products default to Skincare; set department: "Makeup" or
  // "Hair & Body" on a product in products.js to list it there.
  const DEPTS = {
    all: { title: "Shop the collection", sub: "Thoughtfully formulated essentials for every skin type.", test: () => true },
    skincare: { title: "Skincare", sub: "Cleansers, serums, moisturizers and SPF for every skin type.", test: (p) => (p.department || "Skincare") === "Skincare" },
    makeup: { title: "Makeup", sub: "Face, eye and lip essentials for an effortless, everyday look.", test: (p) => p.department === "Makeup" },
    "hair-body": { title: "Hair & Body", sub: "Hair & body care is coming soon — check back shortly.", test: (p) => p.department === "Hair & Body" },
    bestsellers: { title: "Bestsellers", sub: "Our most-loved products, picked again and again.", test: (p) => p.badge === "Bestseller" },
    new: { title: "New arrivals", sub: "The latest additions to the Lumora Skin shelf.", test: (p) => p.badge === "New" },
  };

  function renderFilters() {
    const categories = ["All", ...new Set(PRODUCTS.filter(DEPTS[state.dept].test).map((p) => p.category))];
    $("#makeupSub").hidden = state.dept !== "makeup";
    document.querySelectorAll("[data-sub]").forEach((b) => b.classList.toggle("active", state.dept === "makeup" && b.dataset.sub === state.category));
    $("#filters").innerHTML = categories
      .map((c) => `<button class="chip ${c === state.category ? "active" : ""}" data-cat="${c}">${c}</button>`)
      .join("");
  }

  function setDept(dept, category = "All") {
    state.dept = dept;
    state.category = category;
    const info = DEPTS[dept];
    $("#shopTitle").textContent = info.title;
    $("#shopSub").textContent = info.sub;
    document.querySelectorAll(".dept-btn").forEach((b) => b.classList.toggle("active", b.dataset.dept === dept));
    renderFilters();
    renderProducts();
  }

  function renderProducts() {
    const q = state.query.toLowerCase();
    let list = PRODUCTS.filter(
      (p) =>
        DEPTS[state.dept].test(p) &&
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
          ${p.compare ? `<label class="compare-check"><input type="checkbox" data-compare="${p.id}" ${compareList.includes(p.id) ? "checked" : ""} /><span>Compare</span></label>` : ""}
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

  // ---------- Quick-Compare tray ----------
  const COMPARE_MAX = 3;
  let compareList = [];
  const catLabel = (cat) => cat.toLowerCase();

  function toggleCompare(id, on) {
    const p = byId[id];
    if (on) {
      const first = compareList[0] && byId[compareList[0]];
      if (first && first.category !== p.category) {
        toast(`You're comparing ${catLabel(first.category)}. Clear the tray to compare ${catLabel(p.category)}.`);
        return renderCompare();
      }
      if (compareList.length >= COMPARE_MAX) {
        toast(`You can compare up to ${COMPARE_MAX} products at a time.`);
        return renderCompare();
      }
      if (!compareList.includes(id)) compareList.push(id);
    } else {
      compareList = compareList.filter((x) => x !== id);
    }
    renderCompare();
  }

  function renderCompare() {
    document.querySelectorAll("[data-compare]").forEach((cb) => (cb.checked = compareList.includes(cb.dataset.compare)));
    const tray = $("#compareTray");
    const n = compareList.length;
    tray.hidden = n === 0;
    document.body.classList.toggle("has-tray", n > 0);
    if (!n) { if ($("#compareModal").open) $("#compareModal").close(); return; }
    $("#compareTitle").textContent = `Compare ${catLabel(byId[compareList[0]].category)}`;
    $("#compareHint").textContent = n < 2 ? "Add 1 more to compare" : `${n} of ${COMPARE_MAX} selected`;
    $("#compareSlots").innerHTML = Array.from({ length: COMPARE_MAX }, (_, i) => {
      const p = byId[compareList[i]];
      return p
        ? `<div class="slot"><div class="slot-media">${media(p)}</div><span class="slot-name">${p.name}</span><button class="slot-x" data-uncompare="${p.id}" aria-label="Remove ${p.name} from compare">✕</button></div>`
        : `<div class="slot empty"><span>+</span></div>`;
    }).join("");
    $("#compareGo").disabled = n < 2;
    if ($("#compareModal").open) renderCompareTable();
  }

  function renderCompareTable() {
    const items = compareList.map((id) => byId[id]);
    const list = (arr) => `<ul>${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    const rows = [
      ["Price", (p) => `<strong>${money(p.price)}</strong>${p.compareAt ? ` <s>${money(p.compareAt)}</s>` : ""}`],
      ["Size", (p) => p.size],
      ["Texture", (p) => p.compare.texture],
      ["Key actives", (p) => list(p.compare.actives)],
      ["Skin type", (p) => p.skinType],
      ["Key benefits", (p) => list(p.compare.benefits)],
      ["Rating", (p) => (p.rating ? `<span class="stars">${stars(p.rating)}</span> ${p.rating} <span class="muted">(${p.reviews})</span>` : `<span class="muted">No reviews yet</span>`)],
    ];
    $("#compareTable").innerHTML = `
      <table class="cmp" style="--cols:${items.length}">
        <thead><tr><th scope="col"><span class="sr-only">Feature</span></th>${items.map((p) => `
          <th scope="col">
            <button class="cmp-x" data-uncompare="${p.id}" aria-label="Remove ${p.name}">✕</button>
            <button class="cmp-media" data-view="${p.id}" aria-label="View ${p.name}">${media(p)}</button>
            <span class="cmp-name">${p.name}</span>
          </th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map(([label, fn]) => `<tr><th scope="row">${label}</th>${items.map((p) => `<td>${fn(p)}</td>`).join("")}</tr>`).join("")}
          <tr class="cmp-actions"><th scope="row"><span class="sr-only">Add to cart</span></th>${items.map((p) => `<td><button class="btn btn-small" data-add="${p.id}">Add to cart</button></td>`).join("")}</tr>
        </tbody>
      </table>`;
  }

  function openCompare() {
    if (compareList.length < 2) return;
    renderCompareTable();
    $("#compareModal").showModal();
  }

  document.addEventListener("change", (e) => {
    if (e.target.matches("[data-compare]")) toggleCompare(e.target.dataset.compare, e.target.checked);
  });

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
    if (d.uncompare) toggleCompare(d.uncompare, false);
    else if ("compareclear" in d) { compareList = []; renderCompare(); }
    else if ("comparego" in d) openCompare();
    else if (d.sub) setDept("makeup", d.sub);
    else if (d.dept) { setDept(state.dept === d.dept ? "all" : d.dept); if (state.dept === "all") e.preventDefault(); }
    else if (d.cat) { state.category = d.cat; renderFilters(); renderProducts(); }
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

  // ---------- Animated background: rising bubbles + twinkling sparkles ----------
  (function buildBackgroundFx() {
    const layer = $("#fxLayer");
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const small = window.innerWidth < 720;
    const tints = ["#ff4fa3", "#b25cff", "#4d9fff"];
    const rnd = (a, b) => a + Math.random() * (b - a);
    let html = "";
    for (let i = 0; i < (small ? 10 : 18); i++) {
      const size = rnd(10, small ? 40 : 60).toFixed(0);
      html += `<span class="bubble" style="--size:${size}px;--x:${rnd(0, 100).toFixed(1)}vw;--tint:${tints[i % 3]};--dur:${rnd(16, 34).toFixed(1)}s;--delay:-${rnd(0, 34).toFixed(1)}s;--sway:${rnd(-30, 30).toFixed(0)}px;--o:${rnd(.3, .7).toFixed(2)}"></span>`;
    }
    for (let i = 0; i < (small ? 8 : 16); i++) {
      html += `<span class="sparkle" style="--x:${rnd(0, 100).toFixed(1)}vw;--y:${rnd(0, 100).toFixed(1)}vh;--s:${rnd(10, 20).toFixed(0)}px;--dur:${rnd(2.5, 5).toFixed(1)}s;--delay:-${rnd(0, 5).toFixed(1)}s">✦</span>`;
    }
    layer.innerHTML = html;
  })();

  // ---------- Promo video banner ----------
  const vb = $("#vbVideo");
  const vbBtn = $("#vbToggle");
  if (vb && vbBtn) {
    const syncVb = () => {
      const label = vb.paused ? "Play video" : "Pause video";
      vbBtn.classList.toggle("paused", vb.paused);
      vbBtn.setAttribute("aria-label", label);
      vbBtn.title = label;
    };
    // Respect visitors who prefer less motion: show the still until they press play
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      vb.removeAttribute("autoplay");
      vb.pause();
    }
    vbBtn.addEventListener("click", () => (vb.paused ? vb.play() : vb.pause()));
    vb.addEventListener("play", syncVb);
    vb.addEventListener("pause", syncVb);
    syncVb();

    const full = $("#videoFull");
    const openVideo = () => {
      vb.pause();
      $("#videoModal").showModal();
      full.currentTime = 0;
      full.play().catch(() => {});
    };
    $("#vbOpen").addEventListener("click", openVideo);
    $("#videoModal").addEventListener("close", () => {
      full.pause();
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) vb.play().catch(() => {});
    });
  }

  // ---------- Init ----------
  $("#year").textContent = new Date().getFullYear();
  // Hero bubble: a 3-step routine. Change the product ids or labels here.
  const HERO_STEPS = [["gentle-cleanser", "Cleanse"], ["hydra-serum", "Treat"], ["barrier-cream", "Moisturise"]];
  $("#heroBottles").innerHTML = HERO_STEPS
    .map(([id, label], i) => `
      <button class="hb" role="listitem" data-view="${id}" aria-label="Step ${i + 1}, ${label}: ${byId[id].name}">
        <span class="hb-art">${bottleSVG(byId[id])}</span>
        <span class="hb-label"><b>0${i + 1}</b>${label}</span>
      </button>`)
    .join("");
  renderFilters();
  renderProducts();
  renderCart();
})();
