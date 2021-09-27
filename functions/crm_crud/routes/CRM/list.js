const router = require('express').Router();
const listController = require('../../Controller/CRM/ListController.js');

/**Get Related Lsit data */
router.get('/getListData/:zoho_id/:module/:relatedListAPI',listController.getListData);
/**Get Relates List Module */
router.get('/getRelatedList/:module',listController.getRelatedList);

module.exports = router;