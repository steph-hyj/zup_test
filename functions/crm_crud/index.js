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
const CLIENTID = '1000.IYF7J63XV0A53M4ETIBX0VOW390GRU';
const CLIENT_SECRET = '395daade4fea147b9bdb37e0e9f84f2f00c223ee74';
const userController = require('../crm_crud/Controller/userController.js');
const tokenController = require('./Controller/TokenController.js');


app.use("/list",require("./routes/CRM/list.js"));
app.use("/module",require("./routes/CRM/module.js"));
app.use("/",require('./routes/CRM/user.js'));
app.use("/record",require('./routes/CRM/records.js'));

//Executes various APIs to access, add, or modify leads in CRM
//Fetches all leads
app.get('/crmData', async (req, res) => {

	try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await userController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
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
		const userDetails = await userController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
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
		const userDetails = await userController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
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
		const userDetails = await userController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
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
		const userDetails = await userController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
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

module.exports = app;