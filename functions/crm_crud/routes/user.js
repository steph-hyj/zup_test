const router = require('express').Router();
const userController = require('../Controller/Catalyst/userController.js');
const roleController = require('../Controller/Catalyst/roleController.js');
const connectionController = require('../Controller/Catalyst/connectionController.js');
const permissionController = require('../Controller/Catalyst/permissionController.js')

/**Get Token to use Zoho API */
router.get('/generateToken',userController.generateToken);
/**API User Details */
router.get('/getAllUser', userController.getAllUserDetails);
router.get('/getUserDetails',userController.getUserDetails);
router.get('/getUserZohoID/:email',userController.getUserZohoID);
/**API Role */
router.get('/getRoles',roleController.getRoleDetail);
router.post('/createRole',roleController.createRole);
router.put('/updateRole',roleController.updateRole);
router.delete('/deleteRole/:roleID',roleController.deleteRole);
/**API Connexion*/
router.get('/getConnection',connectionController.getConnection);
router.post('/createConnection',connectionController.createConnection);
router.put('/updateConnection', connectionController.updateConnection);
router.delete('/deleteConnection/:connectionID',connectionController.deleteConnection);

module.exports = router;