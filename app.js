var redis = require("redis"),
    client = redis.createClient();
let news_array = new Array();


client.on("error", function (err) {
    console.log("Error " + err);
});

client.multi().keys('*', function (err, replies) {
        var updatedUrlArr = searchUpdated(replies,"updated_hrefs_");
        console.log(updatedUrlArr);
    }).exec(function (err, replies) {});


client.SMEMBERS("updated_hrefs_https://www.wired.com/",function (err, reply) {
    news_array = reply;
    client.quit();
});

function searchUpdated(Arr,str){
    var newArr = [];
    for(var k in Arr){
        if(Arr[k].indexOf(str) != -1){
            newArr.push(Arr[k]);
        }
    }
    return newArr;
}
