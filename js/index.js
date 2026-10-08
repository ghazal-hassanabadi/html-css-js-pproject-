import { initTabs } from "./tabs.js";
import { initSlider } from "./slider.js";
import { initFilters } from "./filter.js";
import { initModal } from "./modal.js";
import { initSocialDropdown } from "./dropdown.js";
import { initSidebar } from "./slidebar.js";
import { initLogin } from "./login.js";
import { initSignup } from "./signin.js";

import {
  getNewMovies,
  getSeries2025,
  getPopularActors
} from "./api.js";

import { renderCards, renderActors, showMessage } from "./render.js";


initTabs();

initSlider();

initFilters();

initModal();

initSocialDropdown();

initSidebar();

initLogin();

initSignup();

async function loadSection(container, getData, render, errorText) {

  if (!container) return;

  showMessage(container, "در حال بارگذاری...");

  try {

    const items = await getData();

    if (items.length === 0) {
      showMessage(container, "موردی پیدا نشد");
      return;
    }

    render(items, container);

  } catch (err) {

    console.error(errorText, err);

    showMessage(container, "مشکلی پیش آمد. دوباره تلاش کن");
  }
}


function loadHomePage() {

  loadSection(
    document.querySelector("#moviesList"),
    getNewMovies,
    function (items, box) {
      renderCards(items.slice(0, 8), box);
    },
    "خطا در دریافت فیلم‌ها:"
  );

  loadSection(
    document.querySelector("#seriesList"),
    getSeries2025,
    function (items, box) {
      renderCards(items.slice(0, 8), box);
    },
    "خطا در دریافت سریال‌ها:"
  );

  loadSection(
    document.querySelector("#actorsList"),
    getPopularActors,
    renderActors,
    "خطا در دریافت بازیگران:"
  );
}

loadHomePage();