module.exports = function(req,url,mongoClient){
    return new Promise(function(response,reject){
        mongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
            if(err)
            {
                reject(err);
                console.log("xxx");
            }
            else
            {
                var dbo = db.db("users");
                dbo.collection("details").insertOne({firstName:req.body.firstName,password:req.body.password},function(errs,res){
                    if(errs)
                    {
                        reject(err);
                    }
                    else
                    {
                        response(true);
                    }
                    db.close();
                });
            }
        });
    });
}