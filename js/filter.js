import { BASE_URL, API_KEY } from "./api.js";
import { renderCards } from "./render.js";

const genreIds = {
  romance: 10749,
  horror: 27,
  crime: 80,
  comedy: 35,
  action: 28,
  animation: 16,
  drama: 18,
  adventure: 12
};

const resultsPerPage = 20;

function getSelectedGenres() {

  const checkedBoxes = document.querySelectorAll(
    'input[name="genre"]:checked'
  );

  const result = [];

  checkedBoxes.forEach(function (box) {

    const code = genreIds[box.value];

    if (code) {
      result.push(code);
    }

  });

  return result;
}

function getSelectedCategory() {

  const movieBox = document.querySelector(
    'input[name="category"][value="movie"]:checked'
  );

  const seriesBox = document.querySelector(
    'input[name="category"][value="series"]:checked'
  );

  if (seriesBox && !movieBox) {
    return "tv";
  }

  return "movie";
}

function getSelectedYear() {

  const yearFilter = document.querySelector("#yearFilter");

  if (!yearFilter) return "";

  return yearFilter.value;
}

function buildDiscoverUrl() {

  const genres = getSelectedGenres();
  const category = getSelectedCategory();
  const year = getSelectedYear();

  let address =
    `${BASE_URL}/discover/${category}` +
    `?api_key=${API_KEY}` +
    `&language=fa-IR` +
    `&sort_by=popularity.desc`;

  if (genres.length > 0) {
    address += "&with_genres=" + genres.join(",");
  }

  if (year !== "") {

    if (category === "movie") {
      address += "&primary_release_year=" + year;
    } else {
      address += "&first_air_date_year=" + year;
    }

  }

  return address;
}

export async function getFilteredMovies(container) {

  try {

    const url = buildDiscoverUrl();

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("bad response");
    }

    const data = await res.json();

    if (data.results.length === 0) {

      container.textContent = "فیلمی با این مشخصات پیدا نشد";

      return;
    }

    renderCards(
      data.results.slice(0, resultsPerPage),
      container
    );

  } catch (err) {

    console.error("خطا در دریافت فیلتر:", err);

    container.textContent =
      "مشکلی پیش آمد. اینترنت خود را بررسی کن و دوباره تلاش کن";
  }
}

export function initFilters() {

  const filterResults = document.querySelector("#movieList");
  const applyBtn = document.querySelector("#applyMovieFilterBtn");
  const clearBtn = document.querySelector("#clearMovieFilterBtn");
  const filterForm = document.querySelector("#movieFilterForm");

  if (!filterResults || !applyBtn || !clearBtn || !filterForm) {
    return;
  }

  applyBtn.addEventListener("click", function () {
    getFilteredMovies(filterResults);
  });

  clearBtn.addEventListener("click", function () {

    filterForm.reset();

    getFilteredMovies(filterResults);

  });

  getFilteredMovies(filterResults);
}