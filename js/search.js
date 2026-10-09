import { BASE_URL, API_KEY } from "./api.js";
import { renderCards, showMessage } from "./render.js";
import { showTab } from "./tabs.js";

const debounceDelay = 500;
const resultsPerPage = 20;

let timerId = null;
let requestCounter = 0;
let activeGenre = "";
let activeGenreName = "";

function buildSearchUrl(query, genre) {

  if (query !== "") {
    return (
      `${BASE_URL}/search/multi?api_key=${API_KEY}` +
      `&language=fa-IR&page=1&query=${encodeURIComponent(query)}`
    );
  }

  if (genre !== "") {
    return (
      `${BASE_URL}/discover/movie?api_key=${API_KEY}` +
      `&language=fa-IR&sort_by=popularity.desc&with_genres=${genre}`
    );
  }

  return `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=fa-IR`;
}

function updateHeading(query) {

  const heading = document.querySelector("#searchHeading");

  if (!heading) return;

  if (query !== "") {
    heading.textContent = "نتایج جستجو برای «" + query + "»";
  } else if (activeGenre !== "") {
    heading.textContent = activeGenreName;
  } else {
    heading.textContent = "ویژه";
  }
}

async function loadResults() {

  const input = document.querySelector("#searchPageInput");
  const container = document.querySelector("#searchResults");

  if (!input || !container) return;

  const query = input.value.trim();

  requestCounter++;
  const thisRequest = requestCounter;

  updateHeading(query);
  showMessage(container, "در حال بارگذاری...");

  try {

    const res = await fetch(buildSearchUrl(query, activeGenre));

    if (!res.ok) {
      throw new Error("bad response");
    }

    const data = await res.json();

    if (thisRequest !== requestCounter) return;

    const items = data.results.filter(function (item) {
      return item.media_type !== "person" && item.poster_path;
    });

    if (items.length === 0) {
      showMessage(container, "نتیجه‌ای پیدا نشد");
      return;
    }

    renderCards(items.slice(0, resultsPerPage), container);

  } catch (err) {

    if (thisRequest !== requestCounter) return;

    console.error("خطا در جستجو:", err);

    showMessage(container, "مشکلی پیش آمد. دوباره تلاش کن");
  }
}

function clearActiveChip() {

  document.querySelectorAll(".chip.active").forEach(function (chip) {
    chip.classList.remove("active");
  });

  activeGenre = "";
  activeGenreName = "";
}

export function initSearchPage() {

  const input = document.querySelector("#searchPageInput");
  const clearBtn = document.querySelector("#searchPageClear");
  const chipsBox = document.querySelector("#searchChips");
  const headerInput = document.querySelector("#searchBox");

  if (!input || !clearBtn || !chipsBox) return;

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

    if (input.value.trim() !== "") {
      clearActiveChip();
    }

    timerId = setTimeout(loadResults, debounceDelay);
  });

  chipsBox.addEventListener("click", function (e) {

    const chip = e.target.closest(".chip");

    if (!chip) return;

    const wasActive = chip.classList.contains("active");

    clearActiveChip();

    if (!wasActive) {
      chip.classList.add("active");
      activeGenre = chip.dataset.genre;
      activeGenreName = chip.textContent.trim();
    }

    input.value = "";
    toggleClearBtn();

    loadResults();
  });

  clearBtn.addEventListener("click", function () {

    clearTimeout(timerId);

    input.value = "";
    toggleClearBtn();

    clearActiveChip();

    input.focus();

    loadResults();
  });

  if (headerInput) {

    headerInput.addEventListener("keydown", function (e) {

      if (e.key !== "Enter") return;

      const text = headerInput.value.trim();

      if (text === "") return;

      clearActiveChip();

      input.value = text;
      toggleClearBtn();
      headerInput.value = "";

      showTab("tab4");
      window.scrollTo(0, 0);

      loadResults();
    });
  }

  loadResults();
}