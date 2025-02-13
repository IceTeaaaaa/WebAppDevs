var redis = require("redis"),
    client = redis.createClient();
//let updated_url_dic = new Array();

client.on("error", function (err) {
    console.log("Error " + err);
});

client.multi().keys('*', function (err, replies) {
    let updatedUrlArr = searchUpdated(replies,"updated_hrefs_https:");
    console.log(updatedUrlArr);
    // let url_title = new Array();
    // for(let i = 0; i < updatedUrlArr.length; i++){
    //         client.SMEMBERS(updatedUrlArr[i],function (err, reply) {
    //             for(let j = 0; j < reply.length; j++){
    //                 client.GET('updated_hrefs_title_' + reply[j],function (err, title) {
    //                     client.quit();
    //                 })
    //             }
    //
    //         });
    //         // updated_url_dic[updatedUrlArr[i]] = url_title;
    //         // console.log(updated_url_dic);
    // }
}).exec(function (err, replies) {
});

// async function get_dic(updatedUrlArr) {
//     let url_title = new Array();
//     for(let i = 0; i < updatedUrlArr.length; i++){
//         client.SMEMBERS(updatedUrlArr[i],function (err, reply) {
//             for(let j = 0; j < reply.length; j++){
//                 client.GET('updated_hrefs_title_' + reply[j],function (err, title) {
//                     url_title[reply[j]] = title;
//                     client.quit();
//                 })
//             }
//         });
//     }
//     return url_title;
// }

// add comment
function searchUpdated(arr,str){
    let len = 0;
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
