'use strict';
const catalyst = require('zcatalyst-sdk-node');
const tokenController = require('./TokenController.js');
const HOST = 'www.zohoapis.eu';
const PORT = 443;
const http = require('https');

/**Function to generate token to use Zoho API */
exports.generateToken = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const code = req.query.code;

		let userManagement = catalystApp.userManagement();
		let userDetails = await userManagement.getCurrentUser();
		const refresh_token = await tokenController.getRefreshToken(code, res);
		const userId = userDetails.user_id;
		const catalystTable = catalystApp.datastore().table('Token');
		await catalystTable.insertRow({
			refresh_token,
			userId
		});
		res.status(200).redirect("http://localhost:3000/app/index.html"); //Add your app domain
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
};

/**Function to get User Details */
exports.getUserDetails = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		let userManagement = catalystApp.userManagement();
		let user = await userManagement.getCurrentUser();
		if (userDetails.length !== 0) {
			res.status(200).send({ user: user, userRole: user.role_details.role_name,userId: userDetails[0].Token.userId })
		} else {
			res.status(200).send({ userId: null })
		}
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error in Getting User Details. Please try again after sometime.', error: err })
	}
};

/**Not used */
exports.getUserZohoID = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);

		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': `/crm/v2/Contacts/search?email=${req.params.email}`,
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
				var mydatas= JSON.parse(data);
				console.log("\nWelcome", "\x1b[32m\x1b[1m", req.params.email, "\x1b[0m", "your zoho id is :", "\x1b[34m\x1b[1m", mydatas.data[0].id, "\x1b[0m", "\n\n\t\t\t", "\x1b[1m\x1b[7m", "Have a happy day !", "\x1b[0m"); //// WELCOME MESSAGE
				res.status(200).send(mydatas.data[0].id)
			});
		});
		request.end();

		}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.' })
	}
};
