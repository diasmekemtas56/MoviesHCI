// Функция для открытия/закрытия окна чата
function toggleChatWindow() {
    const chatWindow = document.getElementById('chatbotWindow');
    chatWindow.classList.toggle('open');
}

// Функция для отправки сообщения
async function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const messagesContainer = document.getElementById('chatbotMessages');
    const userMessage = input.value.trim();

    if (!userMessage) return;

    // Добавляем сообщение пользователя в чат
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.textContent = userMessage;
    messagesContainer.appendChild(userMessageDiv);

    // Очищаем поле ввода
    input.value = '';

    // Прокручиваем чат вниз
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Отправляем запрос к API
    try {
        const response = await fetch('/chatbot/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(), // Получаем CSRF-токен для Django
            },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();

        // Добавляем ответ бота в чат
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.textContent = data.response || 'Произошла ошибка. Попробуйте снова.';
        messagesContainer.appendChild(botMessageDiv);

        // Прокручиваем чат вниз
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        console.error('Ошибка:', error);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.textContent = 'Произошла ошибка. Попробуйте снова.';
        messagesContainer.appendChild(botMessageDiv);
    }
}

// Функция для получения CSRF-токена
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