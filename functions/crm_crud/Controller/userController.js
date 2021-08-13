'use strict';
const catalyst = require('zcatalyst-sdk-node');
const tokenController = require('./TokenController.js');

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

exports.getUserDetails = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		if (userDetails.length !== 0) {
			res.status(200).send({ userId: userDetails[0].Token.userId, userRole: userDetails[0].Token.Role })
		} else {
			res.status(200).send({ userId: null })
		}
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error in Getting User Details. Please try again after sometime.', error: err })
	}
};