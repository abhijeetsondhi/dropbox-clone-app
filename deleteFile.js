module.exports = function(fileName,s3){
    var params = {
        Bucket:'uploadabhi',
        Key:fileName
    }
    return new Promise(function(resolve,reject){
        s3.deleteObject(params,function(err,res){
            if(res)
            {
                resolve(true);
            }
            else
            {
                reject(false);
            }
        });
    });
}