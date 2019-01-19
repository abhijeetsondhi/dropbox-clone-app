module.exports = function(req,url,mongoClient){
    var name;
    return new Promise(function (resolve,reject){
        mongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
            if(err)
            {
                flag = 0;
                reject(err);
                console.log("Error");
            }
            else
            {
                flag = 1;
                var dbo = db.db("users");
                dbo.collection("details").find({$and:[{firstName:req.body.firstName},{password:req.body.password}]}).toArray(function(errs,res){
                    if(errs)
                    {
                        flag = 0;
                        console.log("Ch");
                        reject(errs);
                        db.close();
                    }
                    else
                    {
                        if(res.length >= 1)
                        {
                         flag = 1;
                         name = res[0].firstName;
                         console.log(name);
                         resolve(name);
                         console.log(name+"--");
                         db.close();
                        }
                        else{
                            flag = 0;
                            resolve(null);
                            console.log(name+"--");
                            db.close();
                        }
                    }
                });
            }
        });
    }); 
}