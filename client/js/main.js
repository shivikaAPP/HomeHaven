const apiBase = '/api';
const state = { token: localStorage.getItem('homehavenToken') || null, user: null, compare: [] };

async function requestJson(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(apiBase + url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

async function loadFeaturedProperties() {
  showLoading();
  try {
    const res = await requestJson('/properties/featured');
    const container = document.getElementById('featuredProperties');
    if (container) {
      container.innerHTML = (res.data || []).map(createPropertyCard).join('');
      attachReveal();
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

async function loadCategories() {
  try {
    const res = await requestJson('/categories');
    const container = document.getElementById('categoryGrid');
    if (container) {
      container.innerHTML = (res.data || []).map(category => `
        <a class="category-card reveal" href="category.html?slug=${category.slug}">
          <div class="category-icon"><i class="fa-solid fa-${category.icon || 'home'}"></i></div>
          <h3>${category.name}</h3>
          <p>${category.description || 'Discover elegant spaces'}</p>
        </a>
      `).join('');
      attachReveal();
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadListings() {
  showLoading();
  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search') || '';
    const city = params.get('city') || '';
    const type = params.get('type') || '';
    const bedrooms = params.get('bedrooms') || '';
    const minPrice = params.get('minPrice') || '';
    const maxPrice = params.get('maxPrice') || '';
    const url = `/properties?search=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}&type=${encodeURIComponent(type)}&bedrooms=${bedrooms}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    const res = await requestJson(url);
    const container = document.getElementById('propertyGrid');
    if (container) {
      container.innerHTML = (res.data || []).length ? (res.data || []).map(createPropertyCard).join('') : '<div class="empty-state">No listings match your filters yet.</div>';
      attachReveal();
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

async function loadCategoryPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) return;
  showLoading();
  try {
    const res = await requestJson(`/categories/${slug}`);
    const category = res.data?.category;
    const properties = res.data?.properties || [];
    const hero = document.getElementById('pageTitle');
    const meta = document.getElementById('pageMeta');
    const grid = document.getElementById('categoryProperties');
    if (hero) hero.textContent = category?.name || 'Category';
    if (meta) meta.textContent = category?.description || 'Discover premium properties in this category.';
    if (grid) {
      grid.innerHTML = properties.length ? properties.map(createPropertyCard).join('') : '<div class="empty-state">No properties available for this category yet.</div>';
      attachReveal();
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

async function openProperty(id) {
  try {
    const res = await requestJson(`/properties/${id}`);
    const property = res.data;
    const modal = document.getElementById('modal');
    const body = document.getElementById('modalBody');
    if (modal && body) {
      body.innerHTML = `
        <div class="detail-panel">
          <div class="gallery-grid">
            <img src="${property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80'}" alt="${property.title}" />
            <div class="grid-2">
              ${[1,2,3].map(index => `<img src="${property.images?.[index] || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'}" alt="${property.title}" />`).join('')}
            </div>
          </div>
          <div class="flex-between">
            <div>
              <span class="badge">${property.propertyType || 'Property'}</span>
              <h2 class="page-title" style="margin-top:.7rem">${property.title}</h2>
              <p class="page-meta">${property.address}, ${property.city}</p>
            </div>
            <div class="price-tag" style="font-size:1.4rem">${formatCurrency(property.price)}</div>
          </div>
          <div class="info-strip">
            <span class="badge"><i class="fa-solid fa-bed"></i> ${property.bedrooms} Beds</span>
            <span class="badge"><i class="fa-solid fa-bath"></i> ${property.bathrooms} Baths</span>
            <span class="badge"><i class="fa-solid fa-ruler-combined"></i> ${property.area} sqft</span>
            <span class="badge"><i class="fa-solid fa-car"></i> ${property.parking || 1} Parking</span>
          </div>
          <p>${property.description}</p>
          <div class="grid-2">
            <div class="dashboard-card">
              <h3>Book a Visit</h3>
              <div class="form-grid">
                <input id="visitorName" placeholder="Your Name" />
                <input id="visitorEmail" placeholder="Email" />
                <input id="visitorPhone" placeholder="Phone" />
                <textarea id="visitorMessage" rows="3" placeholder="Tell us your interest"></textarea>
                <button class="btn btn-primary" id="sendEnquiry">Send Enquiry</button>
              </div>
            </div>
            <div class="dashboard-card">
              <h3>Location</h3>
              <div class="map-card"><iframe src="https://www.google.com/maps?q=${encodeURIComponent(property.address + ' ' + property.city)}&output=embed"></iframe></div>
            </div>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
      document.getElementById('sendEnquiry')?.addEventListener('click', async () => {
        try {
          await requestJson('/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propertyId: property._id, name: document.getElementById('visitorName').value, email: document.getElementById('visitorEmail').value, phone: document.getElementById('visitorPhone').value, message: document.getElementById('visitorMessage').value }) });
          alert('Enquiry sent successfully');
          modal.classList.add('hidden');
        } catch (error) {
          alert(error.message);
        }
      });
    }
  } catch (error) {
    alert(error.message);
  }
}

async function loginUser() {
  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPassword')?.value;
  try {
    const res = await requestJson('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem('homehavenToken', res.token);
    document.getElementById('authMessage').textContent = 'Welcome back!';
    renderAuthState();
  } catch (error) {
    document.getElementById('authMessage').textContent = error.message;
  }
}

async function registerUser() {
  const payload = { name: document.getElementById('regName').value, email: document.getElementById('regEmail').value, password: document.getElementById('regPassword').value, phone: document.getElementById('regPhone').value, address: document.getElementById('regAddress').value };
  try {
    const res = await requestJson('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem('homehavenToken', res.token);
    document.getElementById('authMessage').textContent = 'Account created successfully';
    renderAuthState();
  } catch (error) {
    document.getElementById('authMessage').textContent = error.message;
  }
}

function renderAuthState() {
  const button = document.getElementById('authButton');
  if (button) button.textContent = state.user ? 'Dashboard' : 'Login';
}

async function updateProfile() {
  if (!state.token) {
    window.location.href = 'auth.html';
    return;
  }
  try {
    const payload = {
      name: document.getElementById('profileName')?.value || '',
      phone: document.getElementById('profilePhone')?.value || '',
      address: document.getElementById('profileAddress')?.value || ''
    };
    const res = await requestJson('/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    state.user = res.user;
    alert('Profile updated successfully');
  } catch (error) {
    alert(error.message);
  }
}

async function adminLogin() {
  try {
    const res = await requestJson('/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.getElementById('adminEmail').value, password: document.getElementById('adminPassword').value }) });
    localStorage.setItem('homehavenAdminToken', res.token);
    document.getElementById('adminMessage').textContent = 'Admin access granted';
    await loadAdminDashboard();
  } catch (error) {
    document.getElementById('adminMessage').textContent = error.message;
  }
}

async function loadAdminDashboard() {
  try {
    const res = await requestJson('/admin/dashboard');
    const data = res.data;
    const target = document.getElementById('adminStats');
    if (target) {
      target.innerHTML = `
        <div class="stat-card"><h3>${data.totalProperties}</h3><p>Properties</p></div>
        <div class="stat-card"><h3>${data.totalUsers}</h3><p>Users</p></div>
        <div class="stat-card"><h3>${data.totalCategories}</h3><p>Categories</p></div>
        <div class="stat-card"><h3>${data.totalEnquiries}</h3><p>Enquiries</p></div>
      `;
    }
  } catch (error) {
    console.error(error);
  }
}

function logout() {
  localStorage.removeItem('homehavenToken');
  state.token = null;
  state.user = null;
  renderAuthState();
  window.location.href = 'index.html';
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-open]');
    if (openButton) {
      openProperty(openButton.getAttribute('data-open'));
      return;
    }
    const compareButton = event.target.closest('[data-compare]');
    if (compareButton) {
      const id = compareButton.getAttribute('data-compare');
      state.compare = state.compare.includes(id) ? state.compare.filter(item => item !== id) : [...state.compare, id];
      const bar = document.getElementById('compareBar');
      if (bar) {
        bar.classList.toggle('active', state.compare.length > 0);
        bar.innerHTML = `<span>${state.compare.length} selected</span><button class="btn btn-outline btn-small">Compare</button>`;
      }
    }
    const favoriteButton = event.target.closest('.favorite-btn');
    if (favoriteButton) {
      favoriteButton.classList.toggle('active');
      const icon = favoriteButton.querySelector('i');
      icon.className = favoriteButton.classList.contains('active') ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
  });

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    setTheme(next);
  });

  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('mobileNav')?.classList.toggle('hidden');
  });

  document.getElementById('authButton')?.addEventListener('click', () => {
    if (state.user) window.location.href = 'dashboard.html';
    else window.location.href = 'auth.html';
  });

  document.getElementById('closeModal')?.addEventListener('click', () => document.getElementById('modal').classList.add('hidden'));
  document.getElementById('searchForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    window.location.href = `listings.html?search=${encodeURIComponent(query)}`;
  });
}

function initApp() {
  initTheme();
  bindEvents();
  renderAuthState();
  if (document.getElementById('featuredProperties')) loadFeaturedProperties();
  if (document.getElementById('categoryGrid')) loadCategories();
  if (document.getElementById('propertyGrid')) loadListings();
  if (document.getElementById('categoryProperties')) loadCategoryPage();
  attachReveal();
}

document.addEventListener('DOMContentLoaded', () => {
  const adminButton = document.getElementById('adminLoginButton');
  if (adminButton) adminButton.addEventListener('click', adminLogin);
  initApp();
});
