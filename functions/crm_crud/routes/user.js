const router = require('express').Router();
const userController = require('../Controller/userController.js');

/**Get Token to use Zoho API */
router.get('/generateToken',userController.generateToken);
/**API User Details */
router.post('/createUser', userController.createUser);
router.get('/getUserDetails',userController.getUserDetails);
router.get('/getUserZohoID/:email',userController.getUserZohoID);
/**API Role */
router.get('/getRoles',userController.getRoleDetail);
router.post('/createRole',userController.createRole);
router.put('/updateRole',userController.updateRole);
router.delete('/deleteRole/:roleID',userController.deleteRole);
/**API Connexion*/
router.get('/getConnection',userController.getConnection);
router.post('/createConnection',userController.createConnection);
router.put('/updateConnection', userController.updateConnection);
router.delete('/deleteConnection/:connectionID',userController.deleteConnection);

module.exports = router;