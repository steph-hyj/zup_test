const router = require('express').Router();
const organizationController = require('../../Controller/Books/OrganizationController');

/**Get Organization ID */
router.get('/getOrganizationID',organizationController.getOrganizationID);

module.exports = router;