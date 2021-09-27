const router = require('express').Router();
const moduleController = require('../../Controller/CRM/ModuleController.js');

/**Get Modules */
router.get('/',moduleController.getAllModules);
/**Get Records of specific module */
router.get('/getRecords/:module',moduleController.getAllRecords);
router.get('/:module/:email',moduleController.getRecord);
/** Admin Action on Module*/
router.post('/:mod', moduleController.showModule);
router.get('/checkModule', moduleController.checkModule);
router.delete('/:modID', moduleController.hideModule);


module.exports = router;