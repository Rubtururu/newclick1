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

// Ruta para manejar el webhook de Telegram
app.post(`/webhook/${telegramToken}`, (req, res) => {
    console.log('Webhook request received:', req.body); // Registro de solicitud recibida

    const message = req.body.message;
    const chatId = message.chat.id;
    const username = message.from.username || message.from.first_name;

    if (!users[chatId]) {
        users[chatId] = { username: username, score: 0 };
    }

    // Manejo del mensaje recibido
    axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: `Hello, ${username}! Your current score is ${users[chatId].score}.`
    })
    .then(response => {
        console.log('Mensaje enviado:', response.data); // Registro de mensaje enviado
    })
    .catch(error => {
        console.error('Error al enviar mensaje:', error); // Registro de error al enviar mensaje
    });

    res.sendStatus(200); // Responder al servidor de Telegram
});

// Endpoint para obtener el ranking
app.get('/ranking', (req, res) => {
    const ranking = Object.values(users).sort((a, b) => b.score - a.score);
    res.json(ranking);
});

// Endpoint para actualizar el puntaje
app.post('/update-score', (req, res) => {
    const { chatId, score } = req.body;
    if (users[chatId]) {
        users[chatId].score = score;
        res.json({ status: 'success', score: score });
    } else {
        res.json({ status: 'error', message: 'User not found' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
