import { generateResponse } from './pollinations.js';

document.addEventListener("DOMContentLoaded", () => {
    addMessage(getWelcomeMessage(), 'bot', '', true);
});

let currentLanguage = 'it';

const languageSelector = document.getElementById("language-selector");
languageSelector.addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    updateUI();
});

function getWelcomeMessage() {
    if (currentLanguage === 'en') {
        return "Hello! I'm Buzzly AI, your virtual assistant. How can I help you today?";
    }
    return "Ciao! Sono Buzzly AI, il tuo assistente virtuale. Come posso aiutarti oggi?";
}

// Funzione di aggiunta messaggi (con ID al messaggio di benvenuto)
function addMessage(content, sender, imageUrl = '', isWelcomeMessage = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    if (isWelcomeMessage) {
        messageElement.setAttribute('id', 'welcome-message');
    }

    const iconElement = document.createElement('div');
    iconElement.classList.add('icon');
    iconElement.innerHTML = sender === 'bot' ? '🐝' : '👤';

    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');

    if (imageUrl) {
        // Codice per aggiungere immagine e bottone di download
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.style.maxWidth = '100%';
        contentElement.appendChild(imageElement);
        
        const downloadButton = document.createElement('div');
        downloadButton.classList.add('download-button');
        const downloadIcon = document.createElement('img');
        downloadIcon.src = 'icons/download.png';
        downloadButton.appendChild(downloadIcon);

        downloadButton.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = 'generated-image.png';
            a.click();
        });

        contentElement.appendChild(downloadButton);
    } else {
        contentElement.innerHTML = content;
    }

    messageElement.appendChild(iconElement);
    messageElement.appendChild(contentElement);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Aggiornamento della UI per cambiare la lingua senza eliminare la chat
function updateUI() {
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const clearBtn = document.getElementById("clear-btn");
    const welcomeMessage = document.getElementById("welcome-message");

    if (currentLanguage === 'en') {
        userInput.placeholder = "Type a message to Buzzly AI...";
        sendBtn.textContent = "Send";
        clearBtn.textContent = "Clear";
        if (welcomeMessage) welcomeMessage.querySelector('.message-content').innerHTML = "Hello! I'm Buzzly AI, your virtual assistant. How can I help you today?";
    } else {
        userInput.placeholder = "Scrivi un messaggio a Buzzly AI...";
        sendBtn.textContent = "Invia";
        clearBtn.textContent = "Pulisci";
        if (welcomeMessage) welcomeMessage.querySelector('.message-content').innerHTML = "Ciao! Sono Buzzly AI, il tuo assistente virtuale. Come posso aiutarti oggi?";
    }
}

// Funzione per pulire la chat e reinserire il messaggio di benvenuto (solo se non è già presente)
function clearChat() {
    chatMessages.innerHTML = '';
    addMessage(getWelcomeMessage(), 'bot', '', true);
}

const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", clearChat);

function appendLoadingAnimation() {
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "bot", "loading");

    const icon = document.createElement("div");
    icon.classList.add("icon");
    icon.innerHTML = "🐝";

    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing-indicator");

    for (let i = 0; i < 3; i++) {
        const circle = document.createElement("div");
        circle.classList.add("typing-circle");
        typingIndicator.appendChild(circle);
    }

    loadingDiv.appendChild(icon);
    loadingDiv.appendChild(typingIndicator);
    chatMessages.appendChild(loadingDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return loadingDiv;
}

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage !== "") {
        addMessage(userMessage, 'user');
        userInput.value = "";

        const loadingDiv = appendLoadingAnimation();
        await generateResponse(userMessage, loadingDiv);
    }
}

const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatMessages = document.querySelector(".chat-messages");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

export { addMessage };

