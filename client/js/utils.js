function showLoading() {
  const loader = document.getElementById('loadingScreen');
  if (loader) loader.classList.remove('hidden');
}

function hideLoading() {
  const loader = document.getElementById('loadingScreen');
  if (loader) loader.classList.add('hidden');
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function normalizeProperty(property = {}) {
  return {
    ...property,
    _id: property._id,
    title: property.title || 'Featured Property',
    description: property.description || 'A premium property curated for modern living.',
    address: property.address || property.location || 'Prime location',
    city: property.city || 'City',
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    area: property.area ?? 0,
    price: property.price ?? 0,
    propertyType: property.propertyType || property.type || 'Property',
    images: property.images || [],
    amenities: property.amenities || [],
    featured: Boolean(property.featured)
  };
}

function createPropertyCard(property) {
  const normalized = normalizeProperty(property);
  const image = normalized.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80';
  return `
    <article class="property-card reveal">
      <div class="property-media">
        <img src="${image}" alt="${normalized.title}" />
        <button class="favorite-btn" data-id="${normalized._id}" aria-label="Save property"><i class="fa-regular fa-heart"></i></button>
        ${normalized.featured ? '<span class="ribbon">Premium</span>' : ''}
      </div>
      <div class="property-body">
        <div class="flex-between">
          <span class="badge">${normalized.propertyType || 'Property'}</span>
          <span class="price-tag">${formatCurrency(normalized.price)}</span>
        </div>
        <h3 class="property-title">${normalized.title}</h3>
        <p class="text-muted">${normalized.address}, ${normalized.city}</p>
        <div class="property-meta">
          <span><i class="fa-solid fa-bed"></i> ${normalized.bedrooms} bd</span>
          <span><i class="fa-solid fa-bath"></i> ${normalized.bathrooms} ba</span>
          <span><i class="fa-solid fa-ruler-combined"></i> ${normalized.area} sqft</span>
        </div>
        <div class="flex-between" style="margin-top:1rem">
          <button class="btn btn-primary btn-small ripple" data-open="${normalized._id}">View Details</button>
          <button class="btn btn-outline btn-small" data-compare="${normalized._id}">Compare</button>
        </div>
      </div>
    </article>
  `;
}

function setTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('homehaven-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('homehaven-theme') || 'light';
  setTheme(saved);
}

function attachReveal() {
  document.querySelectorAll('.reveal').forEach((el, index) => {
    setTimeout(() => el.classList.add('visible'), index * 80);
  });
}
