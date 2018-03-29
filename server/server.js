const express = require('express');
const bodyParser = require('body-parser');
const validator = require('validator');
const _ = require('lodash');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const mongoxlsx = require("mongo-xlsx");    
// const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/config-mongoose');
const {User} = require('./models/user');
const {Project} = require('./models/project');

var app = express();

//setup view engine
hbs.registerPartials('../views/partials');
app.set('view engine','hbs');
app.set('views', '../views');
app.engine('html', require('hbs').__express);

//set static folder
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//User requests
app.get('/',(req,res)=>{
     res.render('home.hbs');
});

app.post('/users',(req , res) =>{
    var user = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        img : {
         data : fs.readFileSync('../images/image.png'),
         contentType : 'image/png'
        },
        project : req.body.project
    });
    user.save().then((user)=>{
        res.send(user);
    }).catch((e) =>{
        res.status(400).send('An error has occured');
    });
});

app.get('/users',(req, res) => {
    User.find().then((users) =>{
        res.send({users});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.get('/users/:email', (req,res) =>{
    var email = req.params.email;
    if(!validator.isEmail(email)){
        return res.status(400).send('This email is not valid');
    }
    User.findOne({email}).then((user)=>{
        if(!user){
            return res.status(404).send('User Not found');
        }
        res.contentType(user.img.contentType);
        res.send(user.img.data);
        // res.send(user);
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.delete('/users/:email',(req ,res)=>{
    var email = req.params.email;
    if(!validator.isEmail(email)){
        return res.status(400).send('This email is not valid');
    }
    User.findOneAndRemove({email}).then((user)=>{
        if(!user){
            return res.status(404).send('User Not found');
        }
        res.send(user);
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.patch('/users/:email',(req, res)=>{
    var email = req.params.email;
    if(!validator.isEmail(email)){
        return res.status(400).send('This email is not valid');
    }
    var body = _.pick(req.body,['firstName','lastName','project']);
    User.findOneAndUpdate({email},{$set : body},{new : true}).then((user)=>{
        if(!user){
            return res.status(404).send('User Not found');
        }
        res.send(user);
    }).catch((e)=>{
        res.status(400).send();
    });
});

//Project requests
// app.post('/projects',(req , res) =>{
//     mongoxlsx.xlsx2MongoData('../playground/excel-files/test.xlsx', null, function(err, data) {
  
//         var project = new Project({
//             name : req.body.name,
//             country : req.body.country,
//             entityManager : req.body.entityManager,
//             xlsx : data
//         });
 
//         project.save().then((project)=>{
//             res.send(project);
//         }).catch((e) =>{
//             res.status(400).send('An error has occured');
//         });
//       });
   
// });
app.post('/projects',(req , res) =>{
        var project = new Project({
            name : req.body.name,
            country : req.body.country,
            entityManager : req.body.entityManager,
            xlsx : {
                data : fs.readFileSync('../playground/excel-files/test.xlsx'),
                contentType : 'application/vnd.ms-excel'
               }
        });
 
        project.save().then((project)=>{
            res.send(project);
        }).catch((e) =>{
            res.status(400).send('An error has occured');
        });
});

app.get('/projects',(req, res) => {
    Project.find().then((projects) =>{
        // res.send();
        res.send({projects});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.get('/projects/:name', (req,res) =>{
    var name = req.params.name;
   
    Project.findOne({name}).then((project)=>{
        if(!project){
            return res.status(404).send('Project Not found');
        }
        
        res.contentType(project.xlsx.contentType);
        fs.writeFileSync('testout.xlsx',project.xlsx.data);
        res.send(project.xlsx.data);
        // res.send(project);
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.delete('/projects/:name',(req ,res)=>{
    var name = req.params.name;
    
    Project.findOneAndRemove({name}).then((project)=>{
        if(!project){
            return res.status(404).send('Project Not found');
        }
        res.send(project);
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.patch('/projects/:name',(req, res)=>{
    var name = req.params.name;
    
    var body = _.pick(req.body,['name','country','entityManager']);
    Project.findOneAndUpdate({name},{$set : body},{new : true}).then((project)=>{
        if(!project){
            return res.status(404).send('Project Not found');
        }
        res.send(project);
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.get('/downloadProjects',(req,res)=>{
    Project.find().then((projects) =>{
        /* Generate automatic model for processing (A static model should be used) */
    var model = mongoxlsx.buildDynamicModel(projects);
        /* Generate Excel */
    mongoxlsx.mongoData2Xlsx(projects, model, function(err, data) {
    res.send(`File saved at: ${data.fullPath}`); 
  });
    }).catch((e) => {
        res.status(400).send();
    });

});

app.get('/downloadUsers',(req,res)=>{
    User.find().then((users) =>{
        /* Generate automatic model for processing (A static model should be used) */
    var model = mongoxlsx.buildDynamicModel(users);
        /* Generate Excel */
    mongoxlsx.mongoData2Xlsx(users, model, function(err, data) {
    res.send(`File saved at: ${data.fullPath}`); 
  });
    }).catch((e) => {
        res.status(400).send();
    });

});


app.listen(3000,()=>{
    console.log('server is up on 3000');
});

