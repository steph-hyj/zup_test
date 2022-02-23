const router = require('express').Router();
const quoteController = require('../../Controller/Books/QuotesController.js');

/**Get Quotes */
router.get('/getAllQuotes/:orgID/:email',quoteController.getAllQuotes);

module.exports = router;