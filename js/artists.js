import { getPopularPeople } from "./api.js";
import { showMessage } from "./render.js";
import { renderPagination } from "./pagination.js";

const artistsPerPage = 20;

const departmentNames = {
  Acting: "بازیگر",
  Directing: "کارگردان",
  Writing: "نویسنده",
  Production: "تهیه‌کننده"
};

const input = document.querySelector("#artistInput");
const clearBtn = document.querySelector("#artistClear");
const typesBox = document.querySelector("#artistTypes");
const filterToggle = document.querySelector("#artistFilterToggle");
const filtersForm = document.querySelector("#artistFilters");
const list = document.querySelector("#artistList");
const pagination = document.querySelector("#artistPagination");
const countHeading = document.querySelector("#artistCount");

const state = {
  query: "",
  department: "all",
  genders: [],
  sort: "popularity",
  page: 1
};

let allArtists = [];
let isLoaded = false;


/* ---------- خواندن فرم ---------- */

function readFilters() {

  state.query = input.value.trim();

  const activeChip = typesBox.querySelector(".type-chip.active");
  state.department = activeChip ? activeChip.dataset.dept : "all";

  state.genders = [];

  filtersForm
    .querySelectorAll('input[name="gender"]:checked')
    .forEach(function (box) {
      state.genders.push(box.value);
    });

  const sortRadio = filtersForm.querySelector('input[name="sort"]:checked');
  state.sort = sortRadio ? sortRadio.value : "popularity";
}


/* ---------- فیلتر کردن ---------- */

function getFilteredArtists() {

  const result = allArtists.filter(function (person) {

    if (
      state.department !== "all" &&
      person.known_for_department !== state.department
    ) {
      return false;
    }

    if (
      state.genders.length > 0 &&
      !state.genders.includes(String(person.gender))
    ) {
      return false;
    }

    if (
      state.query !== "" &&
      !person.name.toLowerCase().includes(state.query.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  if (state.sort === "name") {

    result.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  return result;
}


/* ---------- نمایش ---------- */

function updateHeading() {

  if (state.query !== "") {
    countHeading.textContent = "نتایج جستجو برای «" + state.query + "»";
  } else {
    countHeading.textContent = "هنرمندان محبوب";
  }
}

function renderArtists(items) {

  list.innerHTML = items.map(function (person) {

    const photo = `https://image.tmdb.org/t/p/w300${person.profile_path}`;
    const job = departmentNames[person.known_for_department] || "";

    return `
      <div class="actor-card">
        <div class="actor-photo">
          <img src="${photo}" alt="${person.name}">
        </div>

        <h3 class="actor-name">${person.name}</h3>
        <span class="actor-job">${job}</span>
      </div>
    `;

  }).join("");
}

function showPage() {

  if (!isLoaded) return;

  updateHeading();

  const artists = getFilteredArtists();

  if (artists.length === 0) {
    showMessage(list, "هنرمندی پیدا نشد");
    pagination.innerHTML = "";
    return;
  }

  const totalPages = Math.ceil(artists.length / artistsPerPage);
  const start = (state.page - 1) * artistsPerPage;

  renderArtists(artists.slice(start, start + artistsPerPage));

  renderPagination(pagination, state.page, totalPages);
}

function startSearch() {

  state.page = 1;

  readFilters();

  showPage();
}


/* ---------- رویدادها ---------- */

export async function initArtists() {

  if (
    !input ||
    !clearBtn ||
    !typesBox ||
    !filterToggle ||
    !filtersForm ||
    !list ||
    !pagination ||
    !countHeading
  ) {
    return;
  }

  function toggleClearBtn() {

    if (input.value !== "") {
      clearBtn.classList.add("visible");
    } else {
      clearBtn.classList.remove("visible");
    }
  }

  input.addEventListener("input", function () {

    toggleClearBtn();

    startSearch();
  });

  clearBtn.addEventListener("click", function () {

    input.value = "";
    toggleClearBtn();
    input.focus();

    startSearch();
  });

  typesBox.addEventListener("click", function (e) {

    const chip = e.target.closest(".type-chip");

    if (!chip) return;

    typesBox.querySelectorAll(".type-chip").forEach(function (item) {
      item.classList.remove("active");
    });

    chip.classList.add("active");

    startSearch();
  });

  filterToggle.addEventListener("click", function () {

    const isOpen = filtersForm.classList.toggle("open");

    filterToggle.setAttribute("aria-expanded", String(isOpen));
  });

  filtersForm.addEventListener("change", startSearch);

  pagination.addEventListener("click", function (e) {

    const btn = e.target.closest(".page-btn");

    if (!btn || btn.disabled) return;

    state.page = Number(btn.dataset.page);

    showPage();

    countHeading.scrollIntoView({ behavior: "smooth" });
  });

  showMessage(list, "در حال بارگذاری...");

  try {

    allArtists = await getPopularPeople();

    isLoaded = true;

    startSearch();

  } catch (err) {

    console.error("خطا در دریافت هنرمندان:", err);

    showMessage(list, "مشکلی پیش آمد. دوباره تلاش کن");
  }
}