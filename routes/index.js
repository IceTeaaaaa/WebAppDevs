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
let website_array = new Array();

client.on("error", function (err) {
    console.log("Error " + err);
});



async function onViewIndex(req, res) {

    const a = await req.collection.find().toArray();
    for await(let b of a){
        urls = `${b.url_array}`;
    }
    if(urls !== ""){
        urls_array = urls.split(",");
    }else{
        urls_array = [];
    }

    if(urls_array){
        for(let i = 0; i < urls_array.length; i++){
            let sub_url_array = new Array();
            await client.SMEMBERS('updated_hrefs_' + urls_array[i],async function (err, reply) {
                if(reply && reply.length !== 0){
                    for(let j = 0; j < reply.length; j++){
                        sub_url_array[j] = reply[j];
                        await client.GET('updated_hrefs_title_' + reply[j], async function (err, title) {

                            if(title === null){
                                dic_suburl_title[sub_url_array[j]] = sub_url_array[j];
                            }else{
                                dic_suburl_title[sub_url_array[j]] = title;
                            }

                        })

                    }
                    dic_url_suburl[urls_array[i]] = sub_url_array;
                }
                await client.SMEMBERS('last_all_hrefs_' + urls_array[i],async function (err, reply2) {
                    if(reply2){
                        for(let j = 0; j < reply2.length; j++){
                            sub_url_array[j] = reply2[j];
                            await client.GET('updated_hrefs_title_' + reply2[j], async function (err, title) {

                                if(title == null){
                                    dic_suburl_title[sub_url_array[j]] = sub_url_array[j];
                                }else{
                                    dic_suburl_title[sub_url_array[j]] = title;
                                }

                            })
                        }
                        dic_url_suburl[urls_array[i]] = sub_url_array;
                    }
                })

            })
        }

    }

    var webpages = [];
    if(urls_array !== undefined && urls_array !== null && urls_array.length !== 0) {
        webpages = [];
        try{
            for await(url of urls_array) {
                let mainSite = url;
                let siteName = url;  // TODO: SPLIT STRING!
                let websiteName = webName(siteName);
                let subSites = [];
                let counter = 0;
                if(dic_url_suburl[url]){
                    for await (subsiteUrl of dic_url_suburl[url]) {
                        // console.log(subsiteUrl);
                        let one = {
                            "title": dic_suburl_title[subsiteUrl],
                            "url": subsiteUrl
                        };
                        subSites.push(one);
                        counter++;
                        if(counter >= 12) {
                            break;
                        }
                    }
                }
                let entry = {
                    "mainSite": mainSite,
                    "siteName": websiteName,
                    "subSites": subSites
                };
                //console.log(entry);
                webpages.push(entry);
            }
        }catch (e){
            console.error("delay");
        }
    }

    const placeholders = {
        cards: webpages,
    };
    res.render('index', placeholders);

}
router.get('/', onViewIndex);


function webName(siteName){
    let result = siteName.substring(0,siteName.length-5);
    //console.log(result);
    //http
    if(result.substring(0,8) === "https://"){
        result = siteName.substring(8, result.length);
    }else if(result.substring(0,7) === "http://"){
        result = siteName.substring(7, result.length);
    }
    if(result.substring(0,3) === "www"){
        result = result.substring(4, result.length);
    }else if(result.substring(0,4) === "blog"){
        result = result.substring(5, result.length);
    }
    //console.log(result);
    return result;
}

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
