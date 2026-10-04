const platforms = {

  android: {
    title: "پاپ‌کورن برای اندروید",
    icon: "fa-solid fa-mobile-screen",
    version: "1.0.0",
    downloadUrl: "#",
    guideUrl: "#"
  },

  windows: {
    title: "پاپ‌کورن برای ویندوز",
    icon: "fa-solid fa-laptop",
    version: "1.0.0",
    downloadUrl: "#",
    guideUrl: "#"
  },

  ios: {
    title: "پاپ‌کورن برای ios",
    icon: "fa-brands fa-apple",
    version: "1.0.0",
    downloadUrl: "#",
    guideUrl: "#"
  },

  tv: {
    title: "پاپ‌کورن برای تلویزیون",
    icon: "fa-solid fa-tv",
    version: "1.0.0",
    downloadUrl: "#",
    guideUrl: "#"
  }

};

export function initModal() {

  const appModal = document.querySelector("#appModal");
  const modalClose = document.querySelector("#modalClose");
  const modalIcon = document.querySelector("#modalIcon");
  const modalTitle = document.querySelector("#modalTitle");
  const modalVersion = document.querySelector("#modalVersion");
  const modalDownload = document.querySelector("#modalDownload");
  const modalGuide = document.querySelector("#modalGuide");
  const appCards = document.querySelector(".app-cards");

  if (
    !appModal ||
    !modalClose ||
    !modalIcon ||
    !modalTitle ||
    !modalVersion ||
    !modalDownload ||
    !modalGuide ||
    !appCards
  ) {
    return;
  }

  function openModal(name) {

    const data = platforms[name];

    if (!data) return;

    modalTitle.textContent = data.title;
    modalVersion.textContent = data.version;
    modalIcon.className = data.icon;

    modalDownload.href = data.downloadUrl;
    modalGuide.href = data.guideUrl;

    appModal.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  function closeModal() {

    appModal.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  appCards.addEventListener("click", function (e) {

    const card = e.target.closest(".app-card");

    if (!card) return;

    openModal(card.dataset.platform);

  });

  modalClose.addEventListener("click", closeModal);

  appModal.addEventListener("click", function (e) {

    if (e.target === appModal) {
      closeModal();
    }

  });

  document.addEventListener("keydown", function (e) {

    if (
      e.key === "Escape" &&
      appModal.classList.contains("open")
    ) {
      closeModal();
    }

  });
}