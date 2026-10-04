const API_KEY = "65f3fe83f5b5a5b8ff8be0ee85035657";

const BASE_URL = "https://api.themoviedb.org/3";

export async function getNewMovies() {
  const url =
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fa-IR&page=1`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("خطا در دریافت فیلم‌ها");
  }

  const data = await res.json();

  return data.results;
}

export async function getSeries2025() {
  const url =
    `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=fa-IR` +
    `&first_air_date.gte=2025-01-01&first_air_date.lte=2026-12-31` +
    `&sort_by=popularity.desc&page=1`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("خطا در دریافت سریال‌ها");
  }

  const data = await res.json();

  return data.results;
}

export async function getPopularActors() {

  const moviesRes = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );

  if (!moviesRes.ok) {
    throw new Error("خطا در دریافت فیلم‌های محبوب");
  }

  const moviesData = await moviesRes.json();

  const creditsList = await Promise.all(
    moviesData.results.slice(0, 10).map(function (movie) {

      return fetch(
        `${BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}&language=en-US`
      ).then(function (res) {
        if (!res.ok) {
          throw new Error("خطا در دریافت بازیگران");
        }

        return res.json();
      });

    })
  );

  const seen = new Set();
  const actors = [];

  creditsList.forEach(function (credits) {

    credits.cast.slice(0, 2).forEach(function (person) {

      if (person.profile_path && !seen.has(person.id)) {

        seen.add(person.id);
        actors.push(person);

      }

    });

  });

  return actors.slice(0, 10);
}

export { BASE_URL, API_KEY };