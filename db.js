const mysql = require('mysql');

const dbConfig = {
    connectionLimit: 10,
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'node' 
};


const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
    console.log('Connected to database');
});


module.exports = connection;