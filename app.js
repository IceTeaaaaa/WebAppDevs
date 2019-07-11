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
        if(countSubstr(arr[element],str) > 0){
            newArr.push(arr[element]);
        }
    }
    return newArr;
}

function countSubstr(str, substr) {
    let reg = new RegExp(substr, "g");
    return str.match(reg) ? str.match(reg).length : 0;
}

