let redis = require("redis"),
    client = redis.createClient();
let updated_link_dic = new Array();

client.on("error", function (err) {
    console.log("Error " + err);
});

client.multi().keys('*', function (err, replies) {
    let updatedUrlArr = searchUpdated(replies,"updated_hrefs_https:");
    for(let i = 0; i < updatedUrlArr.length; i++){
        let link_title = new Array();
        client.SMEMBERS(updatedUrlArr[i],function (err, reply) {
            for(let j = 0; j < reply.length; j++){
                client.GET('updated_hrefs_title_' + reply[j],function (err, title) {
                    link_title[reply[j]] = title;
                    client.quit();
                })
            }
        });
        updated_link_dic[updatedUrlArr[i]] = link_title;
        console.log(updated_link_dic);
    }
    }).exec(function (err, replies) {
});

//
// client.SMEMBERS("updated_hrefs_https://www.wired.com/",function (err, reply) {
//     news_array = reply;
//     console.log(reply);
//     client.quit();
// });

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

