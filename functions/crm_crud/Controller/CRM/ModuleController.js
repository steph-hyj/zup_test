const HOST = 'www.zohoapis.eu';
const { cp } = require('fs');
const http = require('https')
const PORT = 443;
const catalyst = require('zcatalyst-sdk-node');
const tokenController = require('../TokenController.js');

exports.getAllModules = async (req, res) => {
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

exports.getFields = async (req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': `/crm/v2/settings/fields?module=${req.params.module}`,
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

exports.getAllRecords = async(req, res) => {
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


exports.getRecord = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'GET',
			'path': `/crm/v2/${req.params.module}/search?criteria=(${req.params.field}:equals:${req.params.value})`,
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
			if (data) {
				res.setHeader('content-type', 'application/json');
				var zcrm_Record = JSON.parse(data);
				res.status(200).send(zcrm_Record)
			} else {
				res.status(500).send({ message: 'Internal Server Error. List is empty.' })
			}});
		});
		request.end();
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.' })
	}
};

exports.hideModule = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const Module_name = req.params.mod;
		const Connection = false;
		const Application = "crm"
		const catalystTable = catalystApp.datastore().table('Module');
		const createModPermission = await catalystTable.insertRow({
			Module_name,
			Connection,
			Application
		});
		try {
			const Module_ID = createModPermission.ROWID;
			const Permission = req.body.permission;
			const Role_ID = req.body.role;
			const catalystTable = catalystApp.datastore().table('Role_Permission');
			await catalystTable.insertRow({
				Role_ID,
				Permission,
				Module_ID
			})
			res.status(200);
		} catch (err) {
			console.log(err);
			res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
		}
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

exports.checkModule = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const moduleDetail = await getModuleDetails(catalystApp);
		let userManagement = catalystApp.userManagement();
		let userDetail = await userManagement.getCurrentUser();
		res.status(200).send({Module : moduleDetail, User : userDetail});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

exports.showModule = async(req, res) => {
    try{
		const catalystApp = catalyst.initialize(req);
		const catalystTable = catalystApp.datastore().table('Module');
		var row_id = req.params.modID;
		await catalystTable.deleteRow(row_id);
		res.status(200);
	}
	catch (err)
	{
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

exports.getPermissions = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const permissionDetails = await getPermissionsDetails(catalystApp,req.params.roleId);
		var moduleDetails = [];
		for(const permissionDetail of permissionDetails) {
			const moduleDetail = await getModulePermission(catalystApp, permissionDetail);
			moduleDetails.push(moduleDetail);
		}
		let userManagement = catalystApp.userManagement();
		let userDetail = await userManagement.getCurrentUser();
		res.status(200).send({Permissions : permissionDetails, Module : moduleDetails, User : userDetail});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

async function getModuleDetails(catalystApp) {
	let query = 'SELECT * FROM Module';
	let zcql = catalystApp.zcql();
	let moduleDetail = await zcql.executeZCQLQuery(query);
	return moduleDetail;
}

async function getPermissionsDetails(catalystApp,roleId) {
	let query = 'SELECT * FROM Role_Permission WHERE Role_ID='+roleId;
	let zcql = catalystApp.zcql();
	let permissionDetail = await zcql.executeZCQLQuery(query);
	return permissionDetail;
}

async function getModulePermission(catalystApp, permissionDetail) {
	let query = 'SELECT * FROM Module WHERE ROWID='+permissionDetail.Role_Permission.Module_ID;
	let zcql = catalystApp.zcql();
	let moduleDetail = await zcql.executeZCQLQuery(query);
	return moduleDetail;
}