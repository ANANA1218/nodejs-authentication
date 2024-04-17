const bcrypt = require('bcrypt');
const db = require('./db'); 

let registeredUsers = [
    { email: 'user1@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' }
];

const getRegisteredUsers = () => {
    return registeredUsers;
};

/*const newUserRegistered = (email, password) => {
    registeredUsers.push({ email, password });
};*/

const newUserRegistered = async (email, userPassword) => { 
    try {

        const passwordHash = await bcrypt.hash(userPassword, 10);
        
    
        await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, passwordHash]);
    } catch (error) {
        console.error("Error registering new user:", error);
        throw error;
    }
};




module.exports = { getRegisteredUsers,newUserRegistered };
