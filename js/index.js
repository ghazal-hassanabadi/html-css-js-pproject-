import { initTabs } from "./tabs.js";
import { initSlider } from "./slider.js";
import { initFilters } from "./filter.js";
import { initModal } from "./modal.js";
import { initSocialDropdown } from "./dropdown.js";

import {
  getNewMovies,
  getSeries2025,
  getPopularActors
} from "./api.js";

import { renderCards, renderActors } from "./render.js";


initTabs();

initSlider();

initFilters();

initModal();

initSocialDropdown();


async function loadHomePage() {

  const moviesList = document.querySelector("#moviesList");
  const seriesList = document.querySelector("#seriesList");
  const actorsList = document.querySelector("#actorsList");

  if (moviesList) {

    try {

      const movies = await getNewMovies();

      renderCards(
        movies.slice(0, 8),
        moviesList
      );

    } catch (err) {

      console.error(
        "خطا در دریافت فیلم‌ها:",
        err
      );

    }

  }


  if (seriesList) {

    try {

      const series = await getSeries2025();

      renderCards(
        series.slice(0, 8),
        seriesList
      );

    } catch (err) {

      console.error(
        "خطا در دریافت سریال‌ها:",
        err
      );

    }

  }


  if (actorsList) {

    try {

      const actors = await getPopularActors();

      renderActors(
        actors,
        actorsList
      );

    } catch (err) {

      console.error(
        "خطا در دریافت بازیگران:",
        err
      );

    }

  }

}

loadHomePage();