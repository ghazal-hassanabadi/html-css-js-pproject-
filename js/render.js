import { isFavorite, makeKey, toggleFavorite } from "./favorites.js";

const cardData = new Map();

export const genreNames = {
  28: "اکشن",
  12: "ماجراجویی",
  16: "انیمیشن",
  35: "کمدی",
  80: "جنایی",
  99: "مستند",
  18: "درام",
  10751: "خانوادگی",
  14: "فانتزی",
  36: "تاریخی",
  27: "ترسناک",
  10402: "موسیقی",
  9648: "معمایی",
  10749: "عاشقانه",
  878: "علمی‌تخیلی",
  10770: "فیلم تلویزیونی",
  53: "هیجان‌انگیز",
  10752: "جنگی",
  37: "وسترن",
  10759: "اکشن و ماجراجویی",
  10762: "کودک",
  10763: "خبری",
  10764: "واقعیت",
  10765: "علمی‌تخیلی و فانتزی",
  10766: "سریال طولانی",
  10767: "گفتگو",
  10768: "جنگ و سیاست"
};

function getGenreText(item) {

  const ids = item.genre_ids || [];
  const names = [];

  ids.forEach(function (id) {

    if (genreNames[id]) {
      names.push(genreNames[id]);
    }
  });

  return names.slice(0, 2).join(" • ");
}


export function renderCards(items, container) {
  container.innerHTML = items.map(item => {
    const title =
      item.title ||
      item.name ||
      item.original_title ||
      item.original_name;

    const date = item.release_date || item.first_air_date || "";
    const year = date.split("-")[0];

    const rating = item.vote_average
      ? item.vote_average.toFixed(1)
      : "—";

    const poster = item.poster_path
      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
      : "images/Popcorn.l.png";

    // سه خط جدید برای علاقه‌مندی
    const key = makeKey(item);
    cardData.set(key, item);
    const faved = isFavorite(key);

    return `
      <div class="movie-card">
        <div class="movie-poster">
          <img src="${poster}" alt="${title}">

          <button type="button" class="fav-btn ${faved ? "active" : ""}"
                  data-fav="${key}" aria-label="علاقه‌مندی">
            <i class="${faved ? "fa-solid" : "fa-regular"} fa-heart"></i>
          </button>

          <div class="movie-overlay">
            <span class="movie-genres">${getGenreText(item)}</span>
            <p class="movie-overview">${item.overview || "خلاصه‌ای موجود نیست"}</p>
          </div>
        </div>

        <span class="movie-rating">
          <i class="fa-solid fa-star"></i> ${rating}
        </span>

        <div class="movie-info">
          <h3 class="movie-title">${title}</h3>
          <span class="movie-year">${year}</span>
        </div>
      </div>
    `;
  }).join("");
}


export function renderActors(items, container) {
  container.innerHTML = items.map(actor => {

    const photo = actor.profile_path
      ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
      : "images/Popcorn.l.png";

    return `
      <div class="actor-card">
        <div class="actor-photo">
          <img src="${photo}" alt="${actor.name}">
        </div>

        <h3 class="actor-name">${actor.name}</h3>
      </div>
    `;

  }).join("");
}

export function showMessage(container, text) {

  container.innerHTML = `<p class="state-message">${text}</p>`;
}


// کلیک روی قلب: اضافه یا حذف از علاقه‌مندی‌ها
export function initFavoriteButtons() {

  document.addEventListener("click", function (e) {

    const btn = e.target.closest(".fav-btn");

    if (!btn) return;

    const item = cardData.get(btn.dataset.fav);

    if (!item) return;

    const nowFav = toggleFavorite(item);

    document
      .querySelectorAll(`.fav-btn[data-fav="${btn.dataset.fav}"]`)
      .forEach(function (b) {
        b.classList.toggle("active", nowFav);
        b.querySelector("i").className =
          (nowFav ? "fa-solid" : "fa-regular") + " fa-heart";
      });
  });
}