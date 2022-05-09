const router = require('express').Router();
const invoiceController = require('../../Controller/Books/InvoiceController.js');

/**Get Invoices */
router.get('/getAllInvoices/:orgID/:customer_id',invoiceController.getAllInvoices);

module.exports = router;