const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir les fichiers statiques
app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('Nouveau client connecté');
    
    ws.on('message', (message) => {
        console.log('Message reçu:', message);
        // Diffuser le message à tous les clients connectés, y compris l'expéditeur
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client déconnecté');
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('Un utilisateur s\'est déconnecté');
            }
        });
    });
});

server.listen(8080, () => {
    console.log('Serveur en écoute sur http://localhost:8080');
});
