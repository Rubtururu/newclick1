const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const telegramToken = '7209539640:AAHiscqStO8mpy8aurPL6bunDFAtFfIy258';
const telegramApiUrl = `https://api.telegram.org/bot${telegramToken}`;

let users = {};

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Telegram Webhook
app.post(`/webhook/${telegramToken}`, (req, res) => {
    const message = req.body.message;
    const chatId = message.chat.id;
    const username = message.from.username || message.from.first_name;

    if (!users[chatId]) {
        users[chatId] = { username: username, score: 0 };
    }

    // Respond to user
    axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: `Hello, ${username}! Your current score is ${users[chatId].score}.`
    });

    res.sendStatus(200);
});

// Endpoint to get ranking
app.get('/ranking', (req, res) => {
    const ranking = Object.values(users).sort((a, b) => b.score - a.score);
    res.json(ranking);
});

// Endpoint to update score
app.post('/update-score', (req, res) => {
    const { chatId, score } = req.body;
    if (users[chatId]) {
        users[chatId].score = score;
        res.json({ status: 'success', score: score });
    } else {
        res.json({ status: 'error', message: 'User not found' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
