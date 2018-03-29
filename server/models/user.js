const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User',{
    firstName : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        minlength : 1,
        trim: true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        validate : {
            validator : validator.isEmail,
            message : '{VALUE} is not a valid email'
        }
    },
    img: { 
        data: Buffer, 
        contentType: String
    },
    project : {
        type : String,
        trim : true,
        minlength : 1,
        required : true
    }
});

module.exports = {
    User
}
