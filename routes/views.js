const express = require('express');
const router = express.Router();

function onViewIndex(req, res) {
    res.render('index');
}

router.get('/', onViewIndex);

module.exports = router;