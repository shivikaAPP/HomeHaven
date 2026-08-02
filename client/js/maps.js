function initMapPreview() {
  const mapFrame = document.querySelector('[data-map]');
  if (mapFrame) {
    const location = mapFrame.getAttribute('data-map');
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  }
}

document.addEventListener('DOMContentLoaded', initMapPreview);
