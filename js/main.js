document.addEventListener('DOMContentLoaded', function () {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    const syncMenuState = (isOpen) => {
      navToggle.setAttribute('aria-expanded', String(isOpen));
      primaryNav.classList.toggle('is-open', isOpen);
      if (window.innerWidth <= 760) {
        primaryNav.style.display = isOpen ? 'block' : 'none';
      }
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      syncMenuState(!isOpen);
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        syncMenuState(false);
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) {
        primaryNav.style.display = '';
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((faq) => {
        faq.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = Number(el.dataset.count || 0);
    const duration = 900;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = `${value}${target === 100 ? '%' : ''}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}${target === 100 ? '%' : ''}`;
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  const form = document.getElementById('interest-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const nome = (form.nome.value || '').trim();
      const whatsapp = (form.whatsapp.value || '').replace(/\D/g, '');
      const email = (form.email.value || '').trim();
      const cidade = (form.cidade.value || '').trim();
      const experiencia = (form.experiencia.value || '').trim();
      const comoConheceu = (form.como_conheceu.value || '').trim();
      const mensagem = (form.mensagem.value || '').trim();

      if (!nome || whatsapp.length < 10 || !form.lgpd.checked) {
        alert('Preencha nome, WhatsApp válido e aceite a autorização de contato para continuar.');
        return;
      }

      const message = `Olá! Tenho interesse em ser revendedor.%0A%0ANome: ${encodeURIComponent(nome)}%0AWhatsApp: ${encodeURIComponent(whatsapp)}%0AE-mail: ${encodeURIComponent(email)}%0ACidade/Estado: ${encodeURIComponent(cidade)}%0AExperiência com vendas: ${encodeURIComponent(experiencia)}%0AComo conheceu: ${encodeURIComponent(comoConheceu)}%0AMensagem: ${encodeURIComponent(mensagem)}`;

      const phone = '554491128812';
      const url = `https://wa.me/${phone}?text=${message}`;
      window.open(url, '_blank', 'noopener');
    });
  }
});
