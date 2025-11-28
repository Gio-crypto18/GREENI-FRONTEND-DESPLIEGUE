document.addEventListener('DOMContentLoaded', () => {
  const navBar = document.querySelector('.nav-bar');
  if (navBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navBar.classList.add('scrolled');
      } else {
        navBar.classList.remove('scrolled');
      }
    });
  }
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle && menuToggle.checked) {
          menuToggle.checked = false;
        }
        
        const headerOffset = navBar ? navBar.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  const modoManualBtn = document.getElementById('modoManualBtn');
  const modoFotoBtn = document.getElementById('modoFotoBtn');
  const inputsManual = document.getElementById('inputsManual');
  const inputsFoto = document.getElementById('inputsFoto');
  const uploadArea = document.querySelector('.upload-area');
  const fotoPlantaInput = document.getElementById('fotoPlanta');
  const imagePreview = document.getElementById('image-preview');

  if (modoManualBtn && modoFotoBtn) {
    modoManualBtn.addEventListener('click', () => {
      modoManualBtn.classList.add('active');
      modoFotoBtn.classList.remove('active');
      inputsManual.classList.remove('hidden');
      inputsFoto.classList.add('hidden');
    });

    modoFotoBtn.addEventListener('click', () => {
      modoFotoBtn.classList.add('active');
      modoManualBtn.classList.remove('active');
      inputsFoto.classList.remove('hidden');
      inputsManual.classList.add('hidden');
    });
  }
  if(uploadArea && fotoPlantaInput) {
    uploadArea.addEventListener('click', () => fotoPlantaInput.click());
    
    fotoPlantaInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadArea.classList.add('hidden');
                imagePreview.classList.remove('hidden');
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Vista previa de la planta" style="max-width: 100%; border-radius: 15px;">`;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });
  }

  function updateSlider(slider, valueDisplay, unit = '') {
    if (!slider || !valueDisplay) return;
    const applyFill = (el) => {
      const percentage = ((el.value - el.min) / (el.max - el.min)) * 100;
      const activeColor = '#005014';
      const inactiveColor = '#A5D6A7';
      el.style.background = `linear-gradient(to right, ${activeColor} ${percentage}%, ${inactiveColor} ${percentage}%)`;
    };
    slider.addEventListener('input', (e) => {
      const value = e.target.value;
      valueDisplay.textContent = `${unit === 'pH' ? parseFloat(value).toFixed(1) : value}${unit === 'pH' ? '' : unit}`;
      applyFill(e.target);
    });
    applyFill(slider);
  }

  updateSlider(document.getElementById('temp'), document.getElementById('temp-value'), '°C');
  updateSlider(document.getElementById('humedad'), document.getElementById('humedad-value'), '%');
  updateSlider(document.getElementById('ph'), document.getElementById('ph-value'), 'pH');
  const analizarBtn = document.getElementById('analizarBtn');
  const tipoPlantaInput = document.getElementById('tipoPlanta');
  const mensajeAnalisis = document.getElementById('mensajeAnalisis');

  if(analizarBtn) {
    analizarBtn.addEventListener('click', () => {
        const modoManualActivo = modoManualBtn.classList.contains('active');
        const modoFotoActivo = modoFotoBtn.classList.contains('active');
        const esValidoManual = modoManualActivo && tipoPlantaInput.value.trim() !== '';
        const esValidoFoto = modoFotoActivo && fotoPlantaInput.files.length > 0;
        mensajeAnalisis.textContent = '';
        mensajeAnalisis.style.color = '#003D0F'; 

        if (esValidoManual || esValidoFoto) {
            mensajeAnalisis.textContent = 'Datos actualizados. Si quieres ver los resultados, Ingresa a Greeni.';
        } else {
            if (modoManualActivo) {
                mensajeAnalisis.textContent = 'Error: Debes ingresar el tipo de planta para analizar.';
            } else if (modoFotoActivo) {
                mensajeAnalisis.textContent = 'Error: Debes subir una foto para analizar.';
  }
        }
        setTimeout(() => {
            mensajeAnalisis.textContent = '';
        }, 4000);
    });
  }

  const explorarGuiasBtn = document.getElementById('explorarGuiasBtn');
  const backToIntroBtn = document.getElementById('back-to-intro-btn');
  const guidesIntroView = document.getElementById('guides-intro');
  const guidesGalleryView = document.getElementById('guides-gallery');

  if (explorarGuiasBtn && backToIntroBtn && guidesIntroView && guidesGalleryView) {
    explorarGuiasBtn.addEventListener('click', () => {
      guidesIntroView.classList.add('hidden');
      guidesGalleryView.classList.remove('hidden');
    });
    backToIntroBtn.addEventListener('click', () => {
      guidesGalleryView.classList.add('hidden');
      guidesIntroView.classList.remove('hidden');
    });
  }

  const carouselContainer = document.querySelector('.carousel-container');
  const reviews = document.querySelectorAll('.review-card');
  const indicatorsContainer = document.getElementById('carouselIndicators');
  let currentIndex = 0;
  let intervalId;

  if (carouselContainer && reviews.length > 0) {
    for (let i = 0; i < reviews.length; i++) {
        const button = document.createElement('button');
        button.classList.add('indicator');
        button.dataset.index = i;
        if (i === 0) button.classList.add('active');
        indicatorsContainer.appendChild(button);
    }
    const indicators = Array.from(indicatorsContainer.children);

    function updateCarousel(newIndex, isManual = false) {
      if (isManual) stopCarousel();
      
      const prevIndex = (newIndex - 1 + reviews.length) % reviews.length;
      const nextIndex = (newIndex + 1) % reviews.length;
      
      reviews.forEach(review => review.classList.remove('active', 'prev', 'next'));
      reviews[newIndex].classList.add('active');
      reviews[prevIndex].classList.add('prev');
      reviews[nextIndex].classList.add('next');
      
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === newIndex);
      });
      currentIndex = newIndex;
      if (isManual) startCarousel();
    }
    function nextSlide() { updateCarousel((currentIndex + 1) % reviews.length); }
    function startCarousel() { intervalId = setInterval(nextSlide, 5000); }
    function stopCarousel() { clearInterval(intervalId); }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => updateCarousel(index, true));
    });
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);
    
    updateCarousel(0);
    startCarousel();
  }
  
   const formContacto = document.getElementById('formContacto');

  if (formContacto) {
    const enviarBtn = document.getElementById('enviarBtn');
    const errorContainer = document.getElementById('errorContacto');
    const successContainer = document.getElementById('mensajeEnviado');
    const inputs = formContacto.querySelectorAll('input[required], textarea[required]');

    const validateFormState = () => {
      let allValid = true;

      inputs.forEach(input => {
        if (input.type === 'radio') {
          if (!document.querySelector(`input[name="${input.name}"]:checked`)) {
            allValid = false;
          }
        } else if (input.value.trim() === '') {
          allValid = false;
        }
      });

      enviarBtn.disabled = !allValid;
    };

    // Validación dinámica
    inputs.forEach(input => input.addEventListener('input', validateFormState));
    validateFormState(); // para que empiece desactivado

    formContacto.addEventListener('submit', async (e) => {
      e.preventDefault();

      const errors = [];
      errorContainer.innerHTML = '';
      successContainer.textContent = '';

      const fullName = document.getElementById('nombre').value.trim();
      const phone = document.getElementById('telefono').value.trim();
      const email = document.getElementById('correo').value.trim();
      const userTypeEl = document.querySelector('input[name="tipoUsuario"]:checked');
      const userType = userTypeEl ? userTypeEl.value : "";
      const message = document.getElementById('mensaje').value.trim();

      // Validaciones
      if (!fullName) {
        errors.push("El campo 'Nombre - Apellidos' es obligatorio.");
      } else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,50}$/.test(fullName)) {
        errors.push("El nombre debe contener solo letras y espacios (3-50 caracteres).");
      }

      if (!phone) {
        errors.push("El campo 'Teléfono' es obligatorio.");
      } else if (!/^\d{9}$/.test(phone)) {
        errors.push("El teléfono debe contener 9 números.");
      }

      if (!email) {
        errors.push("El campo 'Correo' es obligatorio.");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Ingresa una dirección de correo electrónico válida.");
      }

      if (!userType) {
        errors.push("Debes seleccionar un 'Tipo de Usuario'.");
      }

      if (!message) {
        errors.push("El campo 'Mensaje' es obligatorio.");
      } else if (message.length > 500) {
        errors.push("El mensaje no puede exceder los 500 caracteres.");
      }

      if (errors.length > 0) {
        errorContainer.innerHTML = errors.map(err => `• ${err}`).join('<br>');
        enviarBtn.disabled = false;
        return;
      }

      // Si pasó las validaciones → enviar al backend / formsubmit
      try {
        enviarBtn.disabled = true;
        enviarBtn.textContent = "Enviando...";

        const formData = new FormData(formContacto);
        formData.append("_captcha", "false");
        formData.append("_next", "http://127.0.0.1:5500/"); // cambia esto si tu url es otra

        const res = await fetch(formContacto.action, {
          method: "POST",
          body: formData
        });

        if (!res.ok) throw new Error("Error al enviar el formulario");

        formContacto.reset();
        validateFormState(); // vuelve a desactivar el botón

        successContainer.textContent = "¡Mensaje enviado correctamente!";
        successContainer.style.color = "#005014";
        enviarBtn.textContent = "Mensaje Enviado";
        enviarBtn.style.backgroundColor = "#4CAF50";

        setTimeout(() => {
          successContainer.textContent = '';
          enviarBtn.textContent = "Enviar Mensaje";
          enviarBtn.style.backgroundColor = "";
        }, 4000);

      } catch (error) {
        console.error(error);
        errorContainer.textContent = "No se pudo enviar el mensaje. Intenta nuevamente.";
        enviarBtn.textContent = "Reintentar";
        enviarBtn.disabled = false;
      }
    });
  }
});