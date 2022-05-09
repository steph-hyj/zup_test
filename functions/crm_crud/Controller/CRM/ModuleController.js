const HOST = 'www.zohoapis.eu';
const http = require('https')
const PORT = 443;
const catalyst = require('zcatalyst-sdk-node');
const tokenController = require('../TokenController.js');

/**Get all modules */
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

/** Get all fields of specific module */
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

/** Get record of specific module and user */
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

/** Update record of specific module */
exports.updateRecord = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const updateData = req.body.values;
		const reqData = [];
		reqData.push(updateData)
		const data = {
			"data": reqData
		}
		if (!updateData) {
			res.status(400).send({ 'message': 'Update Data Not Found' });
		}
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'PUT',
			'path': `/crm/v2/${req.params.module}/${req.params.id_module}`,
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
}

/** Create record of specific module */
exports.createRecord = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const createData = req.body.values;
		const reqData = [];
		reqData.push(createData)
		const data = {
			"data": reqData
		}
		if (!createData) {
			res.status(400).send({ 'message': 'Data Not Found' });
		}
		const userDetails = await tokenController.getUserDetails(catalystApp);
		const accessToken = await tokenController.getAccessToken(catalystApp, userDetails);
		const options = {
			'hostname': HOST,
			'port': PORT,
			'method': 'POST',
			'path': `/crm/v2/${req.params.module}`,
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
}

/****************Admin Actions************/
/**To show module for user interface (Admin Action) */
exports.showModule = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const Module_name = req.params.mod;
		const Module_api = req.body.api_module;
		const Application = "crm"
		const catalystTable = catalystApp.datastore().table('Module');
		const createModPermission = await catalystTable.insertRow({
			Module_name,
			Application,
			Module_api
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

/**To get displayable module (Admin Action) */
exports.checkModule = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const modules = await getPermModuleDetails(catalystApp);
		const moduleDetail = [];
		for(const module of modules) {
			const mod = await getModulesDetail(catalystApp,module.Role_Permission.Module_ID);
			// console.log(mod);
			moduleDetail.push(mod);
		};
		let userManagement = catalystApp.userManagement();
		let userDetail = await userManagement.getCurrentUser();
		res.status(200).send({Module : moduleDetail, User : userDetail});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

/**To hide module for user interface (Admin action) */
exports.hideModule = async(req, res) => {
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
/*****************************************/
exports.getPermissions = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const permissionDetails = await getPermissionsDetails(catalystApp,req.params.roleId);
		var moduleDetails = [];
		for(const permissionDetail of permissionDetails) {
			var moduleObj = {
				Module: String,
				Scope: String
			}
			const moduleDetail = await getModulePermission(catalystApp, permissionDetail);
			moduleObj.Scope = permissionDetail.Role_Permission.Permission;
			moduleObj.Module = moduleDetail;
			moduleDetails.push(moduleObj);
		}
		res.status(200).send({Module : moduleDetails});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

async function getModulesDetail(catalystApp, module_id) {
	let query = `SELECT * FROM Module WHERE ROWID = ${module_id}`;
	let zcql = catalystApp.zcql();
	let moduleDetail = await zcql.executeZCQLQuery(query);
	return moduleDetail;
}

async function getPermModuleDetails(catalystApp) {
	let query = "SELECT * FROM Role_Permission WHERE Permission = 'Read'";
	let zcql = catalystApp.zcql();
	let modules = await zcql.executeZCQLQuery(query);
	return modules;
}

async function getPermissionsDetails(catalystApp,roleId) {
	let query = `SELECT * FROM Role_Permission WHERE Role_ID='${roleId}'`;
	let zcql = catalystApp.zcql();
	let permissionDetail = await zcql.executeZCQLQuery(query);
	return permissionDetail;
}

async function getModulePermission(catalystApp, permissionDetail) {
	let query = `SELECT * FROM Module WHERE ROWID='${permissionDetail.Role_Permission.Module_ID}'`;
	let zcql = catalystApp.zcql();
	let moduleDetail = await zcql.executeZCQLQuery(query);
	return moduleDetail;
}