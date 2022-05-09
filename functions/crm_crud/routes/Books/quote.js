const router = require('express').Router();
const quoteController = require('../../Controller/Books/QuotesController.js');

/**Get Quotes */
router.get('/getAllQuotes/:orgID/:customer_id',quoteController.getAllQuotes);

module.exports = router;