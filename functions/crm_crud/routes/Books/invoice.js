const router = require('express').Router();
const invoiceController = require('../../Controller/Books/InvoiceController.js');

/**Get Invoices */
router.get('/getAllInvoices/:orgID/:email',invoiceController.getAllInvoices);

module.exports = router;