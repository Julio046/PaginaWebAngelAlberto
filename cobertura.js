document.addEventListener('DOMContentLoaded', function() {
    // 1. Configuración del Mapa Interactivo
    const initMap = () => {
        const map = L.map('coverage-map').setView([-9.1900, -75.0152], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const regions = {
            lima: {
                coords: [-12.0464, -77.0428],
                name: "Lima y Callao",
                info: `<h4>Lima y Callao</h4><p><strong>Cobertura completa:</strong> Todos los distritos</p><p><strong>Centro logístico principal:</strong> Ate, Lima</p><p><strong>Frecuencia de envíos:</strong> Diaria</p><p><strong>Horario de recojo:</strong> 8:00 am - 6:00 pm</p>`,
                color: "#e74c3c"
            },
            norte: {
                coords: [-8.1091, -79.0215],
                name: "Región Norte",
                info: `<h4>Región Norte</h4><p><strong>Departamentos cubiertos:</strong> Tumbes, Piura, Lambayeque, La Libertad, Ancash</p><p><strong>Centros logísticos:</strong> Trujillo, Chiclayo</p><p><strong>Frecuencia de envíos:</strong> 6 veces por semana</p>`,
                color: "#3498db"
            },
            sur: {
                coords: [-16.4090, -71.5375],
                name: "Región Sur",
                info: `<h4>Región Sur</h4><p><strong>Departamentos cubiertos:</strong> Arequipa, Moquegua, Tacna, Puno, Cusco</p><p><strong>Centros logísticos:</strong> Arequipa, Tacna</p><p><strong>Frecuencia de envíos:</strong> 5 veces por semana</p>`,
                color: "#2ecc71"
            },
            centro: {
                coords: [-11.7667, -74.9833],
                name: "Región Centro",
                info: `<h4>Región Centro</h4><p><strong>Departamentos cubiertos:</strong> Junín, Pasco, Huánuco, Ayacucho, Huancavelica</p><p><strong>Centros logísticos:</strong> Huancayo, Huánuco</p><p><strong>Frecuencia de envíos:</strong> 4 veces por semana</p>`,
                color: "#f39c12"
            },
            oriente: {
                coords: [-3.7491, -73.2536], 
                name: "Región Oriente",
                info: `<h4>Región Oriente</h4><p><strong>Departamentos cubiertos:</strong> Loreto, Ucayali, Madre de Dios, San Martín</p><p><strong>Centros logísticos:</strong> Iquitos, Pucallpa</p><p><strong>Frecuencia de envíos:</strong> 3 veces por semana</p>`,
                color: "#9b59b6" // Color morado para diferenciar
            },
        

        };

        // Añadir marcadores y eventos
        Object.keys(regions).forEach(region => {
            const { coords, name, info, color } = regions[region];
            const marker = L.circleMarker(coords, {
                radius: 8,
                fillColor: color,
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map).bindPopup(`<strong>${name}</strong>`);

            marker.on('click', function() {
                updateRegionInfo(name, info);
                highlightMarker(marker, region, regions);
            });
        });

        const updateRegionInfo = (name, info) => {
            document.getElementById('region-name').textContent = name;
            document.getElementById('region-info').innerHTML = info;
            animateElement(document.querySelector('.region-info'));
        };

        const highlightMarker = (marker, currentRegion, regions) => {
            marker.setStyle({ radius: 12, fillColor: '#e74c3c' });
            Object.keys(regions).forEach(region => {
                if (region !== currentRegion) {
                    map.eachLayer(layer => {
                        if (layer instanceof L.CircleMarker && layer !== marker) {
                            layer.setStyle({ radius: 8, fillColor: regions[region].color });
                        }
                    });
                }
            });
        };

        // Eventos para la lista de ubicaciones
        document.querySelectorAll('#location-list li').forEach(item => {
            item.addEventListener('click', function() {
                const region = this.dataset.region;
                const { name, info, coords } = regions[region];
                updateRegionInfo(name, info);
                map.flyTo(coords, 7, { duration: 1, easeLinearity: 0.25 });
                
                document.querySelectorAll('#location-list li').forEach(li => {
                    li.style.background = '#f8f9fa';
                    li.style.color = '#333';
                });
                this.style.background = '#e74c3c';
                this.style.color = 'white';
            });
        });
    };

    // 2. Animación de Contadores
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                const updateCount = () => {
                    const newCount = Math.ceil(count + increment);
                    counter.innerText = newCount < target ? newCount : target;
                    if (newCount < target) setTimeout(updateCount, 1);
                };
                updateCount();
            }
        });
    };

    // 3. Animaciones al Scroll
    const animateOnScroll = () => {
        const animateElements = (elements) => {
            elements.forEach(element => {
                if (element.getBoundingClientRect().top < window.innerHeight * 0.85) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        const elementsToAnimate = [
            ...document.querySelectorAll('.stat-item'),
            ...document.querySelectorAll('.route-item'),
            ...document.querySelectorAll('.country-card')
        ];
        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        animateElements(elementsToAnimate);
        window.addEventListener('scroll', () => animateElements(elementsToAnimate));
    };

    // 4. Configuración de Eventos
    const setupEventListeners = () => {
        // Smooth scroll
        document.querySelector('.hero-scroll').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.map-section').scrollIntoView({ behavior: 'smooth' });
        });

        document.querySelector('.cta-btn').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#footer-content').scrollIntoView({ behavior: 'smooth' });
        });

        // Efectos hover
        document.querySelectorAll('.country-card').forEach(card => {
            const flag = card.querySelector('.country-flag');
            card.addEventListener('mouseenter', () => {
                flag.style.transform = 'scale(1.1) rotate(5deg)';
                flag.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
            });
            card.addEventListener('mouseleave', () => {
                flag.style.transform = 'scale(1) rotate(0)';
                flag.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
            });
        });
    };

    // 5. Funciones Auxiliares
    const animateElement = (element) => {
        element.style.animation = 'none';
        void element.offsetWidth;
        element.style.animation = 'fadeInUp 0.5s ease-out';
    };

    const injectCSS = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .leaflet-interactive {
                transition: all 0.3s ease;
            }
            .leaflet-interactive:hover {
                stroke-width: 3;
            }
        `;
        document.head.appendChild(style);
    };

    // Inicialización
    const init = () => {
        injectCSS();
        initMap();
        animateCounters();
        animateOnScroll();
        setupEventListeners();
        setTimeout(() => document.querySelector('[data-region="lima"]').click(), 1000);
    };

    init();
});