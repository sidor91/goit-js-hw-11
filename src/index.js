import Notiflix from 'notiflix';
import FetchImagesFromPixabay from './fetchImages';
import SimpleLightbox from 'simplelightbox';
// import InfiniteScroll from 'infinite-scroll';
import 'simplelightbox/dist/simple-lightbox.min.css';
const fetchImages = new FetchImagesFromPixabay();
const lightbox = new SimpleLightbox('.gallery__link');



const searchForm = document.querySelector('.search-form');
const galleryOfImages = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const submitBtn = document.querySelector('.submit__button');


searchForm.addEventListener('submit', onFormSubmit);
galleryOfImages.addEventListener('click', onGalleryItemClick);
loadMoreButton.addEventListener('click', onLoadMoreButtonClick);


async function onFormSubmit(e) {
  e.preventDefault();
  fetchImages.resetPage();
  galleryOfImages.innerHTML = '';
  fetchImages.searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  searchQueryCheck();

    try {
      const images = await fetchImages.fetchImages();
      console.log(images);
      loadMoreBtnCheck(images);

      if (images.totalHits === 0) {
        searchForm.reset();
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
      renderImages(images.hits);
      fetchImages.incrementPage();
      searchForm.reset();
    } catch (error) {
      Notiflix.Notify.failure(`${error}`);
      console.log(error);
    }
}


function renderImages(images) {
  const imagesMarkup = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tag,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href= ${largeImageURL} class="gallery__link">
        <div class="gallery__item">
    <img src=${webformatURL} alt=${tag} loading="lazy" class="gallery__image"/>
      <div class="info">
      <p class="info-item"><b>Likes: ${likes}</b></p>
      <p class="info-item"><b>Views: ${views}</b></p>
      <p class="info-item"><b>Comments: ${comments}</b></p>
      <p class="info-item"><b>Downloads: ${downloads}</b></p>
      </div>
  </div>
  </a>
      `;
      }
    )
    .join('');
  galleryOfImages.insertAdjacentHTML('beforeend', imagesMarkup);
  lightbox.refresh();
}


async function onLoadMoreButtonClick() {
  try {
    const images = await fetchImages.fetchImages();
    loadMoreBtnCheck(images);
    renderImages(images.hits);
    fetchImages.incrementPage();

  } catch (error) {
    Notiflix.Notify.failure(`${error}`);
    console.log(error);
  }
}


function onGalleryItemClick(e) {
  e.preventDefault();
  const isGalleryImage = e.target.classList.contains('gallery__image');

  if (!isGalleryImage) {
    return;
  }

  lightbox.open(e.target.parentNode);
}


function loadMoreBtnCheck(images) {
  const maxPages = Math.ceil(images.totalHits / fetchImages.perPage);
  const currentPage = fetchImages.page;
      if (
        maxPages > currentPage &&
        loadMoreButton.classList.contains('is-hidden')
      ) {
        loadMoreButton.classList.remove('is-hidden');
      } else if (
        maxPages === currentPage &&
        loadMoreButton.classList.contains('is-hidden')
      ) {
        return;
      } else if (
        maxPages === currentPage &&
        !loadMoreButton.classList.contains('is-hidden')
      ) {
        loadMoreButton.classList.add('is-hidden');
      } else if (images.totalHits === 0) {
        loadMoreButton.classList.add('is-hidden');
      }
}


function searchQueryCheck() {
  if (
    fetchImages.searchQuery === '' &&
    !loadMoreButton.classList.contains('is-hidden')
  ) {
    loadMoreButton.classList.add('is-hidden');
    return Notiflix.Notify.warning('Please enter a search request');
  } else if (fetchImages.searchQuery === '') {
    return Notiflix.Notify.warning('Please enter a search request');
  }
}

