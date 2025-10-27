// script.js - Interacciones + sistema de citas BYN Harmony Spa
document.addEventListener('DOMContentLoaded', () => {
  // Año del footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Menú responsive
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    if (nav.classList.contains('open')) {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '1rem';
      menuBtn.textContent = '✕';
    } else {
      nav.style.display = '';
      menuBtn.textContent = '☰';
    }
  });

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          nav.style.display = '';
          menuBtn.textContent = '☰';
        }
      }
    });
  });

  // Animaciones al hacer scroll
  const revealItems = document.querySelectorAll('.card, .gallery-item, .contact-form, .hero-text');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 700ms ease, transform 700ms cubic-bezier(.2,.9,.3,1)';
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(it => {
    it.style.opacity = 0;
    it.style.transform = 'translateY(12px)';
    obs.observe(it);
  });

  // ======== SISTEMA DE CITAS ========

  const form = document.getElementById('appointmentForm');
  if (form) {
    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const dateInput = document.getElementById('appointmentDate');
    const sendBtn = document.getElementById('bookBtn');

    // Limitar rango de fechas (hoy -> +1 año)
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];

    // Enviar cita
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const date = dateInput.value;

      if (!name || !phone || !date) {
        alert('Por favor completa todos los campos.');
        return;
      }

      // Crear nueva cita
      const newAppointment = {
        id: Date.now(),
        name,
        phone,
        date,
      };

      // Guardar en localStorage
      const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
      appointments.push(newAppointment);
      localStorage.setItem('appointments', JSON.stringify(appointments));

      // Feedback visual
      sendBtn.textContent = 'Agendando...';
      sendBtn.disabled = true;
      setTimeout(() => {
        sendBtn.textContent = 'Cita agendada ✅';
        sendBtn.classList.add('sent');
        setTimeout(() => {
          sendBtn.textContent = 'Agendar cita';
          sendBtn.disabled = false;
          form.reset();
        }, 1500);
      }, 900);
    });
  }

  // ======== PÁGINA ADMIN (si existe el contenedor del calendario) ========
  const adminContainer = document.getElementById('adminContainer');
  if (adminContainer) {
    renderAdminCalendar();
  }

  function renderAdminCalendar() {
    const calendar = document.getElementById('calendar');
    const appointmentsList = document.getElementById('appointmentsList');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const monthLabel = document.getElementById('monthLabel');

    let currentDate = new Date();

    function renderMonth() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      monthLabel.textContent = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      calendar.innerHTML = '';

      const days = [];
      for (let i = 0; i < firstDay; i++) days.push('');
      for (let d = 1; d <= daysInMonth; d++) days.push(d);

      days.forEach(day => {
        const cell = document.createElement('div');
        cell.classList.add('day');
        if (day) {
          cell.textContent = day;

          const dateStr = new Date(year, month, day).toISOString().split('T')[0];
          const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
          const daily = appointments.filter(a => a.date === dateStr);

          if (daily.length) {
            cell.classList.add('has-appointments');
            cell.addEventListener('click', () => showAppointments(dateStr));
          }
        }
        calendar.appendChild(cell);
      });
    }

    function showAppointments(dateStr) {
      const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
      const daily = appointments.filter(a => a.date === dateStr);

      appointmentsList.innerHTML = `<h3>Citas para ${dateStr}</h3>`;
      if (!daily.length) {
        appointmentsList.innerHTML += '<p>No hay citas para este día.</p>';
        return;
      }

      daily.forEach((a) => {
        const item = document.createElement('div');
        item.classList.add('appointment-item');
        item.innerHTML = `
          <p><strong>${a.name}</strong> — ${a.phone}</p>
          <button class="edit">Editar</button>
          <button class="delete">Borrar</button>
        `;

        item.querySelector('.delete').addEventListener('click', () => {
          const updated = appointments.filter(x => x.id !== a.id);
          localStorage.setItem('appointments', JSON.stringify(updated));
          showAppointments(dateStr);
          renderMonth();
        });

        item.querySelector('.edit').addEventListener('click', () => {
          const newName = prompt('Nuevo nombre:', a.name);
          const newPhone = prompt('Nuevo número:', a.phone);
          if (newName && newPhone) {
            a.name = newName;
            a.phone = newPhone;
            const updated = appointments.map(x => x.id === a.id ? a : x);
            localStorage.setItem('appointments', JSON.stringify(updated));
            showAppointments(dateStr);
          }
        });

        appointmentsList.appendChild(item);
      });
    }

    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderMonth();
    });

    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderMonth();
    });

    renderMonth();
  }
});

