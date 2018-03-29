//requiring npm mongoose library
var mongoose = require('mongoose');

//enable mongoose and promises
mongoose.Promise = global.Promise;
//Mongoose : Connecting to the database TodoApp
mongoose.connect('mongodb://localhost:27017/UsersApp');

module.exports = {
    mongoose
}