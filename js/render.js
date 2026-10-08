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

    return `
      <div class="movie-card">
        <div class="movie-poster">
          <img src="${poster}" alt="${title}">
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