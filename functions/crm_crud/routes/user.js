const router = require('express').Router();
const userController = require('../Controller/userController.js');

/**Get Token to use Zoho API */
router.get('/generateToken',userController.generateToken);
/**Get User Details */
router.get('/getUserDetails',userController.getUserDetails);
router.get('/getUserZohoID/:email',userController.getUserZohoID);

module.exports = router;