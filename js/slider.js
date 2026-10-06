const slides = document.querySelectorAll(".img1");
const dots = document.querySelectorAll(".dots button");
const nextBtn = document.querySelector("#nextBtn");
const backBtn = document.querySelector("#backBtn");

const autoPlayDelay = 4000;

let autoPlayTimer;
let currentIndex = 0;

function showSlide(index) {
  index = (index + slides.length) % slides.length;

  slides.forEach(function (slide) {
    slide.classList.remove("active");
  });

  dots.forEach(function (dot) {
    dot.classList.remove("active");
  });

  if (slides[index]) {
    slides[index].classList.add("active");
  }

  if (dots[index]) {
    dots[index].classList.add("active");
  }

  currentIndex = index;
}

function startAutoPlay() {
  clearInterval(autoPlayTimer);

  autoPlayTimer = setInterval(function () {
    showSlide(currentIndex + 1);
  }, autoPlayDelay);
}

export function initSlider() {

  // اگر این صفحه Slider ندارد، کاری انجام نده
  if (!slides.length || !dots.length || !nextBtn || !backBtn) {
    return;
  }

  nextBtn.addEventListener("click", function () {
    showSlide(currentIndex + 1);
    startAutoPlay();
  });

  backBtn.addEventListener("click", function () {
    showSlide(currentIndex - 1);
    startAutoPlay();
  });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.dataset.index));
      startAutoPlay();
    });
  });

  showSlide(0);
  startAutoPlay();
}