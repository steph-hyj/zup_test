const HOST = 'www.zohoapis.eu';
const http = require('https')
const PORT = 443;
const catalyst = require('zcatalyst-sdk-node');
const tokenController = require('./TokenController.js');

exports.getAllModule = async (req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': `/crm/v2/settings/modules`,
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
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.' })
	}
};

exports.getRecord = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': `/crm/v2/${req.params.module}`,
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
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.' })
	}
};

async function getUserDetails(catalystApp) {

	let userManagement = catalystApp.userManagement();
	let userDetails = await userManagement.getCurrentUser();
	let query = 'SELECT * FROM Token where UserId=' + userDetails.user_id;
	let zcql = catalystApp.zcql();
	let userDetail = await zcql.executeZCQLQuery(query);
	//console.log("User => "+ JSON.stringify(userDetails));
	//console.log("User type => " + userDetails.user_type);

	return userDetail;

}