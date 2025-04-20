
    document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const chatbotContainer = document.getElementById('chatbot-container');
    const messagesContainer = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Estado del chatbot
    let chatState = 'initial';
    let serviceSelected = '';

    // Número de WhatsApp de la empresa
    const whatsappNumber = '51986367170'; // Reemplaza con tu número
    const whatsappMessage = 'Hola, me contacto desde la web de Transportes AngelAlberto. Necesito información sobre: ';

    // Abrir/cerrar el chatbot
    toggleBtn.addEventListener('click', () =>{
        chatbotContainer.classList.toggle('hidden');
    if (!chatbotContainer.classList.contains('hidden')) {
        addBotMessage('¡Hola! Soy el asistente virtual de Transportes AngelAlberto. ¿En qué puedo ayudarte hoy?');
    showInitialOptions();
        }
    });
    
    closeBtn.addEventListener('click', () => {
        chatbotContainer.classList.add('hidden');
    });

    // Enviar mensaje al presionar Enter
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
        sendMessage();
        }
    });

    // Enviar mensaje al hacer clic en el botón
    sendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
        const message = userInput.value.trim();
    if (message === '') return;

    addUserMessage(message);
    userInput.value = '';

        // Procesar la respuesta del usuario
        setTimeout(() => {
        processUserMessage(message);
        }, 500);
    }

    function addUserMessage(message) {
        const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
    }

    function addBotMessage(message, isHTML = false) {
        const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');

    if (isHTML) {
        messageElement.innerHTML = message;
        } else {
        messageElement.textContent = message;
        }

    messagesContainer.appendChild(messageElement);
    scrollToBottom();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showInitialOptions() {
        const optionsHTML = `
    <div class="options-container">
        <button class="option-btn" data-option="cotizar">Cotizar envío</button>
        <button class="option-btn" data-option="servicios">Nuestros servicios</button>
        <button class="option-btn" data-option="cobertura">Áreas de cobertura</button>
        <button class="option-btn" data-option="contacto">Contactar con un agente</button>
    </div>
    `;

    addBotMessage(optionsHTML, true);

        // Agregar eventos a los botones de opciones
        document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const option = this.getAttribute('data-option');
            handleOptionSelection(option);
        });
        });
    }

    function handleOptionSelection(option) {
        switch(option) {
            case 'cotizar':
    chatState = 'cotizando';
    addBotMessage('¿Qué tipo de carga deseas transportar?');
    showServiceOptions();
    break;
    case 'servicios':
    addBotMessage('Ofrecemos los siguientes servicios:');
    addBotMessage(`
    <div style="margin-top: 10px;">
        <p><strong>• Transporte Nacional:</strong> Cobertura en todo el Perú</p>
        
        <p><strong>• Carga Peligrosa:</strong> Materiales ADR certificados</p>
        <p><strong>• Carga Refrigerada:</strong> Cadena de frío garantizada</p>
    </div>
    `, true);
    showInitialOptions();
    break;
    case 'cobertura':
    addBotMessage('Tenemos cobertura en todas las regiones del Perú:');
    addBotMessage(`
    <div style="margin-top: 10px;">
        <p><strong>• Región Norte:</strong> Tumbes, Piura, Lambayeque, La Libertad</p>
        <p><strong>• Región Centro:</strong> Lima, Junín, Pasco, Huánuco</p>
        <p><strong>• Región Sur:</strong> Arequipa, Moquegua, Tacna, Cusco</p>
        
    </div>
    `, true);
    showInitialOptions();
    break;
    case 'contacto':
    openWhatsApp('Consulta general');
    break;
        }
    }

    function showServiceOptions() {
        const optionsHTML = `
    <div class="options-container">
        <button class="option-btn" data-service="nacional">Transporte Nacional</button>
        
        <button class="option-btn" data-service="peligrosa">Carga Peligrosa</button>
        <button class="option-btn" data-service="refrigerada">Carga Refrigerada</button>
    </div>
    `;

    addBotMessage(optionsHTML, true);

        // Agregar eventos a los botones de servicios
        document.querySelectorAll('[data-service]').forEach(btn => {
        btn.addEventListener('click', function () {
            serviceSelected = this.getAttribute('data-service');
            askForDetails();
        });
        });
    }

    function askForDetails() {
        const serviceNames = {
        'nacional': 'Transporte Nacional',
    
    'peligrosa': 'Carga Peligrosa',
    'refrigerada': 'Carga Refrigerada'
        };

    addBotMessage(`Has seleccionado: ${serviceNames[serviceSelected]}. Por favor, describe brevemente tu carga (peso, dimensiones, origen, destino):`);
    chatState = 'detalles';
    }

    function processUserMessage(message) {
        switch(chatState) {
            case 'initial':
    addBotMessage('Por favor selecciona una de las siguientes opciones:');
    showInitialOptions();
    break;
    case 'cotizando':
    serviceSelected = 'personalizado';
    askForDetails();
    break;
    case 'detalles':
    addBotMessage('Gracias por la información. Para brindarte una cotización exacta y personalizada, un agente se comunicará contigo por WhatsApp.');
    addBotMessage(`
    <button class="whatsapp-btn" id="whatsapp-btn">
        <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
    </button>
    `, true);
                
                document.getElementById('whatsapp-btn').addEventListener('click', () => {
        openWhatsApp(`Cotización para ${serviceSelected}: ${message}`);
                });

    chatState = 'initial';
                setTimeout(() => showInitialOptions(), 2000);
    break;
    default:
    addBotMessage('No entendí tu mensaje. Por favor selecciona una opción:');
    showInitialOptions();
        }
    }

    function openWhatsApp(message) {
        const encodedMessage = encodeURIComponent(whatsappMessage + message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    }
});
