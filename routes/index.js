const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var Redis = require("ioredis");
var redis = new Redis();  // Change here if to you want to connect to non-default redis server address.
// var redis = require("redis"),
//     client = redis.createClient();

// Constants (magic number) definition
const numOfRightUrls = 8;
const numOfLeftUrls = 12;

// Variables definitions
//let urls = "";
let urls_array = [];

//let righturls = "";
let righturls_array = [];

let dic_url_suburl = [];
let dic_suburl_title = [];
let dic_url_title = [];
//let title_array = new Array();
let usrname = "default";
let paswrd = "default";

let default_url = [];
let default_url_right = [];

async function getDefault(req, res){
    await req.collection.findOne({'username': 'default'}, function(err, doc){
        default_url = doc.url_array;
        default_url_right = doc.right_side_url;
    });
}

async function getID_Login(req, res) {
    usrname = req.body.username;
    paswrd = req.body.password;
    var query = { username: usrname };
    req.collection.find(query).toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
    });
}
router.post('/login/ID/', jsonParser, getID_Login);

async function logout(req, res) {
    getDefault(req, res);
    console.log("logout pressed");
    usrname = 'default';
    paswrd = 'default';
}
router.get('/logout/ID/', jsonParser, logout);

async function getID_Register(req, res) {
    getDefault(req, res);
    usrname = req.body.username;
    paswrd = req.body.password;
    var query = { username: usrname };
    req.collection.find(query).toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
    });
    await req.collection.findOne({'username':usrname}, async function(err, doc){
        if(doc){
            console.error("The Username has been used!")
        }else if(!doc){
            req.collection.insert({'username':usrname, 'password': paswrd, 'url_array': default_url, 'right_side_url': default_url_right});
        }
    });
}
router.post('/register/ID/', jsonParser, getID_Register);


// Display the main page ('/')
async function onViewIndex(req, res) {
    // in server, we call setCollection, which defines req.collection = collection (which is our mongodb database)
    //let a = null;
    let a = await req.collection.findOne({'username':usrname, 'password': paswrd});
    let urls = `${a.url_array}`;
    let righturls =`${a.right_side_url}`;

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
            let subs = await redis.smembers('updated_hrefs_' + urls_array[i]);
            let sub_url_array = subs.slice(0, numOfLeftUrls);
            for(let j = 0; j < sub_url_array.length; j++){
                let title = await redis.get('updated_hrefs_title_' + sub_url_array[j]);
                if(title === null){
                    dic_suburl_title[sub_url_array[j]] = sub_url_array[j];
                }else{
                    dic_suburl_title[sub_url_array[j]] = title;
                }
            }
            dic_url_suburl[urls_array[i]] = sub_url_array;

            subs = await redis.smembers('last_all_hrefs_' + urls_array[i]);
            sub_url_array = subs.slice(0, numOfLeftUrls);
            for(let j = 0; j < sub_url_array.length; j++){
                let title = await redis.get('updated_hrefs_title_' + sub_url_array[j]);
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
            let right_title = await redis.get('updated_hrefs_title_' + righturls_array[i]);
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
        username: usrname === 'default' ? '' : usrname,
        user_button: (usrname === "default") ? 'Log In' : 'Log Out',
        cards: webpages,
        lists: sideWebpages,
    };
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
