document.addEventListener('DOMContentLoaded', function() {
    // 1. Filtrado de servicios por categoría
    const filterServices = () => {
        const tabs = document.querySelectorAll('.tab-btn');
        const services = document.querySelectorAll('.service-card');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remover clase active de todos los tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Añadir clase active al tab clickeado
                tab.classList.add('active');
                
                const category = tab.dataset.category;
                
                // Mostrar/ocultar servicios según categoría
                services.forEach(service => {
                    if (category === 'all' || service.dataset.category === category) {
                        service.style.display = 'block';
                        // Animación al filtrar
                        service.style.animation = 'fadeIn 0.5s ease-out';
                    } else {
                        service.style.display = 'none';
                    }
                });
            });
        });
    };
    
    document.addEventListener('DOMContentLoaded', function() {
        const track = document.querySelector('.testimonios-track');
        const slides = document.querySelectorAll('.testimonio');
        const dots = document.querySelectorAll('.slider-dot');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        let currentIndex = 0;
        const slideWidth = slides[0].getBoundingClientRect().width;
        
        // Función para mover el slider
        function moveToSlide(index) {
            currentIndex = index;
            const newPosition = -currentIndex * slideWidth;
            track.style.transform = `translateX(${newPosition}px)`;
            updateDots();
        }
        
        // Función para actualizar los indicadores
        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Event listeners para los botones
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % slides.length;
            moveToSlide(currentIndex);
        });
        
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(currentIndex);
        });
        
        // Event listeners para los dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                moveToSlide(index);
            });
        });
        
        // Ajustar el tamaño del track al cargar y redimensionar
        function setTrackWidth() {
            const totalWidth = slides.length * slideWidth;
            track.style.width = `${totalWidth}px`;
            
            // Actualizar el ancho de cada slide
            slides.forEach(slide => {
                slide.style.width = `${slideWidth}px`;
            });
        }
        
        // Inicializar
        setTrackWidth();
        window.addEventListener('resize', function() {
            slideWidth = slides[0].getBoundingClientRect().width;
            setTrackWidth();
            moveToSlide(currentIndex); // Volver a posicionar correctamente
        });
        
        // Opcional: Autoplay
        let autoplayInterval;
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                moveToSlide(currentIndex);
            }, 5000);
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        startAutoplay();
        
        // Pausar autoplay al interactuar
        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);
        track.addEventListener('touchstart', stopAutoplay);
    });

    // 3. Animaciones al hacer scroll
    const animateOnScroll = () => {
        const animateElements = (elements) => {
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight * 0.85) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Elementos a animar
        const services = document.querySelectorAll('.service-card');
        const features = document.querySelectorAll('.feature-card');
        const steps = document.querySelectorAll('.process-step');
        const testimonials = document.querySelectorAll('.testimonio');
        
        // Configuración inicial
        const allElements = [...services, ...features, ...steps, ...testimonials];
        allElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        // Ejecutar al cargar y al hacer scroll
        animateElements(allElements);
        window.addEventListener('scroll', () => animateElements(allElements));
    };

    // 4. Smooth scroll para botones
    const setupScrollButtons = () => {
        // Botón "Explora nuestros servicios"
        document.querySelector('.hero-scroll').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.services-grid-section').scrollIntoView({
                behavior: 'smooth'
            });
        });

        // Botones "Cotizar ahora"
        document.querySelectorAll('.service-cta').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('#footer-content').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    };

    // 5. Efecto hover para tarjetas de servicios
    const setupServiceCardsHover = () => {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.querySelector('.service-card-inner').style.transform = 'rotateY(180deg)';
            });
            card.addEventListener('mouseleave', () => {
                card.querySelector('.service-card-inner').style.transform = 'rotateY(0deg)';
            });
        });
    };

    // Inicializar todas las funciones
    const init = () => {
        filterServices();
        setupTestimonialsSlider(); // <-- Versión mejorada con fotos
        animateOnScroll();
        setupScrollButtons();
        setupServiceCardsHover();
        
        // Mostrar todos los servicios inicialmente
        document.querySelector('.tab-btn.active').click();
    };

    init();
});

// Animación CSS adicional
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Estilos para el slider de testimonios con fotos */
    .testimonios-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 60px 20px;
    }
    
    .testimonios-slider {
        position: relative;
        overflow: hidden;
        padding: 0 60px;
    }
    
    .testimonios-track {
        display: flex;
        transition: transform 0.6s ease;
    }
    
    .testimonio {
        min-width: 100%;
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
    }
    
    .testimonio-content {
        flex: 1;
        background: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        margin-right: -100px;
        position: relative;
        z-index: 2;
    }
    
    .testimonio-text {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #555;
        margin-bottom: 20px;
        position: relative;
        padding-left: 30px;
    }
    
    .testimonio-text::before {
        content: "\\201C";
        font-family: Georgia, serif;
        font-size: 4rem;
        color: #3498db;
        opacity: 0.2;
        position: absolute;
        left: -15px;
        top: -20px;
    }
    
    .testimonio-author {
        display: flex;
        align-items: center;
    }
    
    .author-image {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #3498db;
        margin-right: 20px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    
    .testimonio-image {
        flex: 1;
        position: relative;
        z-index: 1;
        margin-left: -80px;
    }
    
    .testimonio-image img {
        width: 100%;
        max-width: 400px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        transform: perspective(1000px) rotateY(-15deg);
        transition: transform 0.5s;
    }
    
    .slider-controls {
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
    
    .slider-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ccc;
        margin: 0 8px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .slider-dot.active {
        background: #3498db;
        transform: scale(1.2);
    }
    
    .slider-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        cursor: pointer;
        z-index: 10;
        color: #3498db;
        font-size: 1.2rem;
        transition: all 0.3s;
    }
    
    .slider-nav:hover {
        background: #3498db;
        color: white;
    }
    
    .slider-prev {
        left: 0;
    }
    
    .slider-next {
        right: 0;
    }
    
    @media (max-width: 992px) {
        .testimonio {
            flex-direction: column;
        }
        
        .testimonio-content {
            margin-right: 0;
            margin-bottom: -50px;
        }
        
        .testimonio-image {
            margin-left: 0;
            margin-top: -50px;
            width: 100%;
            max-width: 400px;
        }
        
        .testimonio-image img {
            transform: none;
        }
    }
    
    @media (max-width: 768px) {
        .testimonios-slider {
            padding: 0 40px;
        }
        
        .testimonio-content {
            padding: 30px;
        }
        
        .slider-nav {
            width: 40px;
            height: 40px;
            font-size: 1rem;
        }
    }
`;
document.head.appendChild(style);