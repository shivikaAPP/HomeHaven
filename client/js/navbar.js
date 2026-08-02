function initNavbar() {
  const toggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => mobileNav.classList.toggle('hidden'));
  }
}

document.addEventListener('DOMContentLoaded', initNavbar);
