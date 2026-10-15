import { initTabs } from "./tabs.js";
import { initSidebar } from "./slidebar.js";
import { getFavorites, removeFavorite } from "./favorites.js";
import { genreNames } from "./render.js";

const list = document.querySelector("#favList");
const chipsBox = document.querySelector("#favChips");
const sortBox = document.querySelector("#favSort");
const sortText = document.querySelector("#favSortText");
const viewBox = document.querySelector("#favView");
const note = document.querySelector("#favNote");
const headerInput = document.querySelector("#searchBox");

const state = {
  filter: "all",
  sort: "new",
  view: "grid"
};

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sortItems(items) {

  const sorted = items.slice();

  if (state.sort === "new") {
    sorted.sort(function (a, b) { return b.addedAt - a.addedAt; });
  }

  if (state.sort === "old") {
    sorted.sort(function (a, b) { return a.addedAt - b.addedAt; });
  }

  if (state.sort === "rating") {
    sorted.sort(function (a, b) { return b.rating - a.rating; });
  }

  if (state.sort === "title") {
    sorted.sort(function (a, b) { return a.title.localeCompare(b.title); });
  }

  return sorted;
}

function updateChips(all) {

  const movies = all.filter(function (f) { return f.type === "movie"; }).length;
  const series = all.length - movies;

  chipsBox.querySelector('[data-filter="all"]').textContent = `همه (${all.length})`;
  chipsBox.querySelector('[data-filter="movie"]').textContent = `فیلم (${movies})`;
  chipsBox.querySelector('[data-filter="tv"]').textContent = `سریال (${series})`;
}

function cardHtml(fav) {

  const poster = fav.poster
    ? `https://image.tmdb.org/t/p/w300${fav.poster}`
    : "images/Popcorn.l.png";

  const genres = (fav.genreIds || [])
    .filter(function (id) { return genreNames[id]; })
    .map(function (id) { return `<span>${genreNames[id]}</span>`; })
    .join("");

  const typeText = fav.type === "tv" ? "سریال" : "فیلم";

  return `
    <article class="fav-card">

      <div class="fav-poster">
        <img src="${poster}" alt="${esc(fav.title)}">
        <span class="fav-badge"><i class="fa-solid fa-bookmark"></i></span>
      </div>

      <div class="fav-info">
        <h3 class="fav-title">${esc(fav.title)}</h3>
        <div class="fav-genres">${genres}</div>
        <p class="fav-meta">
          <span>${fav.year || "—"}</span>
          <span>•</span>
          <span>${typeText}</span>
        </p>
        <p class="fav-rating">
          <i class="fa-solid fa-star"></i>
          <b>${Number(fav.rating).toFixed(1)}</b>/10
        </p>
      </div>

      <div class="fav-menu">
        <button type="button" class="fav-dots" aria-label="گزینه‌ها">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
        <div class="fav-dropdown">
          <button type="button" class="fav-remove" data-key="${fav.key}">
            <i class="fa-regular fa-trash-can"></i>
            حذف از علاقه‌مندی‌ها
          </button>
        </div>
      </div>

    </article>
  `;
}

function render() {

  const all = getFavorites();

  updateChips(all);

  let items = all;

  if (state.filter !== "all") {
    items = all.filter(function (f) { return f.type === state.filter; });
  }

  list.classList.toggle("is-grid", state.view === "grid");

  if (items.length === 0) {

    list.innerHTML = `
      <div class="fav-empty">
        <i class="fa-regular fa-heart"></i>
        <p>هنوز چیزی به علاقه‌مندی‌ها اضافه نکردی.</p>
      </div>
    `;

    note.style.display = "none";
    return;
  }

  list.innerHTML = sortItems(items).map(cardHtml).join("");

  note.style.display = "flex";
  note.innerHTML =
    `<i class="fa-regular fa-heart"></i> ${all.length} مورد در علاقه‌مندی‌ها ذخیره شده است.`;
}

function closeMenus() {
  list.querySelectorAll(".fav-menu.open").forEach(function (menu) {
    menu.classList.remove("open");
  });
}

function init() {

  initTabs();
  initSidebar();

  chipsBox.addEventListener("click", function (e) {

    const chip = e.target.closest(".fav-chip");

    if (!chip) return;

    chipsBox.querySelectorAll(".fav-chip").forEach(function (c) {
      c.classList.remove("active");
    });

    chip.classList.add("active");
    state.filter = chip.dataset.filter;

    render();
  });

  sortBox.addEventListener("click", function (e) {

    const option = e.target.closest("[data-sort]");

    if (option) {

      state.sort = option.dataset.sort;
      sortText.textContent = option.textContent;

      sortBox.querySelectorAll("[data-sort]").forEach(function (b) {
        b.classList.remove("active");
      });

      option.classList.add("active");
      sortBox.classList.remove("open");

      render();
      return;
    }

    if (e.target.closest(".fav-select-btn")) {
      sortBox.classList.toggle("open");
    }
  });

  viewBox.addEventListener("click", function (e) {

    const btn = e.target.closest("button");

    if (!btn) return;

    viewBox.querySelectorAll("button").forEach(function (b) {
      b.classList.remove("active");
    });

    btn.classList.add("active");
    state.view = btn.dataset.view;

    render();
  });

  list.addEventListener("click", function (e) {

    const removeBtn = e.target.closest(".fav-remove");

    if (removeBtn) {
      removeFavorite(removeBtn.dataset.key);
      render();
      return;
    }

    const dots = e.target.closest(".fav-dots");

    if (dots) {

      const menu = dots.closest(".fav-menu");
      const wasOpen = menu.classList.contains("open");

      closeMenus();

      if (!wasOpen) menu.classList.add("open");
    }
  });

  document.addEventListener("click", function (e) {

    if (!e.target.closest(".fav-menu")) closeMenus();

    if (!e.target.closest(".fav-select")) {
      sortBox.classList.remove("open");
    }
  });

  // اگر در تب دیگری فیلمی اضافه یا حذف شد
  window.addEventListener("storage", render);

  // جستجوی هدر: به صفحه‌ی اصلی و تب جستجو می‌رود
  if (headerInput) {

    headerInput.addEventListener("keydown", function (e) {

      if (e.key !== "Enter") return;

      const text = headerInput.value.trim();

      if (text === "") return;

      sessionStorage.setItem("pendingSearch", text);
      localStorage.setItem("activeTab", "tab3");
      window.location.href = "index.html";
    });
  }

  render();
}

init();