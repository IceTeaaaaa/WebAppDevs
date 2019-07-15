const express = require('express');
const router = express.Router();



async function onViewIndex(req, res) {

    let urls = req.collection.find({}, {_id: 0, url:1, sub_url: 1});
    console.log(urls);
    const placeholders = {
        title_1: ""
    };
    res.render('index', placeholders);}

router.get('/', onViewIndex);


module.exports = router;