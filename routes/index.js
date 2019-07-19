const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var redis = require("redis"),
    client = redis.createClient();

// Constants (magic number) definition
const numOfRightUrls = 8;

// Variables definitions
let urls = "";
let urls_array = new Array();

let righturls = "";
let righturls_array = new Array();

let dic_url_suburl = new Array();
let dic_suburl_title = new Array();
let title_array = new Array();

client.on("error", function (err) {
    console.log("Error " + err);
});


// Display the main page ('/')
async function onViewIndex(req, res) {
    // in server, we call setCollection, which defines req.collection = collection (which is our mongodb database)
    const a = await req.collection.find().toArray();

    // populate urls(cards view), and righturls(websites on the right to be added to the left)
    // from mongodb, (specific for each user in the future).
    for await(let b of a){
        urls = `${b.url_array}`;
        righturls =`${b.right_side_url}`
    }
    // console.log(urls.length);
    urls_array = urls.split(",");
    righturls_array = righturls.split(",");


    // Get suburls (articles, mainly sub-urls, titles, and so on) for urls (card view) to be displayed
    // from redis database this time. (client is redis db)
    // put them in corresponding dictionary.
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

    // populate webpages json array, where each element is a JSON containing info to be passed to handlebar template
    let webpages = [];
    // console.log(urls_array.length);
    // console.log("------------");
    if(urls_array !== undefined && urls_array !== null && urls_array.length !== 0 && urls.length!==0) {
        webpages = [];
        try{
            for await(url of urls_array) {
                let mainSite = url;
                let siteName = url.split('.')[1];  // TODO: SPLIT STRING!
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
                        if(counter >= 10) {
                            break;
                        }
                    }
                }
                let entry = {
                    "mainSite": mainSite,
                    "siteName": siteName,
                    "subSites": subSites,
                };
                //console.log(entry);
                webpages.push(entry);
            }
        }catch (e){
            console.error("delay");
        }
    }

    let sideWebpages = [];
    if(righturls_array !== undefined && righturls_array !== null && righturls_array.length !== 0 && righturls.length!==0) {
        sideWebpages = [];
        try{
            let counter = 0;
            for await(righturl of righturls_array) {
                let mainSite = righturl;
                let siteName = righturl.split('.')[1];  // TODO: SPLIT STRING!

                let entry = {
                    "mainSite": mainSite,
                    "siteName": siteName,
                };
                //console.log(entry);
                if(counter >= numOfRightUrls) break;
                sideWebpages.push(entry);
                counter++;
            }
        }catch (e){
            console.error("delay");
        }
    }

    const placeholders = {
        cards: webpages,
        lists: sideWebpages,
    };
    // console.log(webpages);
    res.render('index', placeholders);

}
router.get('/', onViewIndex);


// function searchUpdated(arr,str){
//     let newArr = [];
//     for(let element in arr){
//         if(countSubstr(arr[element],str) > 0){
//             newArr.push(arr[element]);
//         }
//     }
//     return newArr;
// }
//
// function countSubstr(str, substr) {
//     let reg = new RegExp(substr, "g");
//     return str.match(reg) ? str.match(reg).length : 0;
// }

module.exports = router;
