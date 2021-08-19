const router = require('express').Router();
const moduleController = require('../../Controller/CRM/ModuleController.js');

router.get('/',moduleController.getAllModules);
router.get('/:module',moduleController.getAllRecords);
router.get('/:module/:email',moduleController.getRecord);

module.exports = router;