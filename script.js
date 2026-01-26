// Smooth scroll with easing
function smoothScrollTo(target, duration = 1000) {
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;

  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Enhanced scroll behavior with smooth momentum (similar to profitroom.com)
let lastScrollTop = 0;
let ticking = false;

function handleEnhancedScroll() {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  const isSubpage = document.body.classList.contains('subpage');
  
  // Subtle parallax effect to subhero on scroll (only for subpages)
  if (isSubpage) {
    // Subpage - subhero parallax
    const subhero = document.querySelector('.subhero');
    if (subhero) {
      const scrolled = currentScroll;
      const rate = Math.min(scrolled * 0.1, 50); // Subtle for subpages
      if (scrolled < window.innerHeight) {
        subhero.style.transform = `translateY(${rate}px)`;
      }
    }
  }

  // Update nav on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    if (currentScroll > 50) {
      nav.style.background = 'rgba(255, 255, 255, 0.95)';
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.82)';
      nav.style.boxShadow = 'none';
    }
  }

  lastScrollTop = currentScroll;
}

// Enhanced scroll reveal animations (similar to profitroom.com) - ONLY FOR HOMEPAGE
function initScrollReveal() {
  // Check if we're on homepage (not subpage)
  const isSubpage = document.body.classList.contains('subpage');
  if (isSubpage) {
    return; // Skip animations on subpages
  }

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once revealed for better performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Helper function to add reveal classes and observe
  function addRevealClass(element, revealType, delay = null) {
    if (!element) return;
    element.classList.add(revealType);
    if (delay) {
      element.classList.add(`scroll-reveal--delay-${delay}`);
    }
    
    // Check if element is already in viewport
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    
    if (isInViewport && window.scrollY < 50) {
      // Element is visible on page load, reveal it with a small delay
      setTimeout(() => {
        element.classList.add('revealed');
      }, 150 + (delay ? delay * 100 : 0));
    } else {
      observer.observe(element);
    }
  }

  // HERO SECTION - Sequential animations
  addRevealClass(document.querySelector('.hero__eyebrow'), 'scroll-reveal--slide-up', 1);
  addRevealClass(document.querySelector('.hero h1'), 'scroll-reveal--slide-up', 2);
  addRevealClass(document.querySelector('.hero__subtitle'), 'scroll-reveal--fade', 3);
  addRevealClass(document.querySelector('.hero__actions'), 'scroll-reveal--slide-up', 4);
  
  // Hero portfolio links - sequential
  const heroLinks = document.querySelectorAll('.hero__portfolio-link');
  heroLinks.forEach((link, index) => {
    addRevealClass(link, 'scroll-reveal--scale', Math.min(index + 1, 5));
  });

  // ABOUT SECTION
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    addRevealClass(aboutSection.querySelector('h2'), 'scroll-reveal--slide-up');
    const aboutParagraphs = aboutSection.querySelectorAll('p');
    aboutParagraphs.forEach((p, index) => {
      addRevealClass(p, 'scroll-reveal--fade', index + 1);
    });
    addRevealClass(aboutSection.querySelector('.card--soft'), 'scroll-reveal--slide-up', 3);
  }

  // SKILLS SECTION
  const skillsSection = document.querySelector('#skills');
  if (skillsSection) {
    addRevealClass(skillsSection.querySelector('.section__header'), 'scroll-reveal--fade');
    const skillCards = skillsSection.querySelectorAll('.card');
    skillCards.forEach((card, index) => {
      addRevealClass(card, 'scroll-reveal--scale', index + 1);
    });
  }

  // PROJECTS SECTION
  const projectsSection = document.querySelector('#projects');
  if (projectsSection) {
    addRevealClass(projectsSection.querySelector('.section__header'), 'scroll-reveal--fade');
    const projectCards = projectsSection.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      addRevealClass(card, 'scroll-reveal--scale', Math.min(index + 1, 4));
    });
  }

  // CONTACT SECTION
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    addRevealClass(contactSection.querySelector('h2'), 'scroll-reveal--slide-up');
    addRevealClass(contactSection.querySelector('p'), 'scroll-reveal--fade', 2);
    addRevealClass(contactSection.querySelector('.contact__info'), 'scroll-reveal--slide-up', 3);
    addRevealClass(contactSection.querySelector('.contact__form'), 'scroll-reveal--scale', 4);
  }

  // STATS SECTION
  const statsSection = document.querySelector('#stats');
  if (statsSection) {
    addRevealClass(statsSection, 'scroll-reveal--fade');
    const statsItems = statsSection.querySelectorAll('.stats__item');
    statsItems.forEach((item, index) => {
      addRevealClass(item, 'scroll-reveal--scale', index + 1);
    });
  }

  // FOOTER
  addRevealClass(document.querySelector('.footer'), 'scroll-reveal--fade');

  // STATS SECTION - Animated numbers
  initAnimatedNumbers();
}

// Animated numbers counter
function initAnimatedNumbers() {
  const statsSection = document.querySelector('#stats');
  if (!statsSection) return;

  const statsNumbers = document.querySelectorAll('.stats__number');
  if (statsNumbers.length === 0) return;

  let hasAnimated = false;

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        // Small delay to let scroll reveal animation finish
        setTimeout(() => {
          animateNumbers();
        }, 300);
      }
    });
  }, observerOptions);

  observer.observe(statsSection);

  function animateNumbers() {
    statsNumbers.forEach((numberEl) => {
      const target = parseInt(numberEl.getAttribute('data-target'));
      const suffix = numberEl.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      // Set initial state for slide-up animation
      numberEl.style.opacity = '0';
      numberEl.style.transform = 'translateY(20px)';
      numberEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      // Start slide-up animation
      setTimeout(() => {
        numberEl.style.opacity = '1';
        numberEl.style.transform = 'translateY(0)';
      }, 50);

      const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOutCubic * target);
        
        numberEl.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          numberEl.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateNumber);
    });
  }
}

// Works showcase - random works animation
function initWorksShowcase() {
  const showcaseContainer = document.getElementById('works-showcase');
  if (!showcaseContainer) return;

  // List of works from different categories with links
  const works = [
    // Digital works
    { src: 'digital/030325_Convierte_cada_ads_ES_campaing_1200x1200.png', category: 'Digital', link: 'digital.html' },
    { src: 'digital/040325_Más_reservas_ads_LT_campaing_1200x1200.png', category: 'Digital', link: 'digital.html' },
    { src: 'digital/100325_Buscas_soluciones_ads_ESLATAM_campaing_1080x1080.png', category: 'Digital', link: 'digital.html' },
    { src: 'digital/100325_Unlock_growth_ads_APAC_campaing_1200x1200.png', category: 'Digital', link: 'digital.html' },
    { src: 'digital/110925_Profitroom_The_ROI_you_thought_1080x1080.png', category: 'Digital', link: 'digital.html' },
    { src: 'digital/190125_Profitroom_project_ads_campaing_03.png', category: 'Digital', link: 'digital.html' },
    { src: 'digital/200225_keep_guests_ads_loyalty_campaing_1200x1200.png', category: 'Digital', link: 'digital.html' },
    // UI/Web works
    { src: 'ui-web/Home-ljeh9rnb.png', category: 'UI & Web', link: 'ui-web.html' },
    { src: 'ui-web/Contact us.png', category: 'UI & Web', link: 'ui-web.html' },
    { src: 'ui-web/Layout-ljehf384.png', category: 'UI & Web', link: 'ui-web.html' },
    { src: 'ui-web/LP-1-ljehapq2.png', category: 'UI & Web', link: 'ui-web.html' },
    { src: 'ui-web/Sklep--home-ljehb3qs.png', category: 'UI & Web', link: 'ui-web.html' },
    // DTP works
    { src: 'dtp/050424_Profitroom_Email_campaign_Ebook_PL.png', category: 'DTP', link: 'dtp.html' },
    { src: 'dtp/141123_Profitroom_hsmai_A5.png', category: 'DTP', link: 'dtp.html' },
    { src: 'dtp/240814_Profitroom_One_Pager_Websites_VIP_Concierge_SA.png', category: 'DTP', link: 'dtp.html' },
  ];

  // Shuffle array
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Function to create work item and handle image loading
  function createWorkItem(work, index, container, animateIn = false) {
    return new Promise((resolve) => {
      // Create link wrapper
      const link = document.createElement('a');
      link.href = work.link || '#';
      link.className = 'works-showcase__item';
      
      if (animateIn) {
        link.style.opacity = '0';
        link.style.transform = 'scale(0.95) translateY(10px)';
        link.style.animationDelay = `${index * 0.25}s`;
      } else {
        link.style.animationDelay = `${index * 0.2}s`;
      }
      
      const img = document.createElement('img');
      img.src = work.src;
      img.alt = work.category;
      
      img.onload = function() {
        link.appendChild(img);
        container.appendChild(link);
        
        if (animateIn) {
          setTimeout(() => {
            link.style.animation = 'fadeInWork 1.2s ease-out forwards';
          }, index * 250 + 300);
        }
        
        resolve(true);
      };
      
      img.onerror = function() {
        resolve(false);
      };
    });
  }

  // Function to ensure exactly 3 works are displayed
  async function displayWorks(worksArray, container, animateIn = false) {
    const shuffled = shuffleArray(worksArray);
    const displayedWorks = [];
    let checkedWorks = new Set();

    // Try to get 3 working images
    for (let i = 0; i < shuffled.length && displayedWorks.length < 3; i++) {
      const work = shuffled[i];
      
      // Skip if we already checked this work
      if (checkedWorks.has(work.src)) continue;
      checkedWorks.add(work.src);
      
      const success = await createWorkItem(work, displayedWorks.length, container, animateIn);
      
      if (success) {
        displayedWorks.push(work);
      }
    }

    // If we still don't have 3 works, try remaining works
    if (displayedWorks.length < 3) {
      const remaining = worksArray.filter(w => !displayedWorks.includes(w));
      for (let i = 0; i < remaining.length && displayedWorks.length < 3; i++) {
        const work = remaining[i];
        if (checkedWorks.has(work.src)) continue;
        checkedWorks.add(work.src);
        
        const success = await createWorkItem(work, displayedWorks.length, container, animateIn);
        if (success) {
          displayedWorks.push(work);
        }
      }
    }
  }

  // Initial display
  displayWorks(works, showcaseContainer, false);

  // Continuous animation - replace all works periodically (slower and gentler)
  setInterval(async () => {
    const items = showcaseContainer.querySelectorAll('.works-showcase__item');
    if (items.length > 0) {
      // Fade out all items slowly with animation
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.animation = 'fadeOutWork 1.5s ease-out forwards';
        }, index * 200);
      });
      
      setTimeout(async () => {
        // Clear container after fade out completes
        showcaseContainer.innerHTML = '';
        
        // Display exactly 3 new works (with error handling and animation)
        await displayWorks(works, showcaseContainer, true);
      }, 2000); // Wait longer for fade out to complete
    }
  }, 15000); // Replace every 15 seconds (much slower)
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Initialize works showcase
  initWorksShowcase();

  // Initialize scroll reveal
  initScrollReveal();

  // Enhanced scroll handling with smooth performance
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleEnhancedScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          smoothScrollTo(target, 800);
        }
      }
    });
  });

  const burger = document.querySelector(".nav__burger");
  const links = document.querySelector(".nav__links");

  if (burger && links) {
    // Group CTA and lang together in a wrapper for mobile
    const cta = links.querySelector(".nav__cta");
    const lang = links.querySelector(".nav__lang");
    
    if (cta && lang) {
      const wrapper = document.createElement("div");
      wrapper.className = "nav__links-group";
      wrapper.style.display = "flex";
      wrapper.style.gap = "8px";
      wrapper.style.alignItems = "center";
      
      // Insert wrapper before CTA
      cta.parentNode.insertBefore(wrapper, cta);
      wrapper.appendChild(cta);
      wrapper.appendChild(lang);
    }

    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      links.classList.toggle("nav__links--open");
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("nav__links--open");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (links.classList.contains("nav__links--open")) {
        // Check if click is outside both burger and menu
        if (!links.contains(e.target) && !burger.contains(e.target)) {
          links.classList.remove("nav__links--open");
        }
      }
    });

    // Prevent menu from closing when clicking inside it
    links.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Form handling
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  if (form && formMessage) {
    const isEnglish = document.documentElement.lang === 'en';
    
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = isEnglish ? "Sending..." : "Wysyłanie...";
      submitBtn.disabled = true;
      formMessage.style.display = "none";

      try {
        const formData = new FormData(form);
        
        // Web3Forms wymaga dodatkowych pól
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");
        
        // Tworzymy nowy FormData z wszystkimi wymaganymi polami
        const submitData = new FormData();
        submitData.append("access_key", "350a660b-7490-42d7-9227-9966740f6b58");
        submitData.append("subject", isEnglish ? "New message from portfolio" : "Nowa wiadomość z portfolio");
        submitData.append("from_name", name);
        submitData.append("from_email", email);
        submitData.append("message", message);
        submitData.append("to_email", "piotrbaranski96@gmail.com");

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: submitData
        });

        const data = await response.json();

        if (response.ok && data.success) {
          formMessage.textContent = isEnglish 
            ? "Thank you! Your message has been sent. I'll respond soon." 
            : "Dziękuję! Wiadomość została wysłana. Odpowiem wkrótce.";
          formMessage.className = "form__message success";
          formMessage.style.display = "block";
          form.reset();
        } else {
          throw new Error(data.message || (isEnglish ? "Sending error" : "Błąd wysyłania"));
        }
      } catch (error) {
        formMessage.textContent = isEnglish
          ? "Sorry, an error occurred. Please try again or write directly to piotrbaranski96@gmail.com"
          : "Przepraszam, wystąpił błąd. Spróbuj ponownie lub napisz bezpośrednio na piotrbaranski96@gmail.com";
        formMessage.className = "form__message error";
        formMessage.style.display = "block";
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Lightbox functionality
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <span class="lightbox__close">&times;</span>
    <span class="lightbox__prev">&#8249;</span>
    <span class="lightbox__next">&#8250;</span>
    <div class="lightbox__content">
      <img class="lightbox__image" src="" alt="">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('.lightbox__image');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  const lightboxPrev = lightbox.querySelector('.lightbox__prev');
  const lightboxNext = lightbox.querySelector('.lightbox__next');

  let currentImageIndex = 0;
  let images = [];

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    if (images[currentImageIndex]) {
      lightboxImage.src = images[currentImageIndex].src;
      lightboxImage.alt = images[currentImageIndex].alt;
    }
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  // Collect all images from gallery
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      images.push(img);
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  // Lightbox controls
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
  });
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
  });

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    }
  });
});
