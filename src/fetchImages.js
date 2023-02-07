const axios = require('axios').default; 

export default class FetchImagesFromPixabay {
    constructor() {
        this.searchQuery = '';
      this.page = 1;
      this.perPage = 42;
  }
  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: '33349547-44f128e159fc9ba4be7374396',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: this.perPage,
    });
    const fetchUrl = await axios.get(
      `${BASE_URL}?q=${this.searchQuery}&page=${this.page}&${searchParams}`
    );
    return fetchUrl.data;
  }
    
    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
    
    
    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
