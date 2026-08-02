async function loadDashboard() {
  if (!state.token) return;
  try {
    const me = await requestJson('/auth/me');
    state.user = me.user;
    const profileName = document.getElementById('profileName');
    const profilePhone = document.getElementById('profilePhone');
    const profileAddress = document.getElementById('profileAddress');
    if (profileName) profileName.value = me.user.name || '';
    if (profilePhone) profilePhone.value = me.user.phone || '';
    if (profileAddress) profileAddress.value = me.user.address || '';

    const favourites = await requestJson('/favourites');
    const list = document.getElementById('favouritesList');
    if (list) {
      list.innerHTML = (favourites.data || []).length ? favourites.data.map(item => `
        <div class="list-card">
          <div>
            <strong>${item.property?.title || 'Saved property'}</strong>
            <p class="text-muted">${item.property?.city || ''}</p>
          </div>
          <span class="price-tag">${formatCurrency(item.property?.price || 0)}</span>
        </div>
      `).join('') : '<div class="empty-state">No saved favourites yet.</div>';
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const updateButton = document.getElementById('updateProfileButton');
  if (updateButton) updateButton.addEventListener('click', updateProfile);
  if (document.getElementById('favouritesList')) loadDashboard();
});
