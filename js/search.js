import { BASE_URL, API_KEY } from "./api.js";
import { renderCards, showMessage } from "./render.js";
import { showTab } from "./tabs.js";

const debounceDelay = 500;
const maxPages = 500;
const animationGenreId = "16";

// شناسه ژانرهای فیلم و معادلشان در سریال
// ژانری که اینجا نباشد در سریال معادل ندارد
const tvGenreIds = {
  "28": "10759",
  "12": "10759",
  "878": "10765",
  "18": "18",
  "35": "35",
  "99": "99",
  "16": "16"
};

const input = document.querySelector("#exploreInput");
const clearBtn = document.querySelector("#exploreClear");
const typesBox = document.querySelector("#exploreTypes");
const filtersForm = document.querySelector("#exploreFilters");
const ratingMin = document.querySelector("#ratingMin");
const ratingOutput = document.querySelector("#ratingOutput");
const yearFrom = document.querySelector("#yearFrom");
const yearTo = document.querySelector("#yearTo");
const countHeading = document.querySelector("#exploreCount");
const container = document.querySelector("#exploreResults");
const pagination = document.querySelector("#pagination");
const headerInput = document.querySelector("#searchBox");

const state = {
  query: "",
  type: "all",
  page: 1,
  genres: [],
  ratingMin: 0,
  yearFrom: "",
  yearTo: ""
};

let timerId = null;
let requestCounter = 0;


/* ---------- خواندن فرم ---------- */

function readFilters() {

  state.query = input.value.trim();

  const activeChip = typesBox.querySelector(".type-chip.active");
  state.type = activeChip ? activeChip.dataset.type : "all";

  state.genres = [];

  filtersForm
    .querySelectorAll('input[name="genre"]:checked')
    .forEach(function (box) {
      state.genres.push(box.value);
    });

  state.ratingMin = Number(ratingMin.value);
  state.yearFrom = yearFrom.value.trim();
  state.yearTo = yearTo.value.trim();
}


/* ---------- حالت کشف (کادر جستجو خالی است) ---------- */

function getKinds() {

  if (state.type === "movie") return ["movie"];

  if (state.type === "tv") return ["tv"];

  return ["movie", "tv"];
}

function convertGenresForTv(genres) {

  const result = [];

  for (let i = 0; i < genres.length; i++) {

    const code = tvGenreIds[genres[i]];

    if (!code) return null;

    if (!result.includes(code)) {
      result.push(code);
    }
  }

  return result;
}

function buildDiscoverUrl(kind) {

  let genres = state.genres.slice();

  if (state.type === "animation") {
    genres.push(animationGenreId);
  }

  if (kind === "tv") {

    genres = convertGenresForTv(genres);

    // ژانری انتخاب شده که در سریال وجود ندارد
    if (genres === null) return null;
  }

  let address =
    `${BASE_URL}/discover/${kind}?api_key=${API_KEY}` +
    `&language=fa-IR&sort_by=popularity.desc&page=${state.page}`;

  if (genres.length > 0) {
    address += "&with_genres=" + genres.join(",");
  }

  if (state.ratingMin > 0) {
    address += "&vote_average.gte=" + state.ratingMin;
    address += "&vote_count.gte=50";
  }

  const dateField =
    kind === "movie" ? "primary_release_date" : "first_air_date";

  if (state.yearFrom !== "") {
    address += `&${dateField}.gte=${state.yearFrom}-01-01`;
  }

  if (state.yearTo !== "") {
    address += `&${dateField}.lte=${state.yearTo}-12-31`;
  }

  return address;
}

async function fetchJson(url) {

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("bad response");
  }

  return res.json();
}

async function getDiscoverData() {

  const urls = getKinds()
    .map(buildDiscoverUrl)
    .filter(function (url) {
      return url !== null;
    });

  if (urls.length === 0) {
    return { items: [], totalPages: 0 };
  }

  const list = await Promise.all(urls.map(fetchJson));

  let items = [];
  let totalPages = 0;

  list.forEach(function (data) {
    items = items.concat(data.results);
    totalPages = Math.max(totalPages, data.total_pages);
  });

  items = items.filter(function (item) {
    return item.poster_path;
  });

  items.sort(function (a, b) {
    return b.popularity - a.popularity;
  });

  return {
    items: items,
    totalPages: Math.min(totalPages, maxPages)
  };
}


/* ---------- حالت جستجو (کادر جستجو متن دارد) ---------- */

function hasGenre(item, genreId) {

  let code = Number(genreId);

  if (item.media_type === "tv") {

    if (!tvGenreIds[genreId]) return false;

    code = Number(tvGenreIds[genreId]);
  }

  return (item.genre_ids || []).includes(code);
}

function filterItems(items) {

  return items.filter(function (item) {

    if (item.media_type === "person" || !item.poster_path) {
      return false;
    }

    if (state.type === "movie" && item.media_type !== "movie") {
      return false;
    }

    if (state.type === "tv" && item.media_type !== "tv") {
      return false;
    }

    if (state.type === "animation" && !hasGenre(item, animationGenreId)) {
      return false;
    }

    if (item.vote_average < state.ratingMin) {
      return false;
    }

    const date = item.release_date || item.first_air_date || "";
    const year = Number(date.slice(0, 4));

    if (state.yearFrom !== "" || state.yearTo !== "") {

      if (!year) return false;

      if (state.yearFrom !== "" && year < Number(state.yearFrom)) {
        return false;
      }

      if (state.yearTo !== "" && year > Number(state.yearTo)) {
        return false;
      }
    }

    for (let i = 0; i < state.genres.length; i++) {

      if (!hasGenre(item, state.genres[i])) {
        return false;
      }
    }

    return true;
  });
}

async function getSearchData() {

  const url =
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=fa-IR` +
    `&page=${state.page}&query=${encodeURIComponent(state.query)}`;

  const data = await fetchJson(url);

  return {
    items: filterItems(data.results),
    totalPages: Math.min(data.total_pages, maxPages)
  };
}


/* ---------- نمایش ---------- */

function updateHeading() {

  if (state.query !== "") {
    countHeading.textContent = "نتایج جستجو برای «" + state.query + "»";
  } else {
    countHeading.textContent = "ویژه";
  }
}

function getPageNumbers(current, total) {

  const pages = [];

  for (let i = 1; i <= total; i++) {

    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      pages.push(i);
    }
  }

  const result = [];

  pages.forEach(function (page, index) {

    if (index > 0 && page - pages[index - 1] > 1) {
      result.push("...");
    }

    result.push(page);
  });

  return result;
}

function renderPagination(totalPages) {

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html =
    `<button type="button" class="page-btn" data-page="${state.page - 1}" ` +
    `${state.page === 1 ? "disabled" : ""}>قبلی</button>`;

  getPageNumbers(state.page, totalPages).forEach(function (page) {

    if (page === "...") {
      html += `<span>...</span>`;
      return;
    }

    html +=
      `<button type="button" class="page-btn ` +
      `${page === state.page ? "active" : ""}" ` +
      `data-page="${page}">${page}</button>`;
  });

  html +=
    `<button type="button" class="page-btn" data-page="${state.page + 1}" ` +
    `${state.page === totalPages ? "disabled" : ""}>بعدی</button>`;

  pagination.innerHTML = html;
}

async function loadResults() {

  requestCounter++;
  const thisRequest = requestCounter;

  updateHeading();
  pagination.innerHTML = "";
  showMessage(container, "در حال بارگذاری...");

  try {

    let data;

    if (state.query !== "") {
      data = await getSearchData();
    } else {
      data = await getDiscoverData();
    }

    if (thisRequest !== requestCounter) return;

    if (data.items.length === 0) {
      showMessage(container, "نتیجه‌ای پیدا نشد");
      return;
    }

    renderCards(data.items, container);
    renderPagination(data.totalPages);

  } catch (err) {

    if (thisRequest !== requestCounter) return;

    console.error("خطا در جستجو:", err);

    showMessage(container, "مشکلی پیش آمد. دوباره تلاش کن");
  }
}

function startSearch() {

  state.page = 1;

  readFilters();

  loadResults();
}


/* ---------- رویدادها ---------- */

export function initSearchPage() {

  if (
    !input ||
    !clearBtn ||
    !typesBox ||

    !filtersForm ||
    !ratingMin ||
    !ratingOutput ||
    !yearFrom ||
    !yearTo ||
    !countHeading ||
    !container ||
    !pagination
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

    clearTimeout(timerId);

    timerId = setTimeout(startSearch, debounceDelay);
  });

  clearBtn.addEventListener("click", function () {

    clearTimeout(timerId);

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

  

  ratingMin.addEventListener("input", function () {
    ratingOutput.textContent = ratingMin.value;
  });

  // چک‌باکس ژانر و نوار امتیاز: با هر تغییر
  filtersForm.addEventListener("change", function (e) {

    if (e.target.type === "number") return;

    startSearch();
  });

  // سال: فقط وقتی خالی است یا چهار رقم دارد
  function isYearReady(box) {
    return box.value.length === 0 || box.value.length === 4;
  }

  function onYearInput() {

    if (!isYearReady(yearFrom) || !isYearReady(yearTo)) return;

    clearTimeout(timerId);

    timerId = setTimeout(startSearch, debounceDelay);
  }

  yearFrom.addEventListener("input", onYearInput);
  yearTo.addEventListener("input", onYearInput);
  

 
  pagination.addEventListener("click", function (e) {

    const btn = e.target.closest(".page-btn");

    if (!btn || btn.disabled) return;

    state.page = Number(btn.dataset.page);

    loadResults();

    countHeading.scrollIntoView({ behavior: "smooth" });
  });

  if (headerInput) {

    headerInput.addEventListener("keydown", function (e) {

      if (e.key !== "Enter") return;

      const text = headerInput.value.trim();

      if (text === "") return;

      clearTimeout(timerId);

      input.value = text;
      headerInput.value = "";
      toggleClearBtn();

      showTab("tab3");
      window.scrollTo(0, 0);

      startSearch();
    });
  }

  startSearch();
}