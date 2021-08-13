const router = require('express').Router();
const userController = require('../../Controller/userController.js');

router.get('/generateToken',userController.generateToken);
router.get('/getUserDetails',userController.getUserDetails);


module.exports = router;