document.addEventListener('DOMContentLoaded', () => {
  const filterForm = document.getElementById('filterForm');
  if (filterForm) {
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const params = new URLSearchParams();
      const search = document.getElementById('searchInput').value.trim();
      const city = document.getElementById('cityFilter').value.trim();
      const type = document.getElementById('typeFilter').value;
      const bedrooms = document.getElementById('bedroomsFilter').value;
      const minPrice = document.getElementById('minPriceFilter').value;
      const maxPrice = document.getElementById('maxPriceFilter').value;
      if (search) params.set('search', search);
      if (city) params.set('city', city);
      if (type) params.set('type', type);
      if (bedrooms) params.set('bedrooms', bedrooms);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      window.location.href = `listings.html?${params.toString()}`;
    });
  }
});
