const apiBase = '/api';
const state = { user: null, token: localStorage.getItem('homehavenToken') || null };

async function fetchJson(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(apiBase + url, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '<div class="loading">Loading...</div>';
}

function renderProperties(properties, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!properties?.length) {
    container.innerHTML = '<div class="card">No properties found.</div>';
    return;
  }
  container.innerHTML = properties.map(property => `
    <article class="card">
      <img src="${property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80'}" alt="${property.title}" />
      <div style="padding-top:1rem">
        <span class="badge">${property.propertyType || property.type || 'Property'}</span>
        <h3>${property.title}</h3>
        <p class="price">$${Number(property.price).toLocaleString()}</p>
        <p class="small">${property.address}, ${property.city}</p>
        <div class="meta">
          <span>🛏 ${property.bedrooms}</span>
          <span>🛁 ${property.bathrooms}</span>
          <span>📐 ${property.area} sqft</span>
          <span>🚗 ${property.parking || 1}</span>
        </div>
        <div style="display:flex;gap:.5rem;margin-top:1rem;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="openProperty('${property._id}')">View Details</button>
          <button class="btn btn-secondary" onclick="toggleFavourite('${property._id}')">Favourite</button>
        </div>
      </div>
    </article>
  `).join('');
}

async function loadFeatured() {
  showLoading('featuredProperties');
  try {
    const res = await fetchJson('/properties/featured');
    renderProperties(res.data || [], 'featuredProperties');
  } catch (error) {
    document.getElementById('featuredProperties').innerHTML = `<div class="card">${error.message}</div>`;
  }
}

async function loadProperties() {
  showLoading('propertyGrid');
  try {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search') || '';
    const city = params.get('city') || '';
    const type = params.get('type') || '';
    const bedrooms = params.get('bedrooms') || '';
    const bathrooms = params.get('bathrooms') || '';
    const minPrice = params.get('minPrice') || '';
    const maxPrice = params.get('maxPrice') || '';
    const sort = params.get('sort') || '';
    const area = params.get('area') || '';
    const url = `/properties?search=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}&type=${encodeURIComponent(type)}&bedrooms=${bedrooms}&bathrooms=${bathrooms}&minPrice=${minPrice}&maxPrice=${maxPrice}&area=${area}&sort=${sort}`;
    const res = await fetchJson(url);
    renderProperties(res.data || [], 'propertyGrid');
  } catch (error) {
    document.getElementById('propertyGrid').innerHTML = `<div class="card">${error.message}</div>`;
  }
}

async function openProperty(id) {
  try {
    const res = await fetchJson(`/properties/${id}`);
    const property = res.data;
    document.getElementById('modalBody').innerHTML = `
      <h2>${property.title}</h2>
      <p class="small">${property.address}, ${property.city}</p>
      <img src="${property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80'}" style="width:100%;border-radius:16px;margin:1rem 0;max-height:280px;object-fit:cover" />
      <p>${property.description}</p>
      <div class="meta"><span>🛏 ${property.bedrooms}</span><span>🛁 ${property.bathrooms}</span><span>📐 ${property.area} sqft</span><span>🚗 ${property.parking}</span></div>
      <p><strong>Owner:</strong> ${property.ownerName}</p>
      <p><strong>Contact:</strong> ${property.ownerEmail} • ${property.ownerPhone}</p>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem">
        <button class="btn btn-primary" onclick="showContactForm('${property._id}')">Book Visit</button>
        <button class="btn btn-secondary" onclick="toggleFavourite('${property._id}')">Favourite</button>
      </div>
    `;
    document.getElementById('modal').classList.remove('hidden');
  } catch (error) {
    alert(error.message);
  }
}

async function toggleFavourite(propertyId) {
  if (!state.token) {
    alert('Please login to save favourites');
    return;
  }
  try {
    await fetchJson(`/favourites/${propertyId}`, { method: 'POST' });
    alert('Favourite updated');
  } catch (error) {
    alert(error.message);
  }
}

function showContactForm(propertyId) {
  document.getElementById('modalBody').innerHTML = `
    <h2>Contact Owner</h2>
    <form id="enquiryForm" class="form-grid">
      <input name="name" placeholder="Your Name" required />
      <div class="grid-2">
        <input name="email" placeholder="Email" required />
        <input name="phone" placeholder="Phone" required />
      </div>
      <div class="grid-2">
        <input name="visitDate" type="date" />
        <input name="visitTime" type="time" />
      </div>
      <input name="budget" placeholder="Budget" />
      <textarea name="message" rows="4" placeholder="Your message" required></textarea>
      <input type="hidden" name="propertyId" value="${propertyId}" />
      <button class="btn btn-primary" type="submit">Send Enquiry</button>
    </form>
  `;
  document.getElementById('enquiryForm').addEventListener('submit', submitEnquiry);
}

async function submitEnquiry(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  try {
    await fetchJson('/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form.entries())) });
    alert('Enquiry sent successfully');
    document.getElementById('modal').classList.add('hidden');
  } catch (error) {
    alert(error.message);
  }
}

async function registerUser() {
  const payload = { name: document.getElementById('regName').value, email: document.getElementById('regEmail').value, password: document.getElementById('regPassword').value, phone: document.getElementById('regPhone').value, address: document.getElementById('regAddress').value };
  try {
    const res = await fetchJson('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    localStorage.setItem('homehavenToken', res.token);
    state.token = res.token;
    state.user = res.user;
    document.getElementById('authMessage').textContent = 'Registration successful';
    updateAuthUI();
  } catch (error) {
    document.getElementById('authMessage').textContent = error.message;
  }
}

async function loginUser() {
  const payload = { email: document.getElementById('loginEmail').value, password: document.getElementById('loginPassword').value };
  try {
    const res = await fetchJson('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    localStorage.setItem('homehavenToken', res.token);
    state.token = res.token;
    state.user = res.user;
    document.getElementById('authMessage').textContent = 'Login successful';
    updateAuthUI();
  } catch (error) {
    document.getElementById('authMessage').textContent = error.message;
  }
}

function logout() {
  localStorage.removeItem('homehavenToken');
  state.token = null;
  state.user = null;
  updateAuthUI();
}

async function loadProfile() {
  if (!state.token) return;
  try {
    const res = await fetchJson('/auth/me');
    state.user = res.user;
    document.getElementById('profileName').value = res.user.name || '';
    document.getElementById('profilePhone').value = res.user.phone || '';
    document.getElementById('profileAddress').value = res.user.address || '';
    const favs = await fetchJson('/favourites');
    const container = document.getElementById('favouritesList');
    if (container) container.innerHTML = favs.data?.length ? favs.data.map(item => `<li>${item.property?.title || 'Property'}</li>`).join('') : '<li>No favourites yet</li>';
  } catch (error) {
    console.error(error);
  }
}

async function saveProfile() {
  try {
    await fetchJson('/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: document.getElementById('profileName').value, phone: document.getElementById('profilePhone').value, address: document.getElementById('profileAddress').value }) });
    alert('Profile updated');
  } catch (error) {
    alert(error.message);
  }
}

async function loadAdminDashboard() {
  try {
    const res = await fetchJson('/admin/dashboard');
    const data = res.data;
    document.getElementById('adminStats').innerHTML = `
      <div class="card"><h3>${data.totalProperties}</h3><p>Properties</p></div>
      <div class="card"><h3>${data.totalUsers}</h3><p>Users</p></div>
      <div class="card"><h3>${data.totalCategories}</h3><p>Categories</p></div>
      <div class="card"><h3>${data.totalEnquiries}</h3><p>Enquiries</p></div>
    `;
  } catch (error) {
    document.getElementById('adminStats').innerHTML = `<div class="card">${error.message}</div>`;
  }
}

function updateAuthUI() {
  const authLink = document.getElementById('authLink');
  if (authLink) authLink.textContent = state.user ? 'Logout' : 'Login';
  authLink?.addEventListener('click', (e) => {
    e.preventDefault();
    if (state.user) logout();
    else window.location.href = 'login.html';
  });
}

function initApp() {
  updateAuthUI();
  const modal = document.getElementById('modal');
  document.getElementById('closeModal')?.addEventListener('click', () => modal.classList.add('hidden'));
  if (document.getElementById('featuredProperties')) loadFeatured();
  if (document.getElementById('propertyGrid')) loadProperties();
  if (document.getElementById('profileName')) loadProfile();
  if (document.getElementById('adminStats')) loadAdminDashboard();
  document.getElementById('themeToggle')?.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    if (btn) btn.style.display = window.scrollY > 400 ? 'block' : 'none';
  });
  document.getElementById('backToTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

window.addEventListener('DOMContentLoaded', initApp);
