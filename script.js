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
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          formMessage.textContent = "Dziękuję! Wiadomość została wysłana. Odpowiem wkrótce.";
          formMessage.className = "form__message success";
          formMessage.style.display = "block";
          form.reset();
        } else {
          throw new Error("Błąd wysyłania");
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
});
