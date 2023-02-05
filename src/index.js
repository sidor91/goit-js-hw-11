import Notiflix from 'notiflix';
import FetchImagesFromPixabay from './fetchImages';
const fetchImages = new FetchImagesFromPixabay();
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



async function onLoadMoreButtonClick() {
    try {
        const images = await fetchImages.fetchImages();
        fetchImages.incrementPage();
      renderImages(images.hits);
    } catch (error) {
      Notiflix.Notify.failure(`${error}`);
      console.log(error);
    }
}




async function onFormSubmit(e) {
    e.preventDefault();
    fetchImages.resetPage();
    galleryOfImages.innerHTML = '';
    fetchImages.searchQuery =
        e.currentTarget.elements.searchQuery.value.trim();
    
  try {
      const images = await fetchImages.fetchImages();
      fetchImages.incrementPage();
      console.log(images);
      
    if (images.total === 0) {
      checkLoadMoreBtnClass(images.total);
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
      
      renderImages(images.hits);
      checkLoadMoreBtnClass(images.total);
      
  } catch (error) {
      Notiflix.Notify.failure(`${error}`);
      console.log(error);
  }
    
  searchForm.reset();
}


function checkLoadMoreBtnClass(numberOfImages) {
    if (
        numberOfImages === 0 &&
        loadMoreButton.classList.contains('is-hidden')
    ) {
        return;
    } else if (numberOfImages !== 0) {
        loadMoreButton.classList.remove('is-hidden');
        return;
    }
     else if (
       numberOfImages === 0 &&
       !loadMoreButton.classList.contains('is-hidden')
     ) {
       loadMoreButton.classList.add('is-hidden');
     }
}