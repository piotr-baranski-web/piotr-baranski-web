document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const burger = document.querySelector(".nav__burger");
  const links = document.querySelector(".nav__links");

  if (burger && links) {
    burger.addEventListener("click", () => {
      links.classList.toggle("nav__links--open");
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("nav__links--open");
      });
    });
  }

  // Form handling
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  if (form && formMessage) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Wysyłanie...";
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
        submitData.append("subject", "Nowa wiadomość z portfolio");
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
          formMessage.textContent = "Dziękuję! Wiadomość została wysłana. Odpowiem wkrótce.";
          formMessage.className = "form__message success";
          formMessage.style.display = "block";
          form.reset();
        } else {
          throw new Error(data.message || "Błąd wysyłania");
        }
      } catch (error) {
        formMessage.textContent = "Przepraszam, wystąpił błąd. Spróbuj ponownie lub napisz bezpośrednio na piotrbaranski96@gmail.com";
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
