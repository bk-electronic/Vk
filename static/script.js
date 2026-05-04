// Usage limit
let usageCount = parseInt(localStorage.getItem('usageCount')) || 0;
const maxUsage = 10;
const usageEl = document.getElementById('usage');

function updateUsage() {
    usageEl.textContent = `Usage: ${usageCount}/${maxUsage}`;
    localStorage.setItem('usageCount', usageCount);
}

updateUsage();
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sectionId = btn.dataset.section;
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === sectionId) sec.classList.add('active');
        });
    });
});

// Chat functionality
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
const chatMessagesEl = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

function renderChat() {
    chatMessagesEl.innerHTML = '';
    chatMessages.forEach((msg, index) => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${msg.role}`;
        bubble.textContent = msg.content;
        if (msg.role === 'ai') {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.onclick = () => copyToClipboard(msg.content);
            bubble.appendChild(copyBtn);
        }
        chatMessagesEl.appendChild(bubble);
    });
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

renderChat();

async function sendMessage() {
    if (usageCount >= maxUsage) {
        alert('Usage limit reached. Please try again later.');
        return;
    }
    const message = chatInput.value.trim();
    if (!message) return;
    chatMessages.push({ role: 'user', content: message });
    renderChat();
    chatInput.value = '';
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));

    // Show typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble ai';
    typingBubble.innerHTML = '<div class="loading"></div> Typing...';
    chatMessagesEl.appendChild(typingBubble);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: chatMessages })
        });
        const data = await response.json();
        chatMessagesEl.removeChild(typingBubble);
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            const aiMessage = data.choices[0].message.content;
            chatMessages.push({ role: 'ai', content: aiMessage });
            renderChat();
            localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
            usageCount++;
            updateUsage();
        }
    } catch (error) {
        chatMessagesEl.removeChild(typingBubble);
        alert('Error: ' + error.message);
    }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Clear chat
document.getElementById('clear-chat').addEventListener('click', () => {
    chatMessages = [];
    renderChat();
    localStorage.removeItem('chatMessages');
});

// Text Generator
const generateTextBtn = document.getElementById('generate-text-btn');
const textPrompt = document.getElementById('text-prompt');
const toneSelect = document.getElementById('tone-select');
const textOutput = document.getElementById('text-output');

generateTextBtn.addEventListener('click', async () => {
    if (usageCount >= maxUsage) {
        alert('Usage limit reached. Please try again later.');
        return;
    }
    const prompt = textPrompt.value.trim();
    if (!prompt) return;
    textOutput.innerHTML = '<div class="loading"></div> Generating...';
    try {
        const response = await fetch('/api/generate_text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, tone: toneSelect.value })
        });
        const data = await response.json();
        if (data.error) {
            textOutput.textContent = 'Error: ' + data.error;
        } else {
            const content = data.choices[0].message.content;
            textOutput.innerHTML = content + '<button class="copy-btn" onclick="copyToClipboard(this.previousSibling.textContent)">Copy</button>';
            usageCount++;
            updateUsage();
        }
    } catch (error) {
        textOutput.textContent = 'Error: ' + error.message;
    }
});

// Hashtag Generator
const generateHashtagsBtn = document.getElementById('generate-hashtags-btn');
const hashtagKeyword = document.getElementById('hashtag-keyword');
const hashtagsOutput = document.getElementById('hashtags-output');

generateHashtagsBtn.addEventListener('click', async () => {
    if (usageCount >= maxUsage) {
        alert('Usage limit reached. Please try again later.');
        return;
    }
    const keyword = hashtagKeyword.value.trim();
    if (!keyword) return;
    hashtagsOutput.innerHTML = '<div class="loading"></div> Generating...';
    try {
        const response = await fetch('/api/generate_hashtags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword })
        });
        const data = await response.json();
        if (data.error) {
            hashtagsOutput.textContent = 'Error: ' + data.error;
        } else {
            const content = data.choices[0].message.content;
            hashtagsOutput.innerHTML = content + '<button class="copy-btn" onclick="copyToClipboard(this.previousSibling.textContent)">Copy</button>';
            usageCount++;
            updateUsage();
        }
    } catch (error) {
        hashtagsOutput.textContent = 'Error: ' + error.message;
    }
});

// Image Prompt Generator
const generateImagePromptBtn = document.getElementById('generate-image-prompt-btn');
const imageIdea = document.getElementById('image-idea');
const imagePromptOutput = document.getElementById('image-prompt-output');

generateImagePromptBtn.addEventListener('click', async () => {
    if (usageCount >= maxUsage) {
        alert('Usage limit reached. Please try again later.');
        return;
    }
    const idea = imageIdea.value.trim();
    if (!idea) return;
    imagePromptOutput.innerHTML = '<div class="loading"></div> Generating...';
    try {
        const response = await fetch('/api/generate_image_prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea })
        });
        const data = await response.json();
        if (data.error) {
            imagePromptOutput.textContent = 'Error: ' + data.error;
        } else {
            const content = data.choices[0].message.content;
            imagePromptOutput.innerHTML = content + '<button class="copy-btn" onclick="copyToClipboard(this.previousSibling.textContent)">Copy</button>';
            usageCount++;
            updateUsage();
        }
    } catch (error) {
        imagePromptOutput.textContent = 'Error: ' + error.message;
    }
});

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

// Clear chat
// Add a clear button if needed, but not specified