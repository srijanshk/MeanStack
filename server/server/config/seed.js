var User = require('../models/user');

var user1 = {
    username: "adminuser",
    password: "adminuser",
    role: "admin"
}
var user2 = {
    username: "normaluser",
    password: "normaluser",
    role: "user"
}

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