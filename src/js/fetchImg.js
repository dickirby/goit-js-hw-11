import axios from 'axios';

const api_key = '40896164-f1da9560ea8d9fe57ed00dc80';
axios.defaults.headers.common['x-api-key'] = api_key;

async function fetching(search, page, per_page) {
  const queryParameters = new URLSearchParams({
    key: api_key,
    q: search,
    per_page: per_page,
    page: page,
  });

  axios
    .get(
      `https://pixabay.com/api/?${queryParameters}&image_type=photo&orientation=horizontal`
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error);
    });
}

export { fetching };
