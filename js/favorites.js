const KEY = "popcorn-favorites";

export function getType(item) {
  return item.media_type || (item.title ? "movie" : "tv");
}

export function makeKey(item) {
  return getType(item) + "-" + item.id;
}

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch (err) {
    return [];
  }
}

function saveList(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function isFavorite(key) {
  return getFavorites().some(function (fav) {
    return fav.key === key;
  });
}

export function addFavorite(item) {

  const key = makeKey(item);
  const list = getFavorites();

  if (list.some(function (fav) { return fav.key === key; })) return;

  const date = item.release_date || item.first_air_date || "";

  list.push({
    key: key,
    id: item.id,
    type: getType(item),
    title: item.title || item.name || item.original_title || item.original_name,
    poster: item.poster_path,
    year: date.split("-")[0],
    rating: item.vote_average || 0,
    genreIds: (item.genre_ids || []).slice(0, 2),
    addedAt: Date.now()
  });

  saveList(list);
}

export function removeFavorite(key) {

  const list = getFavorites().filter(function (fav) {
    return fav.key !== key;
  });

  saveList(list);
}

// اگر بعد از تغییر در لیست باشد true برمی‌گرداند
export function toggleFavorite(item) {

  const key = makeKey(item);

  if (isFavorite(key)) {
    removeFavorite(key);
    return false;
  }

  addFavorite(item);
  return true;
}