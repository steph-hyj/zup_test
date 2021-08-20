const router = require('express').Router();
const moduleController = require('../../Controller/CRM/ModuleController.js');

router.get('/',moduleController.getAllModules);
router.get('/:module',moduleController.getAllRecords);
router.get('/:module/:zoho_id',moduleController.getRecord);

module.exports = router;