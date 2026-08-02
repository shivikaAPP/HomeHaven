document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;
  let index = 0;
  const slides = slider.querySelectorAll('.slider-slide');
  setInterval(() => {
    index = (index + 1) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.style.display = slideIndex === index ? 'block' : 'none';
    });
  }, 5000);
});
