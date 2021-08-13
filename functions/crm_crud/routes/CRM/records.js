const router = require('express').Router();
const recordController = require('../../Controller/RecordsController.js');

router.post('/:col', recordController.hideColumn);
router.get('/checkColumn', recordController.checkColumn);
router.delete('/:colID', recordController.showColumn);

module.exports = router;