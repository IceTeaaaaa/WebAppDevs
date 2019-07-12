const express = require('express');
const router = express.Router();

async function onViewUrl(req, res) {
    const routeParams = req.params;

    const word = routeParams.word;

    const placeholders = {
        title_1:"123"
    };
    res.render('index_filled', placeholders);

}
router.get('/set/', onViewUrl);


async function onViewIndex(req, res) {

    res.render('index');
}
router.get('/', onViewIndex)


module.exports = router;