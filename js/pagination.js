function getPageNumbers(current, total) {

  const pages = [];

  for (let i = 1; i <= total; i++) {

    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      pages.push(i);
    }
  }

  const result = [];

  pages.forEach(function (page, index) {

    if (index > 0 && page - pages[index - 1] > 1) {
      result.push("...");
    }

    result.push(page);
  });

  return result;
}

export function renderPagination(box, currentPage, totalPages) {

  if (totalPages <= 1) {
    box.innerHTML = "";
    return;
  }

  let html =
    `<button type="button" class="page-btn" data-page="${currentPage - 1}" ` +
    `${currentPage === 1 ? "disabled" : ""}>قبلی</button>`;

  getPageNumbers(currentPage, totalPages).forEach(function (page) {

    if (page === "...") {
      html += `<span>...</span>`;
      return;
    }

    html +=
      `<button type="button" class="page-btn ` +
      `${page === currentPage ? "active" : ""}" ` +
      `data-page="${page}">${page}</button>`;
  });

  html +=
    `<button type="button" class="page-btn" data-page="${currentPage + 1}" ` +
    `${currentPage === totalPages ? "disabled" : ""}>بعدی</button>`;

  box.innerHTML = html;
}