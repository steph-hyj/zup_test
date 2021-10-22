'use strict';
const catalyst = require('zcatalyst-sdk-node');
const tokenController = require('../TokenController.js');
const HOST = 'books.zoho.eu';
const PORT = 443;
const http = require('https');

/**Get Quotes */
exports.getAllQuotes = async(req,res) => {
    try
    {
        const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);

        const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': `/api/v3/estimates?organization_id=${req.params.orgID}`,
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