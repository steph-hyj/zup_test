const router = require('express').Router();
const organizationController = require('../../Controller/Books/OrganizationController');

router.get('/getOrganizationID',organizationController.getOrganizationID);

module.exports = router;