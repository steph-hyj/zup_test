const router = require('express').Router();
const quoteController = require('../../Controller/Books/QuotesController.js');

/**Get Quotes */
router.get('/getAllQuotes/:org_id/:customer_id',quoteController.getAllQuotes);
/**Get quote by quote id */
router.get('/getQuote/:org_id/:quote_id', quoteController.getQuote);

module.exports = router;