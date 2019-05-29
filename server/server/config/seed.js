var User = require('../models/user');
const bcrypt = require('bcryptjs');

const password = 'password';

const seed = async () => {

    let hashedPassword = await bcrypt.hash("1234567890", 8);
    var user1 = {
        username: "adminuser",
        password: hashedPassword,
        role: "admin"
    }
    var user2 = {
        username: "normaluser",
        password: hashedPassword,
        role: "user"
    }

    User.remove({username: "adminuser"},function(e){
        if (e) {
            throw e;
        }
    })
    
    User.remove({username: "normaluser"},function(e){
        if (e) {
            throw e;
        }
    })
    
    User.create(user1, function(e){
        if (e) {
            throw e;
        }
    });
    User.create(user2, function(e){
        if (e) {
            throw e;
        }
    });
}


module.exports = {
    seed : seed
}