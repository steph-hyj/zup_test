const router = require('express').Router();
const userController = require('../Controller/userController.js');

router.get('/generateToken',userController.generateToken);
router.get('/getUserDetails',userController.getUserDetails);
router.get('/getUserZohoID/:email',userController.getUserZohoID);

module.exports = router;