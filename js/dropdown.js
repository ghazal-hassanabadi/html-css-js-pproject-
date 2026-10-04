export function initSocialDropdown() {

  const socialToggle = document.querySelector("#socialToggle");
  const footerSocial = document.querySelector(".footer-social");

  if (!socialToggle || !footerSocial) {
    return;
  }

  function closeSocial() {

    footerSocial.classList.remove("open");

    socialToggle.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  socialToggle.addEventListener("click", function () {

    const isOpen =
      footerSocial.classList.toggle("open");

    socialToggle.setAttribute(
      "aria-expanded",
      isOpen
    );

  });

  document.addEventListener("click", function (e) {

    if (
      !footerSocial.contains(e.target) &&
      e.target !== socialToggle
    ) {
      closeSocial();
    }

  });

  document.addEventListener("keydown", function (e) {

    if (
      e.key === "Escape" &&
      footerSocial.classList.contains("open")
    ) {
      closeSocial();
    }

  });
}