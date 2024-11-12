//pollinations.ai generation logic - logica generazione pollinations.ai

import { addMessage } from './script.js';

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

export { generateResponse };
