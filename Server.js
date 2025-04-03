require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Set the target website (change this in .env file)
const target = process.env.TARGET_URL || 'https://www.wikipedia.org';

// Stealth Headers - Makes it harder for school filters to detect
const proxyOptions = {
    target,
    changeOrigin: true,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', // Spoof as normal browser
        'Referer': target, // Makes it look like you are coming from the target site
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('X-Forwarded-For', ''); // Hides real IP
    },
    onError: (err, req, res) => {
        res.status(500).send('Proxy is currently down, try again later.');
    }
};

// Multiple Port Support - Auto-switch if one gets blocked
const ports = [3000, 4000, 5000];
let currentPort = ports[Math.floor(Math.random() * ports.length)];

// Proxy Route
app.use('/', createProxyMiddleware(proxyOptions));

// Start the server on a random port
app.listen(currentPort, () => {
    console.log(`Stealth Proxy Running on Port ${currentPort}`);
});
