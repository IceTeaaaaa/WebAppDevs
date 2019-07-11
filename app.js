let redis = require("redis"),
    client = redis.createClient();
let news_array = new Array();


client.on("error", function (err) {
    console.log("Error " + err);
});

client.multi().keys('*', function (err, replies) {
        let updatedUrlArr = searchUpdated(replies,"updated_hrefs_");
        console.log(updatedUrlArr);
    }).exec(function (err, replies) {});


client.SMEMBERS("updated_hrefs_https://www.wired.com/",function (err, reply) {
    news_array = reply;
    client.quit();
});

function searchUpdated(arr,str){
    let newArr = [];
    for(let element in arr){
        if(arr[element].indexOf(str) !== -1){
            newArr.push(arr[element]);
        }
    }
    return newArr;
}
