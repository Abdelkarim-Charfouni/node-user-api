const mongoose = require('mongoose');
// const validator = require('validator');

var Project = mongoose.model('Project',{
    name : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    country : {
        type : String,
        required : true,
        minlength : 1,
        trim: true
    },
    entityManager : {
        type : String,
        required : true,
        trim : true,
    },
    // xlsx : { 
    //     type : Object  
    // }
    xlsx : {
        data: Buffer, 
        contentType: String
    }
});

module.exports = {
    Project
}