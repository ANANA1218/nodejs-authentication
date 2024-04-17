const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const logHeaders = (req, res, next) => {
    console.log("Request Headers:", req.headers);
    next();
};

app.use(logHeaders); 


const firewall = (req, res, next) => {
    const unprotectedUrls = ['/authenticate']; 

    if (unprotectedUrls.includes(req.path)) {
        
        next();
    } else {
        const token = req.headers['authorization'];
        if (token === authToken) {
        
            next();
        } else {
         
            res.status(403).json({ error: 'Forbidden' });
        }
    }
};

app.use(firewall); 


module.exports = {
    logHeaders,
    firewall,
};
