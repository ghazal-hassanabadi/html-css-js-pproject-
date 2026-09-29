/*--------------------تنظیمات---------------*/

const API_KEY = "65f3fe83f5b5a5b8ff8be0ee85035657";
const BASE_URL = "https://api.themoviedb.org/3";

const moviesList = document.querySelector("#moviesList");
const seriesList = document.querySelector("#seriesList");


/*--------------------ساخت کارت (مشترک بین دو بخش)---------------*/

function renderCards(items, container) {
  container.innerHTML = items.map(item => {
    const title = item.title || item.name || item.original_title || item.original_name;
    const date = item.release_date || item.first_air_date || "";
    const year = date.split("-")[0];
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "—";

    const poster = item.poster_path
      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
      : "images/Popcorn.l.png";

    return `
      <div class="movie-card">
        <div class="movie-poster">
          <img src="${poster}" alt="${title}">
        </div>
        <span class="movie-rating"><i class="fa-solid fa-star"></i> ${rating}</span>
        <div class="movie-info">
          <h3 class="movie-title">${title}</h3>
          <span class="movie-year">${year}</span>
        </div>
      </div>
    `;
  }).join("");
}


/*--------------------بخش اول: جدیدترین فیلم ها---------------*/

async function getNewMovies() {
  try {
    const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fa-IR&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    renderCards(data.results.slice(0, 6), moviesList);
  } catch (err) {
    console.error("خطا در دریافت فیلم ها:", err);
  }
}


/*--------------------بخش دوم: سریال های ۲۰۲۵---------------*/

async function getSeries2025() {
  try {
    const url =
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=fa-IR` +
     `&first_air_date.gte=2025-01-01&first_air_date.lte=2026-12-31` +
      `&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    renderCards(data.results.slice(0, 6), seriesList);
  } catch (err) {
    console.error("خطا در دریافت سریال ها:", err);
  }
}

getNewMovies();
getSeries2025();