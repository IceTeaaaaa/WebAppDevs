const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

var Redis = require("ioredis");
var redis = new Redis();

const numOfLeftUrls = 12;

async function getSubUrls(req, res) {
    const domainUrl = req.body.url;
    let subs = await redis.smembers('last_all_hrefs_' + domainUrl);  // list of all subs
    let urls = subs.slice(0, numOfLeftUrls);

    const response = {
        urls: urls
        // titles: titles,
    };
    res.json(response);
}
router.post('/redis/getSubUrls', jsonParser, getSubUrls);

module.exports = router;