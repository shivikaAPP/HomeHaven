document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (loginForm) loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loginUser();
  });
  if (registerForm) registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    registerUser();
  });
});
