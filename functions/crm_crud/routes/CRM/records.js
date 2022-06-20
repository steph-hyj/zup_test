const router = require('express').Router();
const recordController = require('../../Controller/Catalyst/RecordsController.js');

/**Admin Action on Records */
router.post('/:col', recordController.showColumn);
router.get('/checkColumn/:module', recordController.checkColumn);
router.delete('/:colID', recordController.hideColumn);

module.exports = router;