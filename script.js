document.addEventListener("DOMContentLoaded", () => {
    addMessage(getWelcomeMessage(), 'bot');
});

let currentLanguage = 'it';

const languageSelector = document.getElementById("language-selector");
languageSelector.addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    clearChat();
    updateUI();
});

function getWelcomeMessage() {
    if (currentLanguage === 'en') {
        return "Hello! I'm Buzzly AI, your virtual assistant. How can I help you today?";
    }
    return "Ciao! Sono Buzzly AI, il tuo assistente virtuale. Come posso aiutarti oggi?";
}

function updateUI() {
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const clearBtn = document.getElementById("clear-btn");

    if (currentLanguage === 'en') {
        userInput.placeholder = "Type a message to Buzzly AI...";
        sendBtn.textContent = "Send";
        clearBtn.textContent = "Clear";
    } else {
        userInput.placeholder = "Scrivi un messaggio a Buzzly AI...";
        sendBtn.textContent = "Invia";
        clearBtn.textContent = "Pulisci";
    }
}

function addMessage(content, sender, imageUrl = '') {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    const iconElement = document.createElement('div');
    iconElement.classList.add('icon');
    iconElement.innerHTML = sender === 'bot' ? '🐝' : '👤';

    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');
    if (imageUrl) {
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

function clearChat() {
    chatMessages.innerHTML = '';
    addMessage(getWelcomeMessage(), 'bot');
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

async function generateResponse(message, loadingDiv) {
    try {

        if (/\b(genera|disegna|immagine|foto|generate|draw|image|photo|generates)\b/i.test(message)) {
            const imageResponse = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(message)}?nologo=true`);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            loadingDiv.remove();
            addMessage("", 'bot', imageUrl);
        } else {
            const textResponse = await fetch(`https://text.pollinations.ai/${encodeURIComponent(message)}`);
            const text = await textResponse.text();

            loadingDiv.remove();
            addMessage(text, 'bot');
        }
    } catch (error) {
        console.error('Errore nella generazione della risposta:', error);
        loadingDiv.remove();
        addMessage(currentLanguage === 'en' ? "There was an error generating the response." : "C'è stato un errore nel generare la risposta.", 'bot');
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
