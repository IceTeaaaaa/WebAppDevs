const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


// Constants (magic number) definition
const numOfRightUrls = 8;
const numOfLeftUrls = 12;

// Variables definitions
let urls = "";
let urls_array = new Array();

let righturls = "";
let righturls_array = new Array();

let dic_url_suburl = new Array();
let dic_suburl_title = new Array();
let dic_url_title = new Array();
//let title_array = new Array();



// Display the main page ('/')
async function onViewIndex(req, res) {
    let cluster = req.cluster;
    req.session.user = "niubi";
    let cookie = await cluster.get('sess:' + req.cookies.guestid);
    // await cluster.set('foo', 'bar')
    console.log(cookie)
    // console.log(req.session);
    // console.log(req.session.user);
    // in server, we call setCollection, which defines req.collection = collection (which is our mongodb database)
    const a = await req.collection.find().toArray();

    // populate urls(cards view), and righturls(websites on the right to be added to the left)
    // from mongodb, (specific for each user in the future).
    for await(let b of a){
        urls = `${b.url_array}`;
        righturls =`${b.right_side_url}`
    }
    if(urls !== ""){
        urls_array = urls.split(",");
    }else{
        urls_array = [];
    }
    if(urls !== ""){
        righturls_array = righturls.split(",");
    }else{
        urls_array = [];
    }

    if(urls_array){
        for(let i = 0; i < urls_array.length; i++){
            let subs = await cluster.smembers('updated_hrefs_' + urls_array[i]);
            let sub_url_array = subs.slice(0, numOfLeftUrls);
            for(let j = 0; j < sub_url_array.length; j++){
                let title = await cluster.get('updated_hrefs_title_' + sub_url_array[j]);
                if(title === null){
                    dic_suburl_title[sub_url_array[j]] = sub_url_array[j];
                }else{
                    dic_suburl_title[sub_url_array[j]] = title;
                }
            }
            dic_url_suburl[urls_array[i]] = sub_url_array;

            subs = await cluster.smembers('last_all_hrefs_' + urls_array[i]);
            sub_url_array = subs.slice(0, numOfLeftUrls);
            for(let j = 0; j < sub_url_array.length; j++){
                let title = await cluster.get('updated_hrefs_title_' + sub_url_array[j]);
                if(title === null){
                    dic_suburl_title[sub_url_array[j]] = sub_url_array[j];
                }else{
                    dic_suburl_title[sub_url_array[j]] = title;
                }
            }
            dic_url_suburl[urls_array[i]] = sub_url_array;
        }

    }

    if(righturls_array){
        for(let i = 0; i < righturls_array.length; i++){
            let right_title = await cluster.get('updated_hrefs_title_' + righturls_array[i]);
                dic_url_title[righturls_array[i]] = right_title;
        }
    }



    // populate webpages json array, where each element is a JSON containing info to be passed to handlebar template
    var webpages = [];
    if(urls_array !== undefined && urls_array !== null && urls_array.length !== 0) {
        webpages = [];
        try{
            for await(url of urls_array) {
                let mainSite = url;
                let websiteName = webName(url);
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
                        if(counter >= numOfLeftUrls) {
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

    let sideWebpages = [];
    if(righturls_array !== undefined && righturls_array !== null && righturls_array.length !== 0 && righturls.length!==0) {
        sideWebpages = [];
        try{
            let counter = 0;
            for await(righturl of righturls_array) {
                let mainSite = righturl;
                let websiteName_right = webName(righturl);
                let side_title = dic_url_title[righturl];

                let entry = {
                    "mainSite": mainSite,
                    "siteName": websiteName_right,
                    "title": side_title
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

    // console.log(sideWebpages);
    const placeholders = {
        cards: webpages,
        lists: sideWebpages,
    };
    res.cookie('guestid', req.session.id, { maxAge: 1000 * 100000000, singed: true});
    // console.log(req.session.cookie)
    res.render('index', placeholders);
}
router.get('/', onViewIndex);

//https://rickmanelius.com/   -> com/
function webName(siteName){
    let result = siteName.substring(0,siteName.length-5);
    //http
    if(result.substring(0,8) === "https://"){
        result = siteName.substring(8, result.length);
    }else if(result.substring(0,7) === "http://"){
        result = siteName.substring(7, result.length);
    }else{
        result = result;
    }
    if(result.substring(0,3) === "www"){
        result = result.substring(4, result.length);
    }else if(result.substring(0,4) === "blog"){
        result = result.substring(5, result.length);
    }else{
        result = result;
    }
    return result;
}

module.exports = router;
