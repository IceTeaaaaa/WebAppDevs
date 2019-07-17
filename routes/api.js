const express = require('express');
const router = express.Router();
let urls = "";
let urls_array = new Array();

async function onLookupDB(req, res) {
    const routeParams = req.params;
    const data = routeParams.data;

    const a = await req.collection.find().toArray();
    for(let b of a){
        urls = `${b.url_array}`;
    }
    urls_array = urls.split(",");

    const query = { data: data };
    const result = {
        data: data,
        array: urls_array
    };

    const response = {
        data: data,
        array: urls_array
    };
    res.json(response);
}
router.get('/dataset/:data', onLookupDB);

module.exports = router;
