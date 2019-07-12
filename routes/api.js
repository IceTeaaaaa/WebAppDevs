const express = require('express');
const router = express.Router();
let result = new Array();

async function onViewUrls(req, res) {

    console.log(456);
    await req.collection.insert({"url": "http://www.hao123.com"});
}
router.get('/web_mongod', onViewUrls);

module.exports = router;