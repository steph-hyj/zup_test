const HOST = 'www.zohoapis.eu';
const http = require('https')
const PORT = 443;
const catalyst = require('zcatalyst-sdk-node');
const tokenController = require('../TokenController.js');

exports.getListDeals = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);

		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': `/crm/v2/Contacts/${req.params.zoho_id}/Quotes`,
			'headers': {
				'Authorization': `Zoho-oauthtoken ${accessToken}`
			}
		};
		console.log(options.path);
		var data = "";
		const request = http.request(options, function (response) {
			response.on('data', function (chunk) {
				data += chunk;
			});
			response.on('end', function () {
				console.log(JSON.parse(data));
				res.setHeader('content-type', 'application/json');
				res.status(200).send(data)
			});
		});
		request.end();
		}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.' })
	}
};

