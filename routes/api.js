const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// var Redis = require("ioredis");
// var redis = new Redis();  //// Change here if to you want to connect to non-default redis server address.

const numOfLeftUrls = 12;

async function getSubUrls(req, res) {
    let redis = req.cluster;
    const domainUrl = req.body.url;
    // let subs = await redis.smembers('last_all_hrefs_' + domainUrl);  // list of all subs
    let subs = await redis.smembers('origin_urls_of_' + 'https://christiantietze.de');
    let urls = subs.slice(0, numOfLeftUrls);

    // getting titles and all other details
    // let details = await redis.lrange('updated_hrefs_details_' + 'http://bgr.com', 0, 50);
    // console.log(details.length);
    // console.log(5245254243)
    // details = JSON.parse(details[0]);
    // console.log(details.title);
    // console.log(typeof details);
    // console.log(11111)
    // let timestamps = new Array();
    // let titles = new Array();
    // let obtainedTimes = new Array();
    // let newurls = new Array();

    // console.log(urls);
    // console.log(subs);
    // console.log('------')
    // console.log(req.session)
    console.log(1234567890)


    let allkeys = await redis.keys('*');
    // console.log(allkeys);

    const response = {
        urls: urls
        // titles: titles,
    };
    res.json(response);
}
router.post('/redis/getSubUrls', jsonParser, getSubUrls);



// Mongo Database related CRUD operations. (create, read, update, delete)//
/////////////////////////////////////////////////////////////////////
async function removeElemDB(req, res) {
    let collection = req.collection;

    const removeFrom = req.body.which;
    const value = req.body.val;

    let db = await collection.find().toArray();
    db = db[0];
    let removeArray = db[removeFrom];
    let id = db._id;

    let filtered = removeArray.filter((elem) => {
        return elem !== value;
    });

    await collection.update({_id: id}, {$set: {[removeFrom]: filtered}});
    res.json({ success: true });  // must have this line, otherwise, this function won't return anything to caller
    // await waits forever.
}
router.post('/db/array/remove', jsonParser, removeElemDB);

async function addElemDB(req, res) {
    let collection = req.collection;

    const addTo = req.body.which;
    const value = req.body.val;
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    let db = await collection.find().toArray();
    db = db[0];
    let addToArray = db[addTo];
    addToArray.push(value);
    let id = db._id;


    // update user mongodb.
    await collection.update({_id: id}, {$set: {[addTo]: addToArray}});

    // cookie update

    if(addTo === "url_array") {
        let temp = JSON.parse(req.cookies.show_panel);
        temp.push(value);
        console.log("=====");
        console.log(temp);
        console.log("=====");
        res.cookie('show_panel', JSON.stringify(temp), { maxAge: 3600000 * 672, singed: true});
        console.log(req.cookies);
    }


    // res.cookie('random', 1)  // this works
    res.json({ success: true });  // must have this line, otherwise, this function won't return anything to caller
    // await will wait forever if not have res.json.
}
router.post('/db/array/add', jsonParser, addElemDB);



module.exports = router;