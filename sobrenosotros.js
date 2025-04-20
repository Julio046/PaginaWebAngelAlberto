document.addEventListener('DOMContentLoaded', function() {
    // Animación de aparición de elementos al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.mission-container, .section-header, .value-card, .certification-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Configuración inicial para elementos animados
    const setupAnimations = () => {
        const elementsToAnimate = document.querySelectorAll('.mission-container, .section-header, .value-card, .certification-card');
        
        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });
        
        // Mostrar el primer elemento (misión) inmediatamente
        document.querySelector('.mission-container').style.opacity = '1';
        document.querySelector('.mission-container').style.transform = 'translateY(0)';
    };
    
    // Slider del equipo
    const setupTeamSlider = () => {
        const track = document.querySelector('.team-track');
        const cards = document.querySelectorAll('.team-card');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;
        const cardWidth = cards[0].offsetWidth + 30; // Ancho de la tarjeta + gap
        
        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        };
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                updateSlider();
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
        
        // Touch events para móviles
        let startX, moveX;
        let isDragging = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveX = e.touches[0].clientX;
            const diff = startX - moveX;
            
            if (diff > 50 && currentIndex < cards.length - 1) {
                currentIndex++;
                updateSlider();
                isDragging = false;
            } else if (diff < -50 && currentIndex > 0) {
                currentIndex--;
                updateSlider();
                isDragging = false;
            }
        });
        
        track.addEventListener('touchend', () => {
            isDragging = false;
        });
    };
    
    // Efecto parallax para el hero
    const setupParallax = () => {
        const hero = document.querySelector('.about-hero');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        });
    };
    
    // Smooth scroll para el botón "Desliza para conocer más"
    const setupScrollButton = () => {
        const scrollButton = document.querySelector('.hero-scroll');
        
        scrollButton.addEventListener('click', () => {
            const missionSection = document.querySelector('.mission-section');
            missionSection.scrollIntoView({ behavior: 'smooth' });
        });
    };
    
    // Inicialización
    setupAnimations();
    setupTeamSlider();
    setupParallax();
    setupScrollButton();
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Ejecutar una vez al cargar la página
});
// main.js - Nuevas funcionalidades
// Slider del Equipo
const teamTrack = document.querySelector('.team-track');
const sliderArrows = document.querySelectorAll('.slider-arrow');
let currentSlide = 0;

sliderArrows.forEach(arrow => {
  arrow.addEventListener('click', () => {
    const cardWidth = document.querySelector('.team-card').offsetWidth;
    if (arrow.classList.contains('next')) {
      currentSlide = (currentSlide + 1) % teamTrack.children.length;
    } else {
      currentSlide = (currentSlide - 1 + teamTrack.children.length) % teamTrack.children.length;
    }
    teamTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  });
});

// Animación al hacer scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.value-card, .milestone, .cert-card');
  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight * 0.85) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);



// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  mobileMenu();
  animateOnScroll();
});