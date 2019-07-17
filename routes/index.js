const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var redis = require("redis"),
    client = redis.createClient();

let urls = "";
let urls_array = new Array();

let dic_url_suburl = new Array();
let dic_suburl_title = new Array();
let title_array = new Array();

client.on("error", function (err) {
    console.log("Error " + err);
});



async function onViewIndex(req, res) {

    const a = await req.collection.find().toArray();
    for await(let b of a){
        urls = `${b.url_array}`;
    }
    urls_array = urls.split(",");
    if(urls_array){
        for(let i = 0; i < urls_array.length; i++){
            let sub_url_array = new Array();
            await client.SMEMBERS('updated_hrefs_' + urls_array[i],async function (err, reply) {
               if(reply){


                   for(let j = 0; j < reply.length; j++){
                       sub_url_array[j] = reply[j];
                       await client.GET('updated_hrefs_title_' + reply[j], async function (err, title) {

                           if(title == null){
                               dic_suburl_title[sub_url_array[j]] = sub_url_array[j];
                           }else{
                               dic_suburl_title[sub_url_array[j]] = title;
                           }

                           // // req.collection.insert({"url": news});
                           // // console.log(123);
                           //  if(title == null){
                           //  // db.webapp.findOne({"type":"title"}).url_array[0]
                           //      req.collection.insert({"index": i, "url": urls[i], "sub_url": reply[j], "title": reply[j]});
                           //
                           //  }else{
                           //      req.collection.insert({"index": i, "url": urls[i], "sub_url": reply[j], "title": title});
                           //  }
                            client.quit();
                       })

                   }
                   dic_url_suburl[urls_array[i]] = sub_url_array;

               }
            })
        }

    }

    var webpages = [];
    if(urls_array !== undefined && urls_array !== null && urls_array.length !== 0) {
        webpages = [];
        for await(url of urls_array) {
            // console.log(url);
            let mainSite = url;
            let siteName = url;  // TODO: SPLIT STRING!
            let subSites = [];
            let counter = 0;
            for await (subsiteUrl of dic_url_suburl[url]) {
                // console.log(subsiteUrl);
                let one = {
                    "title": dic_suburl_title[subsiteUrl],
                    "url": subsiteUrl
                };
                subSites.push(one);
                counter++;
                if(counter >= 10) {
                    break;
                }
            }

            let entry = {
                "mainSite": mainSite,
                "siteName": siteName,
                "subSites": subSites
            };
            webpages.push(entry);
        }
    }


    const placeholders = {
        cards: webpages,
    };
    res.render('index', placeholders);

}

router.get('/', onViewIndex);
// setInterval(function() {
//     // console.log("  /  refresh.");
//     // console.log("urls_array: " + urls_array);
//     // router.get('/', onViewIndex);
// }, 5000)

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


module.exports = router;
