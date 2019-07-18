const express = require('express');
const router = express.Router();
let urls = "";
let urls_array = new Array();

async function onLookupDB(req, res) {
    const routeParams = req.params;
    const rightData = routeParams.rightData;

    const a = await req.collection.find().toArray();
    for(let b of a){
        urls = `${b.right_side_url}`;
    }
    urls_array = urls.split(",");

    const query = { rightData: rightData };
    const result = {
        rightData: rightData,
        rightArr: urls_array
    };

    const response = {
        rightData: rightData,
        rightArr: urls_array
    };
    res.json(response);
}
router.get('/rightBarDB/:rightData', onLookupDB);

module.exports = router;
