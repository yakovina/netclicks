"use strict";

var _temp;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const menu = document.querySelector('.left-menu'),
  hamburger = menu.querySelector('.hamburger'),
  tvShowList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal'),
  tvShows = document.querySelector('.tv-shows'),
  tvCardImg = document.querySelector('.tv-card__img'),
  modalTitle = document.querySelector('.modal__title'),
  genresList = document.querySelector('.genres-list'),
  description = document.querySelector('.description'),
  modalLink = document.querySelector('.modal__link'),
  rating = document.querySelector('.rating'),
  searchForm = document.querySelector('.search__form'),
  searchFormInput = document.querySelector('.search__form-input'),
  preloader = document.querySelector('.preloader'),
  dropdown = document.querySelectorAll('.dropdown'),
  tvShowsHead = document.querySelector('.tv-shows__head'),
  posterWrapper = document.querySelector('.poster__wrapper'),
  modalContent = document.querySelector('.modal__content');
const loading = document.createElement('div');
loading.className = 'loading';
console.log(loading);
const IMAGE_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';
const DBService = (_temp = class DBService {
  constructor() {
    _defineProperty(this, "getData", async url => {
      const res = await fetch(url);

      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`${res.status}: Can not get data from ${url}`);
      }
    });

    _defineProperty(this, "getTestData", () => {
      return this.getData('test.json');
    });

    _defineProperty(this, "getTestCard", () => {
      return this.getData('card.json');
    });

    _defineProperty(this, "getSearchResult", query => {
      return this.getData(`${this.SERVER}search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`);
    });

    _defineProperty(this, "getTvShow", id => {
      return this.getData(`${this.SERVER}tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    });

    _defineProperty(this, "getTopRated", () => {
      return this.getData(`${this.SERVER}tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
    });

    _defineProperty(this, "getPopular", () => {
      return this.getData(`${this.SERVER}tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
    });

    _defineProperty(this, "getToday", () => {
      return this.getData(`${this.SERVER}tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
    });

    _defineProperty(this, "getWeek", () => {
      return this.getData(`${this.SERVER}tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
    });

    this.API_KEY = '0d0789b8356f956cde0d0456ca4fc0ae';
    this.SERVER = 'https://api.themoviedb.org/3/';
  }

}, _temp);
const dbService = new DBService();

const closeDropDown = () => {
  dropdown.forEach(item => {
    item.classList.remove('active');
  });
};

hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('open');
  menu.classList.toggle('openMenu');

  if (!menu.matches('openMenu')) {
    closeDropDown();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.left-menu')) {
    hamburger.classList.remove('open');
    menu.classList.remove('openMenu');
    closeDropDown();
  }
});
menu.addEventListener('click', event => {
  event.preventDefault();
  const target = event.target;
  const dropDown = target.closest('.dropdown');

  if (dropDown) {
    target.classList.toggle('active');
    hamburger.classList.add('open');
    menu.classList.add('openMenu');
  }

  if (target.closest('#top-rated')) {
    tvShows.append(loading);
    hamburger.classList.remove('open');
    menu.classList.remove('openMenu');
    dbService.getTopRated().then(response => {
      renderCard(response, target);
    });
  }

  if (target.closest('#popular')) {
    tvShows.append(loading);
    hamburger.classList.remove('open');
    menu.classList.remove('openMenu');
    dbService.getPopular().then(response => {
      renderCard(response, target);
    });
  }

  if (target.closest('#today')) {
    tvShows.append(loading);
    hamburger.classList.remove('open');
    menu.classList.remove('openMenu');
    dbService.getToday().then(response => {
      renderCard(response, target);
    });
  }

  if (target.closest('#week')) {
    tvShows.append(loading);
    hamburger.classList.remove('open');
    menu.classList.remove('openMenu');
    dbService.getWeek().then(response => {
      renderCard(response, target);
    });
  }

  if (target.closest('#search')) {
    tvShows.append(loading);
    hamburger.classList.remove('open');
    menu.classList.remove('openMenu');
    tvShowList.textContent = '';
    tvShowsHead.textContent = '';
  }
});

const changePhoto = event => {
  card = event.target.closest('.tv-shows__item');

  if (card) {
    const img = card.querySelector('.tv-card__img');

    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};

tvShowList.addEventListener('mouseout', changePhoto);
tvShowList.addEventListener('mouseover', changePhoto);
tvShowList.addEventListener('click', event => {
  const target = event.target,
    card = target.closest('.tv-shows__item');

  if (card) {
    preloader.style.display = 'block';
    console.log(card.id);
    dbService.getTvShow(card.id).then(data => {
      const {
        poster_path: posterPath,
        name: title,
        genres,
        vote_average: voteAverage,
        overview,
        homepage
      } = data;

      if (posterPath) {
        tvCardImg.src = IMAGE_URL + posterPath;
        tvCardImg.alt = title;
        posterWrapper.style.display = '';
        modalContent.style.paddingLeft = '';
      } else {
        posterWrapper.style.display = 'none';
        modalContent.style.paddingLeft = '25px';
      }

      modalTitle.innerHTML = title;
      genresList.textContent = '';
      genresList.insertAdjacentHTML('beforeend', genres.reduce((acc, item) => {
        return acc + `<li>${item.name}</li>`;
      }, ''));
      rating.textContent = voteAverage;
      description.textContent = overview;
      modalLink.href = homepage;
    }).then(() => {
      modal.classList.remove('hide');
      document.body.style.overflow = 'hidden';
    }).finally(() => {
      preloader.style.display = '';
    });
  }
});
modal.addEventListener('click', event => {
  event.preventDefault();
  const target = event.target;

  if (target.classList.contains('modal') || target.closest('.cross')) {
    modal.classList.add('hide');
    document.body.style.overflow = '';
  }
});

const renderCard = (data, target) => {
  tvShowList.textContent = '';

  if (!data.total_results) {
    loading.remove();
    tvShowsHead.textContent = 'Упс, по вашему запросу ничего не найдено :(';
    tvShowsHead.style.cssText = `color: red; text-decoration: underline`;
    return;
  }

  tvShowsHead.textContent = target ? target.textContent : 'Результат поиска :';
  tvShowsHead.style.cssText = `color: green; text-decoration: none`;
  data.results.forEach(item => {
    const card = document.createElement('li');
    card.classList.add('tv-shows__item');
    card.id = item.id;
    const {
      backdrop_path: backdrop,
      name: title,
      vote_average: vote,
      poster_path: poster
    } = item;
    const posterImg = poster ? IMAGE_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMAGE_URL + backdrop : 'img/no-poster.jpg';
    console.log();
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
    card.innerHTML = `
                    <a href="#"  class="tv-card">
                     ${voteElem}
                        <img class="tv-card__img"
                             src="${posterImg}"
                             data-backdrop="${backdropIMG}"
                             alt="${title}">
                        <h4 class="tv-card__head">${title}</h4>
                    </a>
         `;
    loading.remove();
    tvShowList.append(card);
  });
};

{
  tvShows.append(loading);
  dbService.getTestData().then(renderCard);
}
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  let value = searchFormInput.value.trim();

  if (value) {
    dbService.getSearchResult(value).then(renderCard);
    searchFormInput.value = '';
  }
});
