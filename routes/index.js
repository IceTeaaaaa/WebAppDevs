const express = require('express');
const router = express.Router();

function onViewIndex(req, res) {
    const placeholders = {
        title_1: "123",
        news_1: "456"
    };
    res.render('index', placeholders);
}

router.get('/', onViewIndex);

module.exports = router;