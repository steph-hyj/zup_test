const router = require('express').Router();
const customerController = require('../../Controller/Books/CustomersController.js');

/**Get Customers */
router.get('/getAllCustomers/:orgID/:email_id',customerController.getAllCustomers);

module.exports = router;