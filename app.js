const express = require('express');
const bodyParser = require('body-parser');
const { firewall, logHeaders } = require('./logHeadersMiddleware');
const uuid = require('uuid'); 
const { getRegisteredUsers } = require('./inMemoryUserRepository');


const app = express();
app.use(bodyParser.json());

let authToken = null; 
const authenticatedUsers = {};
const { v4: uuidv4 } = require('uuid');


/*app.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
    
  
    if (email === 'user@example.com' && password === 'password') {
        authToken = Math.random().toString(36).substr(2); 
        res.json({ token: authToken });
    } else {
        res.status(401).json({ error: 'Email or password incorrect' });
    }
});*/


app.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
    const users = getRegisteredUsers();

    const checkCredentials = (email, password) => {
        return users.some(user => user.email === email && user.password === password);
    };

    if (checkCredentials(email, password)) {
        const token = uuidv4();

        authenticatedUsers[token] = { email };

        res.json({ token });
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
});



app.get('/hello', (req, res) => {
    res.send("<h1>Hello</h1>");
});

/*
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
*/

app.get('/restricted1', (req, res) => {
    const token = req.headers['authorization'];

    if (authenticatedUsers[token]) {
        res.json({ message: "topsecret" });
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
});

app.get('/restricted2', (req, res) => {
    const token = req.headers['authorization'];

    if (authenticatedUsers[token]) {
        res.send("<h1>Admin space</h1>");
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


