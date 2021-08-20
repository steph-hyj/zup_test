const router = require('express').Router();
const listController = require('../../Controller/CRM/ListController.js');

router.get('/getListDeals/:zoho_id',listController.getListDeals);
router.get('/getRelatedList',listController.getRelatedList);

module.exports = router;