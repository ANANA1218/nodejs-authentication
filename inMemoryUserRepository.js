let registeredUsers = [
    { email: 'user1@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' }
];

const getRegisteredUsers = () => {
    return registeredUsers;
};

module.exports = { getRegisteredUsers };
