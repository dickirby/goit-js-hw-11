import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const api_key = '40896164-f1da9560ea8d9fe57ed00dc80';

const div = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const loadMore = document.querySelector('.load-more');

loadMore.hidden = true;
let page = 1;
let per_page = 40;
let search;

form.addEventListener('submit', event => {
  event.preventDefault();
  search = form.elements.searchQuery.value;
  div.innerHTML = '';
  page = 1;

  fetching(search, page, per_page)
    .then(images => {
      if (images.totalHits == 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query.Please try again.'
        );
      }
      Notiflix.Notify.success(`Hooray we found ${images.totalHits} images`);
      loadMore.hidden = false;
      renderImages(images);
      var lightbox = new SimpleLightbox('.photo-card a', {
        captionsData: 'alt',
      });
    })
    .catch(error => {
      throw new Error(error);
    });
  form.reset();
});

const renderImages = images => {
  const markupPicture = images.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
        tags,
      }) =>
        `<div class="photo-card">
          <a class="photo-link" href="${largeImageURL}">
            <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes<br></b>${likes}
            </p>
            <p class="info-item">
              <b>Views<br></b>${views}
            </p>
            <p class="info-item">
              <b>Comments<br></b>${comments}
            </p>
            <p class="info-item">
              <b>Downloads<br></b>${downloads}
            </p>
          </div>
        </div>`
    )
    .join('');
  div.insertAdjacentHTML('beforeend', markupPicture);
};

const fetching = async (search, page, per_page) => {
  const queryParameters = new URLSearchParams({
    key: api_key,
    q: search,
    per_page: per_page,
    page: page,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return await fetch(`https://pixabay.com/api/?${queryParameters}`).then(
    response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
};

loadMore.addEventListener('click', async () => {
  page += 1;

  fetching(search, page, per_page)
    .then(images => {
      const lastPage = images.totalHits / per_page;
      renderImages(images);
      var lightbox = new SimpleLightbox('.photo-card a', {
        captionsData: 'alt',
      });
      if (page >= lastPage) {
        Notiflix.Notify.failure(
          'Sorry, but you saw all images of your searchQuery'
        );
        loadMore.hidden = true;
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, but we have some problems. Please try to reload the page'
      );
      throw new Error(error);
    });
});
