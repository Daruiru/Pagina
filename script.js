// script.js - Interacciones suaves
document.addEventListener('DOMContentLoaded', () => {
  // Año del footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Menu toggle responsive
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    if(nav.classList.contains('open')){
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '1rem';
      menuBtn.textContent = '✕';
    } else {
      nav.style.display = '';
      menuBtn.textContent = '☰';
    }
  });

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile nav after click
        if(nav.classList.contains('open')){
          nav.classList.remove('open');
          nav.style.display = '';
          menuBtn.textContent = '☰';
        }
      }
    });
  });

  // Micro-animaciones: pequeñas entradas al hacer scroll
  const revealItems = document.querySelectorAll('.card, .gallery-item, .contact-form, .hero-text');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.transition = 'opacity 700ms ease, transform 700ms cubic-bezier(.2,.9,.3,1)';
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});

  revealItems.forEach(it => {
    it.style.opacity = 0;
    it.style.transform = 'translateY(12px)';
    obs.observe(it);
  });

  // Envío (demo)
  const sendBtn = document.getElementById('sendBtn');
  sendBtn.addEventListener('click', () => {
    // Mostrar retroalimentación visual simple
    sendBtn.textContent = 'Enviando...';
    sendBtn.disabled = true;
    setTimeout(() => {
      sendBtn.textContent = 'Enviado';
      sendBtn.classList.add('sent');
      setTimeout(() => {
        sendBtn.textContent = 'Enviar';
        sendBtn.disabled = false;
      }, 1500);
    }, 900);
  });
});
