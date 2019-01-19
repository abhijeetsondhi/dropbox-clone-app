var mongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var AWS = require('aws-sdk');
const nunjucks = require('nunjucks');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
AWS.config.update({"region": "us-west-1",
                   "endpoint":"http://dynamodb.us-west-1.amazonaws.com",
                "accessKeyId":"xxx","secretAccessKey":"yyy" });

ddb = new AWS.DynamoDB.DocumentClient();
var url = "mongodb://localhost:27017/";
var data;
var x=2;

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.listen("4495","127.0.2.1",function(){
console.log("127.0.2.1" + ":" + "4495");
});

app.get('/',function (req,res)
{
    res.render('home.html',data);
});

app.post('/addname',function(req,resp){
x++;
/*
mongoClient.connect(url,{useNewUrlParser:true},function(err,res){

    if(err)
    {
        throw err;
    }
    else
    {
        var dbo = res.db('users');
        dbo.collection('details').insertOne(req.body,function(err,w){
            if(err)
            {
                throw err;
            }
            else{
                console.log("Daal diya");
            }
        });
    }

});
*/
var params = {
    TableName: "users",
    Item: {
      "id" : parseInt(x),
      "firstName" : req.body.firstName,
      "lastName": req.body.lastName
    }
  };
  ddb.put(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
});

/*
mongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
    if(err)
    {
        console.log("Chutiya katta");
    }
    else{
        console.log("Ban gaya");
        var dbo = db.db("restaurant");
        dbo.collection("restaurants").find({cuisine:"Bakery"}).toArray(function(err,res){
            if(err)
            {
                throw err;
            }
            else{
                data = res;
                console.log(data);
            }
        });
    }
});
*/