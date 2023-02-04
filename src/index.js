import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import FetchImagesFromPixabay from './fetchImages';
const fetchImagesFromPixabay = new FetchImagesFromPixabay();


const axios = require('axios').default;

const searchForm = document.querySelector('.search-form');
const galleryOfImages = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onLoadMoreButtonClick);


function renderImages(images) {
  const imagesMarkup = images
    .map(image => {
      return `<div class="photo-card">
      <img src=${image.webformatURL} alt=${image.tag} loading="lazy"/>
      <div class="info">
      <p class="info-item"><b>Likes: ${image.likes}</b></p>
      <p class="info-item"><b>Views: ${image.views}</b></p>
      <p class="info-item"><b>Comments: ${image.comments}</b></p>
      <p class="info-item"><b>Downloads: ${image.downloads}</b></p>
      </div>
      </div>`;
    })
    .join('');
    galleryOfImages.insertAdjacentHTML('beforeend', imagesMarkup);
}

function checkLoadMoreBtnClass() {
  if (loadMoreButton.classList.contains('is-hidden')) {
    return;
  }
  loadMoreButton.classList.toggle('is-hidden');
}

async function onLoadMoreButtonClick() {
    try {
      const images = await fetchImagesFromPixabay.fetchImages();
      renderImages(images.hits);
    } catch (error) {
      Notiflix.Notify.failure(`${error}`);
      console.log(error);
    }
}




async function onFormSubmit(e) {
    e.preventDefault();
    fetchImagesFromPixabay.page = 1;
    galleryOfImages.innerHTML = '';
    fetchImagesFromPixabay.searchQuery =
      e.currentTarget.elements.searchQuery.value.trim();
  try {
    const images = await fetchImagesFromPixabay.fetchImages();
    console.log(images);
    if (images.total === 0) {
      checkLoadMoreBtnClass();
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    renderImages(images.hits);
    if (loadMoreButton.classList.contains('is-hidden')) {
      loadMoreButton.classList.toggle('is-hidden');
    }
  } catch (error) {
      Notiflix.Notify.failure(`${error}`);
      console.log(error);
  }
  searchForm.reset();
}