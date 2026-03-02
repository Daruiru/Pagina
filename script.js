// script.js - BYN Harmony Spa (VERSIÓN CORREGIDA Y OPTIMIZADA)
document.addEventListener('DOMContentLoaded', () => {
  // ===== FUNCIONALIDADES BÁSICAS =====
  
  // Año en footer
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Menú responsive
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      if (nav.classList.contains('open')) {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.gap = '1rem';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.backgroundColor = '#fff';
        nav.style.padding = '1rem';
        nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        menuBtn.textContent = '✕';
      } else {
        nav.style.display = '';
        nav.style.position = '';
        nav.style.width = '';
        nav.style.backgroundColor = '';
        nav.style.padding = '';
        nav.style.boxShadow = '';
        menuBtn.textContent = '☰';
      }
    });
  }

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Cerrar menú si está abierto
          if (nav && nav.classList.contains('open')) {
            nav.classList.remove('open');
            nav.style.display = '';
            if (menuBtn) menuBtn.textContent = '☰';
          }
        }
      }
    });
  });

  // ===== GALERÍA: VER MÁS / VER MENOS (CORREGIDO) =====
  const verMasBtn = document.getElementById('verMasBtn');
  const galleryGrid = document.getElementById('galleryGrid');
  
  if (verMasBtn && galleryGrid) {
    // Inicializar: ocultar imágenes extras
    galleryGrid.classList.add('hide-extra');
    
    verMasBtn.addEventListener('click', () => {
      const isExpanded = galleryGrid.classList.contains('expanded');
      
      if (isExpanded) {
        galleryGrid.classList.remove('expanded');
        galleryGrid.classList.add('hide-extra');
        verMasBtn.textContent = 'Ver más';
      } else {
        galleryGrid.classList.remove('hide-extra');
        galleryGrid.classList.add('expanded');
        verMasBtn.textContent = 'Ver menos';
      }
    });
  }

  // ===== SISTEMA DE CITAS =====
  const appointmentForm = document.getElementById('appointmentForm');
  
  if (appointmentForm) {
    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const dateInput = document.getElementById('appointmentDate');
    const bookBtn = document.getElementById('bookBtn');
    
    // Configurar fechas válidas
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
      
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() + 1);
      const maxYyyy = maxDate.getFullYear();
      const maxMm = String(maxDate.getMonth() + 1).padStart(2, '0');
      const maxDd = String(maxDate.getDate()).padStart(2, '0');
      dateInput.max = `${maxYyyy}-${maxMm}-${maxDd}`;
    }
    
    // Enviar cita
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!nameInput || !phoneInput || !dateInput) return;
      
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const date = dateInput.value;
      
      if (!name || !phone || !date) {
        alert('Por favor completa todos los campos');
        return;
      }
      
      // Validar teléfono (simple)
      if (!/^\d{8,}$/.test(phone.replace(/\D/g, ''))) {
        alert('Por favor ingresa un número de teléfono válido (mínimo 8 dígitos)');
        return;
      }
      
      // Guardar cita
      const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
      appointments.push({
        id: Date.now(),
        name,
        phone,
        date,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('appointments', JSON.stringify(appointments));
      
      // Feedback visual
      if (bookBtn) {
        const originalText = bookBtn.textContent;
        bookBtn.textContent = '✅ ¡Cita agendada!';
        bookBtn.disabled = true;
        appointmentForm.reset();
        
        setTimeout(() => {
          bookBtn.textContent = originalText;
          bookBtn.disabled = false;
        }, 2000);
      }
    });
  }

  // ===== ANIMACIONES AL HACER SCROLL =====
  const animatedElements = document.querySelectorAll('.card, .gallery-item, .hero-text, .contact-content');
  
  if (animatedElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ===== FUNCIONES ADMIN (si existen) =====
  if (document.getElementById('adminContainer')) {
    initAdminPanel();
  }
  
  function initAdminPanel() {
    // Aquí iría la lógica del panel admin si la necesitas
    console.log('Panel admin inicializado');
    // Por ahora solo dejamos la estructura, podemos desarrollarla después
  }
});




