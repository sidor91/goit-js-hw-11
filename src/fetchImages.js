const axios = require('axios').default;


export async function fetchImages(query) {
  const searchParams = new URLSearchParams({
    key: '33349547-44f128e159fc9ba4be7374396',
    q: `${query}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });
    const fetchUrl = await axios.get(`https://pixabay.com/api/?${searchParams}`);
    return fetchUrl.data;
}
