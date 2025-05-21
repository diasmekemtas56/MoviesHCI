// static/js/chatbot.js
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // Минимальный интервал между запросами (2 секунды)

function toggleChatWindow(windowId) {
    const chatWindow = document.getElementById(windowId);
    chatWindow.classList.toggle('open');
}

async function sendMessage(chatbotType) {
    const isFaqChatbot = chatbotType === 'faq-chatbot';
    const inputId = isFaqChatbot ? 'faqChatbotInput' : 'chatbotInput';
    const messagesId = isFaqChatbot ? 'faqChatbotMessages' : 'chatbotMessages';
    const url = isFaqChatbot ? '/faq-chatbot/' : '/chatbot/';

    const now = Date.now();
    if (!isFaqChatbot && now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        const messagesContainer = document.getElementById(messagesId);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.textContent = 'Пожалуйста, подождите немного перед отправкой следующего сообщения.';
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return;
    }

    const input = document.getElementById(inputId);
    const messagesContainer = document.getElementById(messagesId);
    const userMessage = input.value.trim();

    if (!userMessage) return;

    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.textContent = userMessage;
    messagesContainer.appendChild(userMessageDiv);

    input.value = '';
    input.disabled = true;
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message';
    loadingDiv.textContent = 'Загрузка...';
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        if (!isFaqChatbot) {
            lastRequestTime = now;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        loadingDiv.remove();
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.textContent = data.response || 'Произошла ошибка. Попробуйте снова.';
        messagesContainer.appendChild(botMessageDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        console.error('Ошибка:', error);
        loadingDiv.remove();
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.textContent = `Произошла ошибка: ${error.message}. Попробуйте снова.`;
        messagesContainer.appendChild(botMessageDiv);
    } finally {
        input.disabled = false;
    }
}

function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}