const express = require('express');
const bodyParser = require('body-parser');

let result = new Array();
const app = express();
const router = express.Router();
const jsonParser = bodyParser.json();

// async function onViewUrls(req, res) {
//
//
//     await req.collection.insert({"url": news});
//
// }
// router.get('/web_mongod', onViewUrls);
//
// module.exports = router;
//

// async function onApiUrl(req, res) {
//     const urls = req.body.url;
//     console.log(urls);
//     console.log(123);
//
//
//     // const query = { word: word };
//     // const newEntry = { word: word, definition: definition };
//     // const params = { upsert: true };
//     // const response =
//     //     await collection.update(query, newEntry, params);
//     //
//     // res.json({ success: true });
// }
// app.post('/api', jsonParser, onApiUrl);
module.exports = router;
