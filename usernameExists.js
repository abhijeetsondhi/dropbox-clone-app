module.exports = function(req,url,mongoClient){
    var name;
    return new Promise(function (resolve,reject){
        mongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
            if(err)
            {
                flag = 0;
                reject(err);
                console.log("Chutiya katta");
            }
            else
            {
                flag = 1;
                var dbo = db.db("users");
                dbo.collection("details").find({firstName:req.body.firstName}).toArray(function(errs,res){
                    if(errs)
                    {
                        flag = 0;
                        console.log("Chut");
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