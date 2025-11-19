<!doctype html>
<html lang="en">
<script>
    /* ====== Footer Year ====== */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* ====== Mobile Menu Toggle ====== */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

/* ====== Smooth 'Apple-style' FAQ Accordion ====== */
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const open = item.classList.contains('active');

        // Close all items first (optional: keep only one open)
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('active');
          i.querySelectorAll('.faq-question').forEach(q => q.setAttribute('aria-expanded','false'));
        });

        if(!open){
          item.classList.add('active');
          btn.setAttribute('aria-expanded','true');
        } else {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded','false');
        }
      });
    });
    
    /* ====== Navbar solid on scroll (throttled) ====== */
    const navInner = document.querySelector('.nav-inner');
    function handleNavScroll() {
      if (window.scrollY > 40) navInner.classList.add('solid');
      else navInner.classList.remove('solid');
    }
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleNavScroll, 100);
    });
    handleNavScroll();

    /* ====== Reveal on scroll ====== */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('active');
      });
    }, {threshold: 0.12});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    document.querySelectorAll('.service-card').forEach(el => io.observe(el));
    document.querySelectorAll('.blog-card').forEach(el => io.observe(el));

    /* ====== Lightbox & Gallery ====== */
    (function () {
      const gallery = document.getElementById('gallery');
      if (!gallery) return;

      const items = Array.from(gallery.querySelectorAll('.gallery-item'));
      const imgs = items.map(i => i.querySelector('img'));
      const lightbox = document.getElementById('lightbox');
      const lbImage = document.getElementById('lb-image');
      const lbClose = document.getElementById('lb-close');
      const lbPrev = document.getElementById('lb-prev');
      const lbNext = document.getElementById('lb-next');
      let currentIndex = 0;

      items.forEach((item, i) => item.setAttribute('data-index', i));

      function openAt(index) {
        if (index < 0) index = imgs.length - 1;
        if (index >= imgs.length) index = 0;
        currentIndex = index;
        const src = imgs[currentIndex].dataset.large || imgs[currentIndex].src;
        lbImage.src = src;
        lbImage.alt = imgs[currentIndex].alt || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.documentElement.style.overflow = 'hidden';
        requestAnimationFrame(() => { lbClose.focus(); });
      }

      function closeLightbox() {
        requestAnimationFrame(() => {
          lightbox.classList.remove('open');
          lightbox.setAttribute('aria-hidden', 'true');
          lbImage.src = '';
          document.documentElement.style.overflow = '';
        });
      }

      gallery.addEventListener('click', (e) => {
        const btn = e.target.closest('.control-btn');
        if (btn) return; // ignore control button clicks (external links)
        const item = e.target.closest('.gallery-item');
        if (!item) return;
        const index = parseInt(item.getAttribute('data-index'), 10);
        // If item is a video or site, follow the link instead of lightbox
        const type = item.getAttribute('data-type');
        const link = item.getAttribute('data-link');
        if (type === 'video' || type === 'site') {
          if (link) window.open(link, '_blank', 'noopener');
          return;
        }
        openAt(index);
      });

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });

      lbClose.addEventListener('click', closeLightbox);
      lbPrev.addEventListener('click', () => openAt(currentIndex - 1));
      lbNext.addEventListener('click', () => openAt(currentIndex + 1));

      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
        if (e.key === 'ArrowRight') openAt(currentIndex + 1);
      });
    })();


    /* ====== Testimonials carousel (simple) ====== */
    (function(){
  const carousel = document.getElementById('testimonial-carousel');
  if (!carousel) return;
  const cards = Array.from(carousel.children);
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let idx = 0;

  function show(i) {
    idx = (i + cards.length) % cards.length;
    const cardWidth = cards[0].getBoundingClientRect().width + 18;
    carousel.style.transform = `translateX(${-idx * cardWidth}px)`;
  }

  prevBtn.addEventListener('click', () => show(idx - 1));
  nextBtn.addEventListener('click', () => show(idx + 1));

  // Optional autoplay
  setInterval(() => show(idx + 1), 6000);

  // Resize recalculation
  window.addEventListener('resize', () => show(idx));

  show(0);
})();

    /* ====== Typed text (hero) ====== */
    (function(){
      const words = ["inspire.", "connect.", "stand out.", "grow your brand."];
      let i = 0, j = 0, currentWord = "", isDeleting = false;
      const typed = document.getElementById('typed');
      if(!typed) return;
      function type() {
        currentWord = words[i];
        typed.textContent = currentWord.substring(0, j);
        if (!isDeleting && j < currentWord.length) j++;
        else if (isDeleting && j > 0) j--;
        else if (!isDeleting && j === currentWord.length) {
          isDeleting = true;
          setTimeout(type, 1000);
          return;
        } else {
          isDeleting = false;
          i = (i + 1) % words.length;
        }
        setTimeout(type, isDeleting ? 80 : 120);
      }
      type();
    })();

    /* ====== Contact form (fetch to Formspree) ====== */
    (function(){
      const contactForm = document.getElementById('contact-form');
      const contactFeedback = document.getElementById('contact-feedback');
      if (!contactForm) return;
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          if (response.ok) {
            contactFeedback.style.display = 'block';
            contactFeedback.textContent = 'Thanks — your message has been sent. I\'ll be in touch soon.';
            contactForm.reset();
          } else {
            response.json().then(data => {
              contactFeedback.style.display = 'block';
              contactFeedback.textContent = data.error || 'Oops — there was a problem sending your message. Try again later.';
            }).catch(() => {
              contactFeedback.style.display = 'block';
              contactFeedback.textContent = 'Oops — there was a problem sending your message. Try again later.';
            });
          }
        }).catch(() => {
          contactFeedback.style.display = 'block';
          contactFeedback.textContent = 'Network error — please try again later.';
        });
      });
    })();

    /* ====== Newsletter form handler (basic feedback) ====== */
    (function(){
      const newsForm = document.getElementById('newsletter-form');
      const newsFeedback = document.getElementById('newsletter-feedback');
      if (!newsForm) return;
      newsForm.addEventListener('submit', (e) => {
        // keep default Formspree submission but show inline feedback
        newsFeedback.style.display = 'block';
        newsFeedback.textContent = 'Thanks — check your inbox for a confirmation link.';
        setTimeout(()=> newsFeedback.style.display = 'none', 5000);
      });
    })();

    /* ====== Floating CTA pulse style injection ====== */
    (function(){
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 6px 18px rgba(212,175,55,0.22); transform: translateY(0); }
          50% { box-shadow: 0 18px 48px rgba(212,175,55,0.12); transform: translateY(-3px); }
          100% { box-shadow: 0 6px 18px rgba(212,175,55,0.22); transform: translateY(0); }
        }
        .floating-cta { animation: pulse 3.5s infinite; }
      `;
      document.head.appendChild(style);
    })();

    (function(){
    if (!('IntersectionObserver' in window)) return;
    const elems = document.querySelectorAll('.gold-divider');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('shimmer');
          // optional: stop observing so animation starts only once:
          io.unobserve(e.target);
        }
      });
    }, {threshold: 0.12});
    elems.forEach(el => io.observe(el));
  })();

    const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active').classList.remove('active');
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const type = item.getAttribute('data-type');

        if (filter === 'all' || type === filter) {
          item.style.display = 'block';
          item.style.opacity = 1;
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  </script>
</html>
