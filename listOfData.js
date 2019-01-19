module.exports = function(req,name,s3)
{
    var urls=[];
    var ans=[];
    var xdata;
    return new Promise(function (resolve,reject){
        var f = req.file;
        const params = {
          Bucket: 'uploadabhi',
          MaxKeys: 20,
          Delimiter: '/',
          Prefix: name+'/',
        };
        s3.listObjectsV2 (params, (err, data) => {
          if (err) {
            reject(null);
          }
          xdata = data;
          urls=[];
          for(var w in xdata.Contents)
          {
              urls.push(xdata.Contents[w].Key);
          }
          ans = [];
          for(var x in urls)
          {
              const url = s3.getSignedUrl('getObject', {
                  Bucket: "uploadabhi",
                  Key: urls[x],
                  Expires: 60*60
              });
              let w = {
                  link:url,
                  name:urls[x].split("/")[1]
              }
              ans.push(w);
          }
          for(var x in ans)
          {
              console.log(ans[x]);
          }
          resolve(ans);
        });
    });
}