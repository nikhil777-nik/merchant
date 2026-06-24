/* ==========================================================================
   MAHESH MERCHANTS - MAIN INTERACTION SCRIPT
   Author: Antigravity AI
   Location: Eluru, A.P.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* 1. SCROLL EFFECT ON HEADER
     ========================================================================== */
  const header = document.querySelector('header');
  
  const toggleHeaderClass = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', toggleHeaderClass);
  toggleHeaderClass(); // Run once at load
  
  /* 2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      navLinks.classList.toggle('open');
      
      // Update ARIA expand state for accessibility
      navToggle.setAttribute('aria-expanded', !isOpen);
      
      // Toggle hamburger menu icon or close cross
      if (!isOpen) {
        navToggle.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
      } else {
        navToggle.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      });
    });
  }

  /* 3. PRODUCT CATALOG DYNAMIC FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-tab-btn');
  const productCards = document.querySelectorAll('.product-card');
  
  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-filter');
        
        // Remove active class from all buttons and add to target
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter cards
        productCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (category === 'all' || cardCategory === category) {
            // Restore visibility
            card.style.display = 'flex';
            // Trigger browser repaint to allow animation
            void card.offsetWidth;
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            // Apply hide transition animations
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92)';
            // Timeout to match transition duration
            setTimeout(() => {
              if (card.style.opacity === '0') {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }
  
  /* 4. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing once animated to avoid multiple triggers
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1, // Element is 10% visible
      rootMargin: '0px 0px -40px 0px' // Adjust trigger line slightly above viewport bottom
    });
    
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: make all visible directly if browser doesn't support Observer
    reveals.forEach(el => el.classList.add('visible'));
  }
  
  /* 5. ACTIVE NAVIGATION SCROLLSPY
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const menuLinks = document.querySelectorAll('.nav-links a[href*="#"]');
  
  const scrollspy = () => {
    let scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      // Account for fixed header offset
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        menuLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  
  window.addEventListener('scroll', scrollspy);
  scrollspy(); // Run once at load

  /* 6. BILINGUAL LANGUAGE SWITCHER (EN/TE)
     ========================================================================== */
  const langButtons = document.querySelectorAll('.lang-btn');
  
  const switchLanguage = (lang) => {
    document.documentElement.setAttribute('lang', lang);
    
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    document.querySelectorAll('[data-en]').forEach(el => {
      const translation = el.getAttribute(`data-${lang}`);
      if (translation) {
        el.innerHTML = translation;
      }
    });

    document.querySelectorAll('[data-en-href]').forEach(el => {
      const translationHref = el.getAttribute(`data-${lang}-href`);
      if (translationHref) {
        el.setAttribute('href', translationHref);
      }
    });
    
    localStorage.setItem('preferred-lang', lang);
  };
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.getAttribute('data-lang'));
    });
  });
  
  const savedLang = localStorage.getItem('preferred-lang') || 'en';
  switchLanguage(savedLang);
});
