import { BASE_URL, API_KEY } from "./api.js";
import { renderCards, showMessage } from "./render.js";

const animationGenreIds = {
  family: 10751,
  comedy: 35,
  adventure: 12,
  fantasy: 14,
  action: 28,
  scifi: 878,
  drama: 18
};

const ageCertifications = {
  g: "G",
  pg: "PG",
  pg13: "PG-13",
  r: "R"
};

const animationGenreId = 16;

const resultsPerPage = 20;

function getSelectedAnimationGenres() {

  const checkedBoxes = document.querySelectorAll(
    'input[name="animationGenre"]:checked'
  );

  const result = [];

  checkedBoxes.forEach(function (box) {

    const code = animationGenreIds[box.value];

    if (code) {
      result.push(code);
    }

  });

  return result;
}

function getSelectedAge() {

  const checkedRadio = document.querySelector(
    'input[name="age"]:checked'
  );

  if (!checkedRadio) return "";

  return checkedRadio.value;
}

function getAnimationYear() {

  const yearInput = document.querySelector("#animationYearFilter");

  if (!yearInput) return "";

  return yearInput.value;
}

function buildAnimationUrl() {

  const genres = getSelectedAnimationGenres();
  const age = getSelectedAge();
  const year = getAnimationYear();

  const allGenres = [animationGenreId].concat(genres);

  let address =
    `${BASE_URL}/discover/movie` +
    `?api_key=${API_KEY}` +
    `&language=fa-IR` +
    `&sort_by=popularity.desc` +
    `&with_genres=${allGenres.join(",")}`;

  if (year !== "") {
    address += "&primary_release_year=" + year;
  }

  if (age !== "" && ageCertifications[age]) {
    address += "&certification_country=US";
    address += "&certification=" + ageCertifications[age];
  }

  return address;
}

export async function getFilteredAnimations(container) {

  showMessage(container, "در حال بارگذاری...");

  try {

    const url = buildAnimationUrl();

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("bad response");
    }

    const data = await res.json();

    if (data.results.length === 0) {
      showMessage(container, "انیمیشنی با این مشخصات پیدا نشد");
      return;
    }

    renderCards(
      data.results.slice(0, resultsPerPage),
      container
    );

  } catch (err) {

    console.error("خطا در دریافت انیمیشن:", err);

    showMessage(
      container,
      "مشکلی پیش آمد. اینترنت خود را بررسی کن و دوباره تلاش کن"
    );
  }
}

export function initAnimationFilter() {

  const animationResults = document.querySelector("#animationList");
  const applyBtn = document.querySelector("#applyAnimationFilterBtn");
  const clearBtn = document.querySelector("#clearAnimationFilterBtn");
  const filterForm = document.querySelector("#animationFilterForm");

  if (!animationResults || !applyBtn || !clearBtn || !filterForm) {
    return;
  }

  applyBtn.addEventListener("click", function () {
    getFilteredAnimations(animationResults);
  });

  clearBtn.addEventListener("click", function () {

    filterForm.reset();

    getFilteredAnimations(animationResults);

  });

  getFilteredAnimations(animationResults);
}