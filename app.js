const express = require('express');
const bodyParser = require('body-parser');
const { firewall, logHeaders } = require('./logHeadersMiddleware');
const uuid = require('uuid'); 
const { getRegisteredUsers,newUserRegistered  } = require('./inMemoryUserRepository');
const bcrypt = require('bcrypt');
const db = require('./db');

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


/*app.post('/register', (req, res) => {
    const { email, password } = req.body;

    
    const userExists = getRegisteredUsers().some(user => user.email === email);

    if (userExists) {
        res.status(400).json({ error: 'User already exists' });
    } else {
  
        newUserRegistered(email, password);
        res.status(200).json({ message: 'User registered successfully' });
    }
});
*/


app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
     
        const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const existingUser = result[0]; 

        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
        } else {
       
            await newUserRegistered(email, password);
            res.status(200).json({ message: 'User registered successfully' });
        }
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





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


