const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var redis = require("redis"),
    client = redis.createClient();

var webpages = [];

let urls = "";
let urls_array = new Array();

let dic_url_suburl = new Array();
let dic_suburl_title = new Array();
let title_array = new Array();

client.on("error", function (err) {
    // console.log("Error " + err);
});

function find_title(results){
    let result_arr = new Array();
    let flag = 0; //if new title
    let old_title = "", current_title = "";

    for(result of results){
        current_title = `${result.url}`;
        if(current_title === "" || current_title !== old_title){
            flag = 1;
        }
        if(flag === 1){
            // let sub_array = new Array(){
            //
            // }
        }
    }
}

async function onViewIndex(req, res) {


    // let urls = req.collection.find({}, {_id: 0, url:1, sub_url: 1});
    // let urls = req.collection.


    // const query = {url_array: 'url_array'};
    // const u_arr = await req.collection.findOne(query);
    // console.log("11111111"+u_arr);

    const a = await req.collection.find().toArray();
    for(let b of a){
        urls = `${b.url_array}`;
    }
    urls_array = urls.split(",");
    // console.log("urls array: " + urls_array);
    let abc = "";
    if(urls_array){
        // console.log("urls array length: " + urls_array.length);
        for(let i = 0; i < urls_array.length; i++){
            let sub_url_array = new Array();
            client.SMEMBERS('updated_hrefs_' + urls_array[i],async function (err, reply) {
               if(reply){
                   // console.log("reply: " + reply);
                   // console.log("reply number: " + reply.length);

                   for(let j = 0; j < reply.length; j++){
                       sub_url_array[j] = reply[j];
                       await client.GET('updated_hrefs_title_' + reply[j], async function (err, title) {

                           if(title == null){
                               // console.log("title: title shi kong de" + title);
                               dic_suburl_title[sub_url_array[j]] = sub_url_array[j];
                           }else{
                               // console.log("title: " + title);
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
                   // console.log("sub_url_array: " + sub_url_array);
                   // console.log("sub_url_array length: " + sub_url_array.length);
               }
            })
        }
        // console.log("urls_array[0]: " + urls_array[0]);
        // console.log("dic_url_suburl[urls_array[0]]: " + dic_url_suburl[urls_array[0]]);
        // console.log("urls_array[1]: " + urls_array[1]);
        // console.log("dic_url_suburl[urls_array[1]]: " + dic_url_suburl[urls_array[1]]);
        // console.log("urls_array[2]: " + urls_array[2]);
        // console.log("dic_url_suburl[urls_array[2]]: " + dic_url_suburl[urls_array[2]]);

        webpages = [];
        for await(url of urls_array) {
            console.log(url);
            let mainSite = url;
            let siteName = url;  // TODO: SPLIT STRING!
            let subSites = [];
            for(subsiteUrl in dic_url_suburl[url]) {
                let one = {
                    "title": dic_suburl_title[subsiteUrl],
                    "url": subsiteUrl
                };
                subSites.push(one);
            }

            let entry = {
                "mainSite": mainSite,
                "siteName": siteName,
                "subSites": subSites
            };
            webpages.push(entry);
        }

    }


    // console.log("sfgsdfgsdgfsdgsdgdfsgfg");
    // console.log(urls_array[0]);
    // console.log('adsf');
    const placeholders = {
        url_0: urls_array,
        // title_0: dic_url_suburl[urls_array[0]],
        // url_1: urls_array[1],
        // title_1: dic_url_suburl[urls_array[1]],
        // // url_2: urls_array[2],
        // title_2: dic_url_suburl[urls_array[2]],
        // // url_3: urls_array[3],
        // title_3: dic_url_suburl[urls_array[3]],
        // // url_4: urls_array[4],
        // title_4: dic_url_suburl[urls_array[4]],
        // // url_5: urls_array[5],
        // title_5: dic_url_suburl[urls_array[5]],
        numberOfCards: [0,1],

        newTest: webpages,

        test: [
            {
                mainSite: "https://www.bbc.com",
                siteName: "bbc",
                subSites: [
                    {
                        title: "Congresswomen hit back after Trump's tweets branded racist",
                        url: "https://www.bbc.com/news/world-us-canada-48998696"
                    },
                    {
                        title: "Times when Americans were told to 'go home' or 'go back'",
                        url: "https://www.bbc.com/news/world-us-canada-48993211"
                    },
                ]
            },
            {
                mainSite: "https://www.cnn.com",
                siteName: "cnn",
                subSites: [
                    {
                        title: "Congresswomen hit back after Trump's tweets branded racist",
                        url: "https://www.cnn.com/2019/07/15/politics/gop-rebuke-trump-tweet/index.html"
                    },
                    {
                        title: "Feds warn UFO enthusiasts against storming Area 51: The military 'stands ready'",
                        url: "https://www.bbc.com/news/world-us-canada-48993211"
                    },
                ]
            }
        ],

        // title_0: urls_array[0],
        // news_0_0: url_array[urls_array[0]][0],
        // news_0_1: url_array[urls_array[0]][1]
    };
    console.log(webpages[0]);
    await res.render('index', placeholders);
}
router.get('/', onViewIndex);

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
