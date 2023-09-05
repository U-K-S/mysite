const searchForm = document.querySelector('form');
const searchBox = document.querySelector('#search');
const searchResults = document.querySelector('#search-results');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchBox.value.trim();
  if (query === '') return;

  window.location.href = `searchProduct.html?searchQuery=${query}`;
});
