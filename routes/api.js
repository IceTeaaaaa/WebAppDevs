const express = require('express');
const router = express.Router();

async function onViewUrls(req, res) {
    const routeParams = req.params;
    // const word = routeParams.word;
    //
    // const query = { word: word.toLowerCase() };
    // const result = await req.collection.findOne(query);
    // const definition = result ? result.definition : '';
    //
    // if(result){
    //     console.log("onViewWord find it");
    // }

    // const placeholders = {
    //     title: "123",
    //     news: "456"
    // };
    // res.render('index', placeholders);

}
router.get('/', onViewUrls);

module.exports = router;