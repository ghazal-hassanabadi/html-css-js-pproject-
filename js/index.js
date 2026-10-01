/*----------------------------------tab--------------------------- */
const allTabButtons = document.querySelectorAll("[data-tab]");
const tabSections = document.querySelectorAll(".tab-content");


function showTab(tabId){
  tabSections.forEach(function(section) {
    section.classList.remove("active");
  });

   const selectedSection = document.getElementById(tabId);
   selectedSection.classList.add("active");

   allTabButtons.forEach(function(button) {
  button.classList.remove("tablinks-active");
  button.classList.add("tablinks");

  if(button.getAttribute("data-tab") === tabId){
    button.classList.remove("tablinks");
    button.classList.add("tablinks-active");
}
});


}


  document.addEventListener("click",function(e){
    if(!e.target.hasAttribute("data-tab")){
      
      return;
    }

    const selectedTabId =  e.target.getAttribute("data-tab");
    showTab(selectedTabId);
    
  });



/*--------------------------------------slider------------------------------------ */
const slides = document.querySelectorAll(".img1");
const autoPlayDelay = 3000;
let autoPlayTimer;
const dots = document.querySelectorAll(".dots button");
const nextBtn = document.querySelector("#nextBtn");
const backBtn = document.querySelector("#backBtn");
let currentIndex =0;


function showSlide(index) {
  index = (index + slides.length) % slides.length;

  slides.forEach(function (slide) {
    slide.classList.remove("active");
  });

  dots.forEach(function (dot) {
    dot.classList.remove("active");
  });

  slides[index].classList.add("active");
  dots[index].classList.add("active");

  currentIndex = index;
}

function startAutoPlay() {
  autoPlayTimer = setInterval(function () {
    showSlide(currentIndex + 1);
  }, autoPlayDelay);
}

nextBtn.addEventListener("click", function () {
  showSlide(currentIndex + 1);
});

backBtn.addEventListener("click", function () {
  showSlide(currentIndex - 1);
});

dots.forEach(function (dot) {
  dot.addEventListener("click", function () {
    showSlide(Number(dot.dataset.index));
  });
});

showSlide(0);
startAutoPlay();

/*--------------------------------------------api--------------------------------------*/

const API_KEY = "65f3fe83f5b5a5b8ff8be0ee85035657";
const BASE_URL = "https://api.themoviedb.org/3";

const moviesList = document.querySelector("#moviesList");
const seriesList = document.querySelector("#seriesList");


/*--------------------ساخت کارت (مشترک بین دو بخش)---------------*/

function renderCards(items, container) {
  container.innerHTML = items.map(item => {
    const title = item.title || item.name || item.original_title || item.original_name;
    const date = item.release_date || item.first_air_date || "";
    const year = date.split("-")[0];
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "—";

    const poster = item.poster_path
      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
      : "images/Popcorn.l.png";

    return `
      <div class="movie-card">
        <div class="movie-poster">
          <img src="${poster}" alt="${title}">
        </div>
        <span class="movie-rating"><i class="fa-solid fa-star"></i> ${rating}</span>
        <div class="movie-info">
          <h3 class="movie-title">${title}</h3>
          <span class="movie-year">${year}</span>
        </div>
      </div>
    `;
  }).join("");
}


/*--------------------بخش اول: جدیدترین فیلم ها---------------*/

async function getNewMovies() {
  try {
    const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fa-IR&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    renderCards(data.results.slice(0, 8), moviesList);
  } catch (err) {
    console.error("خطا در دریافت فیلم ها:", err);
  }
}


/*--------------------بخش دوم: سریال های ۲۰۲۵---------------*/

async function getSeries2025() {
  try {
    const url =
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=fa-IR` +
     `&first_air_date.gte=2025-01-01&first_air_date.lte=2026-12-31` +
      `&sort_by=popularity.desc&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    renderCards(data.results.slice(0, 8), seriesList);
  } catch (err) {
    console.error("خطا در دریافت سریال ها:", err);
  }
}

getNewMovies();
getSeries2025();


/*-------------------بازیگر---------------*/

const actorsList = document.querySelector("#actorsList");

function renderActors(items, container) {
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

async function getPopularActors() {
  try {
    // مرحله ۱: فیلم‌های محبوب
    const moviesRes = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    const moviesData = await moviesRes.json();

    // مرحله ۲: بازیگران اول هر فیلم
    const creditsList = await Promise.all(
      moviesData.results.slice(0, 10).map(m =>
        fetch(`${BASE_URL}/movie/${m.id}/credits?api_key=${API_KEY}&language=en-US`)
          .then(r => r.json())
      )
    );

    const seen = new Set();
    const actors = [];
    creditsList.forEach(c => {
      c.cast.slice(0, 2).forEach(p => {
        if (p.profile_path && !seen.has(p.id)) {
          seen.add(p.id);
          actors.push(p);
        }
      });
    });

    renderActors(actors.slice(0, 8), actorsList);
  } catch (err) {
    console.error("خطا در دریافت بازیگران:", err);
  }
}

getPopularActors();


/*-----------------------------------------modal--------------------------------------*/



const platforms = {
  android:{
      title: "پاپ‌کورن برای اندروید",
      icon: "fa-solid fa-mobile-screen",
      version: "1.0.0",
      downloadUrl: "#",
      guideUrl: "#",
  },

  windows:{
      title: "پاپ‌کورن برای ویندوز",
      icon: "fa-solid fa-laptop",
      version: "1.0.0",
      downloadUrl: "#",
      guideUrl: "#",    
  },

  ios:{
      title: "پاپ‌کورن برای ios",
      icon: "fa-brands fa-apple",
      version: "1.0.0",
      downloadUrl: "#",
      guideUrl: "#",        
  },

  tv: {
      title: "پاپ‌کورن برای تلویزیون",
      icon: "fa-solid fa-tv",
      version: "1.0.0",
      downloadUrl: "#",
      guideUrl: "#",       
  },
} ;

const appModal = document.querySelector("#appModal");
const modalClose = document.querySelector("#modalClose");
const modalIcon = document.querySelector("#modalIcon");
const modalTitle = document.querySelector("#modalTitle");
const modalVersion = document.querySelector("#modalVersion");
const modalDownload = document.querySelector("#modalDownload");
const modalGuide = document.querySelector("#modalGuide");
const appCards = document.querySelector(".app-cards");


function openModal (name) {
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

function closeModal () {
  appModal.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

appCards.addEventListener("click", function (e) {
  const card = e.target.closest(".app-card");
  if (!card) return;

  openModal(card.dataset.platform);

});

modalClose.addEventListener("click" , closeModal);

appModal.addEventListener("click", function (e) {
  if(e.target === appModal){
    closeModal();
  }

});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && appModal.classList.contains("open")) {
    closeModal();
  }
});



/*---------------------------footer dropdown---------------- */

const socialToggle = document.querySelector("#socialToggle");
const footerSocial = document.querySelector(".footer-social");

socialToggle.addEventListener("click", function(){
  

 
 
    const isOpen = footerSocial.classList.toggle("open");
    socialToggle.setAttribute("aria-expanded",isOpen );
 
});

function closeSocial () {
  footerSocial.classList.remove("open");
  socialToggle.setAttribute("aria-expanded","false");

}


  document.addEventListener("click", function(e) {
    if(!footerSocial.contains(e.target)){
      closeSocial();

    }

  })

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && footerSocial.classList.contains("open")) {
      closeSocial();
  }
});