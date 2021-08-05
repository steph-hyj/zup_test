'use strict';
const express = require('express');
const http = require('https')
const app = express();
app.use(express.json());
const catalyst = require('zcatalyst-sdk-node');
const HOST = 'www.zohoapis.eu';
const AUTH_HOST = 'https://accounts.zoho.eu/oauth/v2/token';
const PORT = 443;
const fetch = require('node-fetch');
const CLIENTID = '1000.IYF7J63XV0A53M4ETIBX0VOW390GRU'; //Add your client ID
const CLIENT_SECRET = '395daade4fea147b9bdb37e0e9f84f2f00c223ee74'; //Add your client secret

//Fetches the Refresh Token by calling the getRefreshToken() function, and inserts it along with the userID in the Token table
app.get('/generateToken', async (req, res) => {

	try {
		const catalystApp = catalyst.initialize(req);
		const code = req.query.code;

		let userManagement = catalystApp.userManagement();
		let userDetails = await userManagement.getCurrentUser();
		const refresh_token = await getRefreshToken(code, res);
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
})

//Fetches the user details by calling the getUserDetails() function 
app.get('/getUserDetails', async (req, res) => {

	try {

		const catalystApp = catalyst.initialize(req);
		const userDetails = await getUserDetails(catalystApp);

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
})

//Executes various APIs to access, add, or modify leads in CRM
//Fetches all leads
app.get('/crmData', async (req, res) => {

	try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await getUserDetails(catalystApp);
		const accessToken = await getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': `/crm/v2/Leads`,
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
				console.log(response.statusCode);
				console.log(accessToken);
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
})

//Fetches a particular lead
app.get('/crmData/:id', async (req, res) => {

	try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await getUserDetails(catalystApp);
		const accessToken = await getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': `/crm/v2/Leads/${req.params.id}`,
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
})

//Creates a new lead
app.post('/crmData', async (req, res) => {

	try {
		const catalystApp = catalyst.initialize(req);
		const createData = req.body;
		const reqData = [];
		reqData.push(createData)
		const data = {
			"data": reqData
		}
		if (!createData) {
			res.status(400).send({ 'message': 'Data Not Found' });
		}
		const userDetails = await getUserDetails(catalystApp);
		const accessToken = await getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'POST',
			'path': `/crm/v2/Leads`,
			'headers': {
				'Authorization': `Zoho-oauthtoken ${accessToken}`,
				'Content-Type': 'application/json'
			}
		};
		const request = http.request(options, function (response) {
			res.setHeader('content-type', 'application/json');
			response.pipe(res);
		});
		request.write(JSON.stringify(data));
		request.end();
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.' })
	}

});

//Edits a particular lead
app.put('/crmData/:id', async (req, res) => {

	try {
		const catalystApp = catalyst.initialize(req);
		const updateData = req.body;
		const reqData = [];
		reqData.push(updateData)
		const data = {
			"data": reqData
		}
		if (!updateData) {
			res.status(400).send({ 'message': 'Update Data Not Found' });
		}
		const userDetails = await getUserDetails(catalystApp);
		const accessToken = await getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'PUT',
			'path': `/crm/v2/Leads/${req.params.id}`,
			'headers': {
				'Authorization': `Zoho-oauthtoken ${accessToken}`,
				'Content-Type': 'application/json'
			}
		};
		const request = http.request(options, function (response) {

			res.setHeader('content-type', 'application/json');
			response.pipe(res);
		});
		request.write(JSON.stringify(data));
		request.end();

	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.' })
	}

});

//Deletes a particular lead
app.delete('/crmData/:id', async (req, res) => {

	console.log(`/crm/v2/Leads/${req.params.id}`);
	try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await getUserDetails(catalystApp);
		const accessToken = await getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'DELETE',
			'path': `/crm/v2/Leads/${req.params.id}`,
			'headers': {
				'Authorization': `Zoho-oauthtoken ${accessToken}`,
				'Content-Type': 'application/json'
			}
		};
		const request = http.request(options, function (response) {
			res.setHeader('content-type', 'application/json');
			response.pipe(res);
		});
		request.end();
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.' })
	}

});

//Fetches an Access Token using the Refresh Token
async function getAccessToken(catalystApp, userDetails) {

	const refresh_token = userDetails[0].Token.refresh_token;
	const userId = userDetails[0].Token.userId;

	const credentials = {
		[userId]: {
			client_id: CLIENTID,
			client_secret: CLIENT_SECRET,
			auth_url: AUTH_HOST,
			refresh_url: AUTH_HOST,
			refresh_token
		}
	}
	const accessToken = await catalystApp.connection(credentials).getConnector(userId).getAccessToken();
	return accessToken;
}

//Fetches the Refresh Token by passing the required details
async function getRefreshToken(code, res) {
	try {
		const URL = `${AUTH_HOST}?code=${code}&client_id=${CLIENTID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=http://localhost:3000/server/crm_crud/generateToken`; //Add your app domain
		const response = await fetch(URL, { method: 'post' })
		const data = await response.json();
		return data.refresh_token;
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

//Fetches the record from the Token table that contains the Refresh Token, by passing the userID
async function getUserDetails(catalystApp) {

	let userManagement = catalystApp.userManagement();
	let userDetails = await userManagement.getCurrentUser();
	let query = 'SELECT * FROM Token where UserId=' + userDetails.user_id;
	let zcql = catalystApp.zcql();
	let userDetail = await zcql.executeZCQLQuery(query);
	return userDetail;

}

module.exports = app;