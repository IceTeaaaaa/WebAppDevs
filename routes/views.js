const express = require('express');
const router = express.Router();

function onViewIndex(req, res) {
    res.render('type.js');
}

router.get('/', onViewIndex);

module.exports = router;