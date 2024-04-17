const express = require('express');
const bodyParser = require('body-parser');
const { firewall, logHeaders } = require('./logHeadersMiddleware');

const app = express();
app.use(bodyParser.json());

let authToken = null; 


app.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
    
  
    if (email === 'user@example.com' && password === 'password') {
        authToken = Math.random().toString(36).substr(2); // Générer un token aléatoire
        res.json({ token: authToken });
    } else {
        res.status(401).json({ error: 'Email or password incorrect' });
    }
});


app.get('/hello', (req, res) => {
    res.send("<h1>Hello</h1>");
});


app.get('/restricted1', (req, res) => {
    const token = req.headers['authorization'];

    if (token === authToken) {
        res.json({ message: "topsecret" });
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
});


app.get('/restricted2', (req, res) => {
    const token = req.headers['authorization'];

    if (token === authToken) {
        res.send("<h1>Admin space</h1>");
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


