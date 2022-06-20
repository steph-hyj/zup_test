const router = require('express').Router();
const moduleController = require('../../Controller/CRM/ModuleController.js');

/**Get Modules */
router.get('/',moduleController.getAllModules);
/**Get Fields */
router.get('/getFields/:module',moduleController.getFields);
/**Get Records of specific module */
router.get('/getRecords/:module',moduleController.getAllRecords);
router.get('/:module/:field/:value',moduleController.getRecord);
router.put('/:module/:id_record',moduleController.updateRecord);
router.post('/:module/createRecord',moduleController.createRecord);
/** Admin Action on Module*/
router.post('/:mod', moduleController.showModule);
router.get('/checkModule', moduleController.checkModule);
router.delete('/:modID', moduleController.hideModule);
/**Admin set/get permissions */
router.get('/getPermissions/:roleId',moduleController.getPermissions);


module.exports = router;