export function initSidebar() {

  const openBtn = document.querySelector("#userBtn");
  const sideMenu = document.querySelector("#sideMenu");
  const sideOverlay = document.querySelector("#sideOverlay");
  const sideClose = document.querySelector("#sideClose");
  const darkToggle = document.querySelector("#darkToggle");
  const darkIcon = document.querySelector("#darkIcon");

  if (
    !openBtn ||
    !sideMenu ||
    !sideOverlay ||
    !sideClose ||
    !darkToggle ||
    !darkIcon
  ) {
    return;
  }

  function openMenu() {

    sideMenu.classList.add("open");
    sideOverlay.classList.add("open");
    sideMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeMenu() {

    sideMenu.classList.remove("open");
    sideOverlay.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function applyTheme(isDark) {

    document.body.classList.toggle("dark-mode", isDark);

    darkToggle.setAttribute("aria-pressed", String(isDark));

    darkIcon.classList.toggle("fa-moon", !isDark);
    darkIcon.classList.toggle("fa-sun", isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  openBtn.addEventListener("click", openMenu);

  sideClose.addEventListener("click", closeMenu);

  sideOverlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", function (e) {

    if (
      e.key === "Escape" &&
      sideMenu.classList.contains("open")
    ) {
      closeMenu();
    }

  });

  darkToggle.addEventListener("click", function () {

    const isDark = !document.body.classList.contains("dark-mode");

    applyTheme(isDark);

  });

  applyTheme(localStorage.getItem("theme") === "dark");
}