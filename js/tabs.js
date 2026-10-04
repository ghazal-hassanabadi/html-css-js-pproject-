const allTabButtons = document.querySelectorAll("[data-tab]");
const tabSections = document.querySelectorAll(".tab-content");

export function showTab(tabId) {
  tabSections.forEach(function (section) {
    section.classList.remove("active");
  });

  const selectedSection = document.getElementById(tabId);

  if (!selectedSection) return;

  selectedSection.classList.add("active");

  localStorage.setItem("activeTab", tabId);

  allTabButtons.forEach(function (button) {
    button.classList.remove("tablinks-active");
    button.classList.add("tablinks");

    if (button.getAttribute("data-tab") === tabId) {
      button.classList.remove("tablinks");
      button.classList.add("tablinks-active");
    }
  });
}

export function initTabs() {
  document.addEventListener("click", function (e) {
    const tabButton = e.target.closest("[data-tab]");

    if (tabButton) {
      const selectedTabId = tabButton.getAttribute("data-tab");
      showTab(selectedTabId);
      return;
    }

    const link = e.target.closest("[data-goto]");

    if (!link) return;

    e.preventDefault();

    showTab(link.dataset.goto);
    window.scrollTo(0, 0);
  });

  const savedTab = localStorage.getItem("activeTab");

  if (savedTab) {
    showTab(savedTab);
  }
}