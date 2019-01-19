var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var AWS = require('aws-sdk');
var multer = require('multer');
var express = require('express');
var app = express();
const session = require('client-sessions');
const nunjucks = require('nunjucks');
var multers3 = require('multer-s3');
const bodyParser = require("body-parser");
const myLogin = require('./database.js');
const usernameExists = require('./usernameExists.js');
const listData = require('./listOfData.js');
const addUser = require('./addUser.js'); 
const deleteFile = require('./deleteFile.js');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    cookieName:'sess',
    secret:'sdk;msf;b',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));
var s3 = new AWS.S3({
    "accessKeyId":"Axxxx","secretAccessKey":"yyyyyk","region": "us-west-1"
});
var url = "mongodb://localhost:27017/";
var urls =[];
var name; 
var ans = [];
var xdata = [];
let flag = 0;
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

var uploadFile = multer({
    storage: multers3({
        s3: s3,
        bucket: 'uploadabhi',
        metadata: function(request, file, ab_callback) {
            ab_callback(null, {fieldname: file.fieldname});
        },
        key: function(req,file,cb){
            var fileTemp = req.sess.user+'/'+file.originalname;
            cb(null,fileTemp);
        },
    })
});

app.listen("4495","127.0.2.1",function(){
    console.log("127.0.2.1" + ":" + "4495");
    });


app.get('/',function (req,res)
{
    if(req.sess.user)
    {
        res.redirect('/user');
    }
    else
    {
        res.render('homepage.html');
    }
});

app.get('/user',loginRequired,function(req,resp){
            resp.render('index2.html',{user:req.sess.user});
});

app.post('/user',function(req,resp){
        myLogin(req,url,mongoClient).then(function(f){
            console.log(f);
            if(f !== null)
            {
                name=f;
                req.sess.user = f;
                resp.render('index2.html',{user:req.sess.user});
            }
        else{
                req.sess.reset();
                resp.render('error.html');
            }
        });
});

app.get('/register',function(req,res){
    res.render('register.html');
});

app.post('/registerUser',function(req,res){
usernameExists(req,url,mongoClient).then(function(f){
    if(f !== null)
    {
        res.render('register.html',{flag:2});
    }
    else
    {
        addUser(req,url,mongoClient).then(function(c){
            if(c === true)
            {
                res.redirect('/');
            }
            else
            {
                console.log("Kuch toh gadbad hai");
                res.render('register.html');
            }

        });
    }
});

});

app.post('/upload',loginRequired,uploadFile.single('upload'),function(req,res)
{
    res.render('fileName.html',{user:req.sess.user});
});

app.get('/files',loginRequired,function(req,res)
{
    listData(req,req.sess.user,s3).then(function(ret){
        if(ret != null)
        {
            res.render('file.html',{ans:ret,user:req.sess.user});
        }
    });
});

app.get('/logout',function(req,res){
    req.sess.reset();
    res.redirect('/');
});

app.post('/delete/:name',function(req,res){
    var fileDir = req.sess.user+"/"+req.params.name;
    console.log(fileDir);
    deleteFile(fileDir,s3).then(function(result){
        if(result)
        {
            res.redirect('/files');
        }
        else
        {
            console.log("Error!!!!");
        }

    });

});

function loginRequired(req,res,next){
    if(!req.sess.user)
    {
        req.sess.reset();
        res.render('error.html');
    }
    else
    {
        next();
    }
}