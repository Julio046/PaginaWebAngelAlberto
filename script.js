// Smooth scroll mejorado con gestión de estados
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      
      target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
      });
      
      // Actualizar URL sin recargar
      if (history.pushState) {
          history.pushState(null, null, this.href);
      }
  });
});

// Sistema de animaciones con Intersection Observer
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          if (entry.target.classList.contains('stats')) {
              animateNumbers(entry.target);
          }
      }
  });
}, { threshold: 0.25 });

// Animación de números optimizada
const animateNumbers = (container) => {
  const stats = container.querySelectorAll('.stat-number');
  stats.forEach(stat => {
      const target = parseInt(stat.textContent.replace('+', ''), 10);
      let start = 0;
      const duration = 1500;
      const startTime = Date.now();

      const update = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          stat.textContent = Math.floor(progress * target) + '+';
          
          if (progress < 1) {
              requestAnimationFrame(update);
          }
      };
      
      requestAnimationFrame(update);
  });
};

// Clase mejorada para el carrusel con soporte táctil
class HeroCarousel {
  constructor() {
      this.slides = Array.from(document.querySelectorAll('.carrusel-slide'));
      this.currentSlide = 0;
      this.interval = null;
      this.touchStartX = 0;
      this.init();
  }

  init() {
      this.showSlide(this.currentSlide);
      this.addEventListeners();
      this.startAutoplay();
  }

  addEventListeners() {
      const hero = document.querySelector('.hero');
      
      // Controles de navegación
      document.querySelector('.prev')?.addEventListener('click', () => this.prevSlide());
      document.querySelector('.next')?.addEventListener('click', () => this.nextSlide());

      // Eventos táctiles
      hero.addEventListener('touchstart', e => this.touchStartX = e.touches[0].clientX);
      hero.addEventListener('touchend', e => this.handleSwipe(e));
  }

  handleSwipe(e) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = this.touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) {
          diff > 0 ? this.nextSlide() : this.prevSlide();
      }
  }

  showSlide(index) {
      this.currentSlide = (index + this.slides.length) % this.slides.length;
      
      this.slides.forEach((slide, i) => {
          slide.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
          slide.style.opacity = i === this.currentSlide ? '1' : '0';
      });
  }

  nextSlide() { this.showSlide(this.currentSlide + 1); }
  prevSlide() { this.showSlide(this.currentSlide - 1); }
  
  startAutoplay() {
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => this.nextSlide(), 5000);
  }
}

// Gestión de ubicaciones interactivas
const initLocationMap = () => {
  const locations = document.querySelectorAll('.location-tag');
  const locationImage = document.querySelector('.location-image');
  const brandsContainer = document.getElementById('location-brands');

  const preloadImages = () => {
      locations.forEach(location => {
          new Image().src = location.dataset.image;
          location.dataset.brands?.split(',').forEach(brand => new Image().src = brand.trim());
      });
  };

  const updateLocationView = (location) => {
      // Actualizar imagen principal
      locationImage.src = location.dataset.image;
      locationImage.alt = `Mapa de ${location.textContent}`;
      
      // Actualizar logos de marcas
      brandsContainer.innerHTML = location.dataset.brands
          ?.split(',')
          ?.map(brand => `
              <img src="${brand.trim()}" 
                   alt="Logo ${brand.split('/').pop().split('.')[0]}" 
                   class="brand-logo"
                   loading="lazy">`)
          ?.join('') || '';
  };

  locations.forEach(location => {
      location.addEventListener('mouseenter', () => updateLocationView(location));
      location.addEventListener('click', () => {
          locations.forEach(loc => loc.classList.remove('active'));
          location.classList.add('active');
      });
  });

  if (locations.length) {
      preloadImages();
      updateLocationView(locations[0]);
      locations[0].classList.add('active');
  }
};

// Inicialización completa al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  // Configurar observador de animaciones
  document.querySelectorAll('.stats, .brands, .timeline, .locations, .service-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      animationObserver.observe(el);
  });

  // Inicializar componentes
  new HeroCarousel();
  initLocationMap();

  // Efecto hover en botones
  document.querySelectorAll('.cta-button').forEach(button => {
      button.style.transition = 'transform 0.3s ease';
      button.addEventListener('mouseenter', () => button.style.transform = 'scale(1.05)');
      button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');
  });

  // Efecto parallax optimizado
  let lastScroll = 0;
  const parallaxElement = document.querySelector('.hero');
  const handleParallax = () => {
      requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          parallaxElement.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0)`;
      });
  };
  
  window.addEventListener('scroll', () => {
      if (Math.abs(window.pageYOffset - lastScroll) > 2) {
          handleParallax();
          lastScroll = window.pageYOffset;
      }
  }, { passive: true });
});

  const locations = document.querySelectorAll('.location-tag');
  const mainMap = document.querySelector('.map-image');
  const brandsPanel = document.getElementById('brands-panel');

  // Precarga de imágenes
  const preloadImages = () => {
      locations.forEach(location => {
          new Image().src = location.dataset.image;
          location.dataset.brands.split(',').forEach(brand => {
              new Image().src = brand.trim();
          });
      });
  };
  preloadImages();

  // Actualizar vista
  const updateView = (location) => {
      mainMap.src = location.dataset.image;
      brandsPanel.innerHTML = location.dataset.brands.split(',')
          .map(brand => `<img src="${brand.trim()}" class="brand-logo">`)
          .join('');
  };

  // Event listeners
  locations.forEach(location => {
      location.addEventListener('mouseenter', () => updateView(location));
  });

document.querySelectorAll('.location-tag').forEach(item => {
    item.addEventListener('click', function() {
        // Actualizar mapa principal
        const mainMap = document.querySelector('.map-image');
        mainMap.src = this.dataset.image;
        
        // Cargar marcas
        const brandsPanel = document.getElementById('brands-panel');
        brandsPanel.innerHTML = this.dataset.brands
            .split(',')
            .map(brand => `<img src="${brand.trim()}" class="brand-logo">`)
            .join('');
    });
});
