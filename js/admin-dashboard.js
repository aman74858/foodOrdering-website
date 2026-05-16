// admin-dashboard.js — Admin CRUD operations on menu items
document.addEventListener("DOMContentLoaded", () => {
  // Auth guard
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin.html";
    return;
  }

  const tableBody   = document.getElementById("menu-table-body");
  const modal       = document.getElementById("item-modal");
  const modalTitle  = document.getElementById("modal-title");
  const itemForm    = document.getElementById("item-form");
  const addNewBtn   = document.getElementById("add-new-btn");
  const closeModal  = document.getElementById("close-modal");
  const logoutBtn   = document.getElementById("logout-btn");
  const searchInput = document.getElementById("admin-search");
  const totalEl     = document.getElementById("total-items");
  const statsEl     = document.getElementById("avg-price");

  let editId = null;

  // ── Helpers ──────────────────────────────────────────────────
  function getItems() { return getFoodItems(); }
  function saveItems(items) { saveFoodItems(items); }
  function nextId(items) { return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1; }

  // ── Render table ─────────────────────────────────────────────
  function renderTable(filter = "") {
    let items = getItems();
    const q = filter.toLowerCase();
    if (q) items = items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));

    tableBody.innerHTML = "";
    items.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${item.image}" alt="${item.name}" class="table-thumb" onerror="this.src='assets/placeholder.jpg'"></td>
        <td>${item.id}</td>
        <td class="item-name-cell">${item.name}</td>
        <td><span class="cat-pill">${item.category}</span></td>
        <td class="price-cell">₹${item.price}</td>
        <td class="action-cell">
          <button class="edit-btn" data-id="${item.id}">✏ Edit</button>
          <button class="del-btn"  data-id="${item.id}">🗑 Delete</button>
        </td>`;
      tableBody.appendChild(tr);
    });

    // Stats
    const all = getItems();
    totalEl.textContent = all.length;
    statsEl.textContent = all.length
      ? `₹${Math.round(all.reduce((s,i)=>s+i.price,0)/all.length)}`
      : "₹0";

    // Handlers
    tableBody.querySelectorAll(".edit-btn").forEach(btn =>
      btn.addEventListener("click", () => openEdit(parseInt(btn.dataset.id))));
    tableBody.querySelectorAll(".del-btn").forEach(btn =>
      btn.addEventListener("click", () => deleteItem(parseInt(btn.dataset.id))));
  }

  // ── Modal helpers ─────────────────────────────────────────────
  function openModal(title) {
    modalTitle.textContent = title;
    modal.style.display    = "flex";
    document.getElementById("f-name").focus();
  }

  function closeModalFn() {
    modal.style.display = "none";
    itemForm.reset();
    editId = null;
  }

  // ── Add new ────────────────────────────────────────────────────
  addNewBtn.addEventListener("click", () => {
    itemForm.reset();
    editId = null;
    openModal("Add New Item");
  });

  // ── Edit ───────────────────────────────────────────────────────
  function openEdit(id) {
    const item = getItems().find(i => i.id === id);
    if (!item) return;
    editId = id;
    document.getElementById("f-name").value     = item.name;
    document.getElementById("f-price").value    = item.price;
    document.getElementById("f-image").value    = item.image;
    document.getElementById("f-category").value = item.category;
    openModal("Edit Item");
  }

  // ── Save (add or edit) ────────────────────────────────────────
  itemForm.addEventListener("submit", e => {
    e.preventDefault();
    const name     = document.getElementById("f-name").value.trim();
    const price    = parseInt(document.getElementById("f-price").value);
    const image    = document.getElementById("f-image").value.trim();
    const category = document.getElementById("f-category").value;

    if (!name || !price || !image || !category) return;

    let items = getItems();
    if (editId !== null) {
      const idx = items.findIndex(i => i.id === editId);
      if (idx !== -1) items[idx] = { ...items[idx], name, price, image, category };
    } else {
      items.push({ id: nextId(items), name, price, image, category });
    }
    saveItems(items);
    closeModalFn();
    renderTable(searchInput.value);
    showToast(editId !== null ? "Item updated!" : "Item added!");
  });

  // ── Delete ─────────────────────────────────────────────────────
  function deleteItem(id) {
    if (!confirm("Delete this item?")) return;
    saveItems(getItems().filter(i => i.id !== id));
    renderTable(searchInput.value);
    showToast("Item deleted.");
  }

  // ── Toast ──────────────────────────────────────────────────────
  function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent  = msg;
    t.style.opacity = "1";
    t.style.transform = "translateY(0)";
    setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateY(20px)"; }, 2500);
  }

  // ── Logout ─────────────────────────────────────────────────────
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "index.html";
  });

  // ── Search ─────────────────────────────────────────────────────
  searchInput.addEventListener("input", () => renderTable(searchInput.value));

  // ── Close modal ────────────────────────────────────────────────
  closeModal.addEventListener("click", closeModalFn);
  modal.addEventListener("click", e => { if (e.target === modal) closeModalFn(); });

  // ── Init ────────────────────────────────────────────────────────
  renderTable();
});
