const allTabButtons = document.querySelectorAll("[data-tab]");
const tabSections = document.querySelectorAll(".tab-content");

export function showTab(tabId) {

  const selectedSection = document.getElementById(tabId);

  // اگر این صفحه آن تب را ندارد، کاری انجام نده
  if (!selectedSection) return;

  tabSections.forEach(function (section) {
    section.classList.remove("active");
  });

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

      // صفحه‌ی دیگر (مثل ورود): تب را ذخیره کن و به صفحه‌ی اصلی برو
      if (!document.getElementById(selectedTabId)) {
        localStorage.setItem("activeTab", selectedTabId);
        window.location.href = "index.html";
        return;
      }

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