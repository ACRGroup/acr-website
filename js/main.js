// ─── Nav shrink on scroll ───────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ─── Intersection Observer: fade-in elements ────────────────
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside same parent
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(c => c.classList.contains('fade-in'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 150);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));
}

// ─── Animated checklist (about section) ─────────────────────
const checklist = document.getElementById('about-checklist');
if (checklist) {
  const checkItems = checklist.querySelectorAll('li');
  const checkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        checkItems.forEach((item, i) => {
          setTimeout(() => item.classList.add('check-visible'), i * 120);
        });
        checkObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  checkObserver.observe(checklist);
}

// ─── Parallax / subtle scroll on hero bg ────────────────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.25}px) scale(1.08)`;
    }
  }, { passive: true });
}

// ─── About image parallax ───────────────────────────────────
const aboutImg = document.querySelector('.about-image-inner');
if (aboutImg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
    window.addEventListener('scroll', () => {
      const rect = aboutSection.getBoundingClientRect();
      const progress = -rect.top / (rect.height + window.innerHeight);
      if (progress >= -0.2 && progress <= 1.2) {
        aboutImg.style.transform = `translateY(${progress * 30}px)`;
      }
    }, { passive: true });
  }
}

// ─── Google Places Autocomplete ─────────────────────────────
// Called as callback by Google Maps API (contact.html only)
function initAutocomplete() {
  const addressInput = document.getElementById('farm-address');
  if (addressInput && window.google && window.google.maps) {
    const autocomplete = new google.maps.places.Autocomplete(addressInput, {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    });
    autocomplete.addListener('place_changed', function() {
      const place = autocomplete.getPlace();
      if (place.address_components) {
        let county = '', state = '', zip = '';
        place.address_components.forEach(function(c) {
          if (c.types.includes('administrative_area_level_2')) county = c.long_name;
          if (c.types.includes('administrative_area_level_1')) state = c.short_name;
          if (c.types.includes('postal_code')) zip = c.long_name;
        });
        addressInput.dataset.county = county;
        addressInput.dataset.state = state;
        addressInput.dataset.zip = zip;
        addressInput.dataset.lat = place.geometry ? place.geometry.location.lat() : '';
        addressInput.dataset.lng = place.geometry ? place.geometry.location.lng() : '';
      }
    });
  }
}
