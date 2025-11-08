// =============================
// 🌐 KUYANA - Main JS
// =============================

// NAVBAR SCROLL EFFECT
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar-custom');
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// INICIALIZAR AOS
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true });
  }
});
