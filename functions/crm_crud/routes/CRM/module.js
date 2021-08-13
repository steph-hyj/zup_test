const router = require('express').Router();
const moduleController = require('../../Controller/ModuleController.js');

router.get('/',moduleController.getAllModule);
router.get('/:module',moduleController.getRecord);

module.exports = router;