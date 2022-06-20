'use strict';
const catalyst = require('zcatalyst-sdk-node');
const tokenController = require('../Catalyst/TokenController.js');
const HOST = 'books.zoho.eu';
const PORT = 443;
const http = require('https');

/**Get Organization ID */
exports.getOrganizationID = async(req,res) => {
    try
    {
        const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);

        const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': '/api/v3/organizations',
			'headers': {
				'Authorization': `Zoho-oauthtoken ${accessToken}`
			}
		};

		var data = "";
		const request = http.request(options, function (response) {
			response.on('data', function (chunk) {
				data += chunk;
			});

			response.on('end', function () {
				res.setHeader('content-type', 'application/json');
				res.status(200).send(data)
			});
		});
		request.end();
    }
    catch(err)
    {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.' })
    }
};