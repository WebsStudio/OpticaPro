document.addEventListener("DOMContentLoaded", () => {
  // Iconos Lucide
  if (window.lucide) lucide.createIcons();

  // Año del footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Header: sombra al hacer scroll ----------
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---------- Menú móvil ----------
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  // ---------- Animación de aparición al hacer scroll ----------
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  // ---------- Contador animado (25.000+) ----------
  const counter = document.querySelector("[data-count]");
  if (counter && "IntersectionObserver" in window) {
    const target = +counter.dataset.count;
    const co = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        counter.textContent = Math.floor(p * target).toLocaleString("es-ES");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      co.disconnect();
    }, { threshold: 0.6 });
    co.observe(counter);
  }

  // ---------- Selector de servicio (chips) ----------
  const chips = document.querySelectorAll(".chip");
  const servicioInput = document.getElementById("servicioInput");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      servicioInput.value = chip.dataset.value;
    });
  });

  // ---------- Validación ----------
  const validators = {
    nombre: v => v.trim().length >= 2 || "Escribe tu nombre.",
    telefono: v => /^[+()\d\s-]{9,}$/.test(v.trim()) || "Introduce un teléfono válido.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Introduce un correo válido.",
    tienda: v => v !== "" || "Elige una ubicación.",
    mensaje: v => v.trim().length >= 5 || "Cuéntanos qué necesitas."
  };

  function validateForm(form) {
    let ok = true;
    form.querySelectorAll("input, select, textarea").forEach(field => {
      const rule = validators[field.name];
      const errorEl = field.closest("label")?.querySelector(".error");
      if (!rule || (!field.required && !field.value)) {
        if (errorEl) errorEl.textContent = "";
        return;
      }
      const result = rule(field.value);
      if (result !== true) {
        ok = false;
        if (errorEl) errorEl.textContent = result;
        field.setAttribute("aria-invalid", "true");
      } else {
        if (errorEl) errorEl.textContent = "";
        field.removeAttribute("aria-invalid");
      }
    });
    return ok;
  }

  function showMsg(el, text, type) {
    el.textContent = text;
    el.className = "form-msg " + type;
  }

  // ---------- Formulario de reserva ----------
  // Sustituye WHATSAPP_NUMBER por el número real del cliente (con prefijo, sin +).
  const WHATSAPP_NUMBER = "34600000001";
  const bookingForm = document.getElementById("bookingForm");
  const formMsg = document.getElementById("formMsg");

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(bookingForm)) {
      showMsg(formMsg, "Revisa los campos marcados.", "ko");
      return;
    }
    const d = Object.fromEntries(new FormData(bookingForm));
    const texto =
      `Hola, quiero reservar una cita.%0A` +
      `Nombre: ${d.nombre}%0ATeléfono: ${d.telefono}%0AEmail: ${d.email}%0A` +
      `Tienda: ${d.tienda}%0AServicio: ${d.servicio}`;
    showMsg(formMsg, "¡Listo! Te abrimos WhatsApp para confirmar la cita.", "ok");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, "_blank", "noopener");
    bookingForm.reset();
    chips.forEach((c, i) => c.classList.toggle("is-active", i === 0));
    servicioInput.value = chips[0].dataset.value;
  });

  // ---------- Formulario de contacto ----------
  // Para envío real: usa Formspree, EmailJS o un backend (fetch a tu endpoint).
  const contactForm = document.getElementById("contactForm");
  const contactMsg = document.getElementById("contactMsg");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(contactForm)) {
      showMsg(contactMsg, "Rellena los campos obligatorios.", "ko");
      return;
    }
    showMsg(contactMsg, "Mensaje enviado (demo). ¡Gracias!", "ok");
    contactForm.reset();
  });
});
