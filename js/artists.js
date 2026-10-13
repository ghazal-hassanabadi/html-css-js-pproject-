import { BASE_URL, API_KEY } from "./api.js";
import { showMessage } from "./render.js";

const debounceDelay = 500;

const input = document.querySelector("#artistInput");
const clearBtn = document.querySelector("#artistClear");
const filterToggle = document.querySelector("#artistFilterToggle");
const filtersBox = document.querySelector("#artistFilters");
const countHeading = document.querySelector("#artistCount");
const list = document.querySelector("#artistList");

const jobNames = {
  Acting: "بازیگر",
  Directing: "کارگردان",
  Writing: "نویسنده",
  Production: "تهیه‌کننده",
  Sound: "آهنگساز",
  Camera: "فیلم‌بردار",
  Editing: "تدوینگر"
};

const state = {
  query: "",
  gender: "all",
  known: "all"
};

let timerId = null;
let requestCounter = 0;


/* ---------- گرفتن اطلاعات ---------- */

async function fetchJson(url) {

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("bad response");
  }

  return res.json();
}

function buildUrl() {

  if (state.query !== "") {
    return (
      `${BASE_URL}/search/person?api_key=${API_KEY}&language=en-US` +
      `&page=1&query=${encodeURIComponent(state.query)}`
    );
  }

  return (
    `${BASE_URL}/person/popular?api_key=${API_KEY}` +
    `&language=en-US&page=1`
  );
}

function filterPeople(people) {

  return people.filter(function (person) {

    if (!person.profile_path) return false;

    if (
      state.gender !== "all" &&
      String(person.gender) !== state.gender
    ) {
      return false;
    }

    if (state.known !== "all") {

      const knownFor = person.known_for || [];

      const match = knownFor.some(function (work) {
        return work.media_type === state.known;
      });

      if (!match) return false;
    }

    return true;
  });
}

async function getArtists() {

  const data = await fetchJson(buildUrl());

  return filterPeople(data.results);
}


/* ---------- نمایش ---------- */

function updateHeading() {

  if (state.query !== "") {
    countHeading.textContent = "نتایج جستجو برای «" + state.query + "»";
  } else {
    countHeading.textContent = "هنرمندان محبوب";
  }
}

function renderArtists(people) {

  list.innerHTML = people.map(function (person) {

    const photo = `https://image.tmdb.org/t/p/w300${person.profile_path}`;
    const job = jobNames[person.known_for_department] || "هنرمند";

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

async function loadArtists() {

  requestCounter++;
  const thisRequest = requestCounter;

  updateHeading();
  showMessage(list, "در حال بارگذاری...");

  try {

    const people = await getArtists();

    if (thisRequest !== requestCounter) return;

    if (people.length === 0) {
      showMessage(list, "هنرمندی پیدا نشد");
      return;
    }

    renderArtists(people);

  } catch (err) {

    if (thisRequest !== requestCounter) return;

    console.error("خطا در دریافت هنرمندان:", err);

    showMessage(list, "مشکلی پیش آمد. دوباره تلاش کن");
  }
}

function startSearch() {

  state.query = input.value.trim();

  loadArtists();
}


/* ---------- رویدادها ---------- */

export function initArtists() {

  if (
    !input ||
    !clearBtn ||
    !filterToggle ||
    !filtersBox ||
    !countHeading ||
    !list
  ) {
    return;
  }

  function toggleClearBtn() {
    clearBtn.classList.toggle("visible", input.value !== "");
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

  filterToggle.addEventListener("click", function () {

    const isOpen = filtersBox.classList.toggle("open");

    filterToggle.setAttribute("aria-expanded", String(isOpen));
  });

  filtersBox.addEventListener("change", function (e) {

    if (e.target.name === "artistGender") {
      state.gender = e.target.value;
    }

    if (e.target.name === "artistKnown") {
      state.known = e.target.value;
    }

    startSearch();
  });

  loadArtists();
}