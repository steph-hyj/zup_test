const router = require('express').Router();
const listController = require('../../Controller/ListController.js');

router.get('/getListDeals/:zoho_id',listController.getListDeals);

module.exports = router;