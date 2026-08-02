document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-category-link]').forEach((link) => {
    link.addEventListener('click', () => {
      const slug = link.getAttribute('data-category-link');
      window.location.href = `category.html?slug=${slug}`;
    });
  });
});
