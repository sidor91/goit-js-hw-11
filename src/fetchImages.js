const axios = require('axios').default; 


export default class FetchImagesFromPixabay {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
  }
  async fetchImages() {
    const searchParams = new URLSearchParams({
      key: '33349547-44f128e159fc9ba4be7374396',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    });
    const fetchUrl = await axios.get(
      `https://pixabay.com/api/?q=${this.searchQuery}&page=${this.page}&${searchParams}`
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
