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

    console.log(urls);
    console.log(subs);
    console.log('------')


    let allkeys = await redis.keys('*');
    console.log(allkeys);

    const response = {
        urls: urls
        // titles: titles,
    };
    res.json(response);
}
router.post('/redis/getSubUrls', jsonParser, getSubUrls);

module.exports = router;