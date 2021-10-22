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

/**Function to get Role */
exports.getRoleDetail = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const permissionDetails = await getRoleConnectionDetail(catalystApp);
		var moduleRoleDetails = [];
		for(const permissionDetail of permissionDetails) {
			const moduleDetail = await getModulePermission(catalystApp, permissionDetail);
			const roleDetail = await getRolePermission(catalystApp, permissionDetail);
			var Role_name = "";
			var Role_ID = "";
			roleDetail.forEach(role => {
				Role_name = role.Role.Role_name;
				Role_ID = role.Role.ROWID;
			});
			var Module_name = "";
			var Module_ID = "";
			moduleDetail.forEach(module => {
				Module_name = module.Module.Module_name;
				Module_ID = module.Module.ROWID;
			});
			const permission_ID = permissionDetail.Role_Permission.ROWID;
			const moduleRole = { Module_name: Module_name, Module_ID:  Module_ID , Role_name: Role_name, Role_ID: Role_ID, Permission_ID: permission_ID};
			moduleRoleDetails.push(moduleRole);
		}
		res.status(200).send({ModuleRole : moduleRoleDetails});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error in Getting User Details. Please try again after sometime.', error: err })
	}
};

/**Create Role*/
exports.createRole = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const Role_name = req.body.roleName;
		const catalystTable = catalystApp.datastore().table('Role');
		const Role = await catalystTable.insertRow({
			Role_name,
		});
		if(Role.ROWID) {
			const catalystTable = catalystApp.datastore().table('Role_Permission');
			const Role_ID = Role.ROWID;
			const Module_ID = req.body.moduleValue;
			const Permission = "Connection";
			await catalystTable.insertRow({
				Role_ID,
				Module_ID,
				Permission
			});
			res.status(200);
		} else {
			res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
		}
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

/**Update Role*/
exports.updateRole = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const Role_name = req.body.roleName;
		const ROWID = req.body.roleID;
		if(Role_name && ROWID) {
			const catalystTable = catalystApp.datastore().table('Role');
			await catalystTable.updateRow({
				Role_name,
				ROWID
			});
			res.status(200);
		} else {
			res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.'})
		}

		if(req.body.moduleValue) {
			const Module_ID = req.body.moduleValue;
			const ROWID = req.body.permissionID;
			const catalystTable = catalystApp.datastore().table('Role_Permission');
			await catalystTable.updateRow({
				Module_ID,
				ROWID
			});
			res.status(200);
		}
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}


/**Delete Role*/
exports.deleteRole = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const row_id = req.params.roleID;
		const catalystTable = catalystApp.datastore().table('Role');
		await catalystTable.deleteRow(row_id);
		res.status(200);
	} catch(err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}
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

/**Get Zoho id  */
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

/**Create Connection*/
exports.createConnection = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const Application = req.body.app;
		const Module_name = req.body.moduleValue;
		const Connection = req.body.connection;
		const catalystTable = catalystApp.datastore().table('Module');
		await catalystTable.insertRow({
			Module_name,
			Application,
			Connection
		});
		res.status(200);
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

/**Get Connection*/
exports.getConnection = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const connectionModule = await getConnectionModule(catalystApp)
		let userManagement = catalystApp.userManagement();
		let userDetail = await userManagement.getCurrentUser();
		res.status(200).send({module : connectionModule, User : userDetail});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error in Getting User Details. Please try again after sometime.', error: err })
	}
}

/**Update Connection */
exports.updateConnection = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const ROWID = req.body.moduleID;
		const Module_name = req.body.moduleValue;
		const Connection = req.body.connection;
		const Application = req.body.app;
		const catalystTable = catalystApp.datastore().table('Module');
		await catalystTable.updateRow({
			Module_name,
			Application,
			Connection,
			ROWID
		});
		res.status(200).send({message : 'Update successfully'});
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error in Getting User Details. Please try again after sometime.', error: err })
	}
}

/**Delete Connection */
exports.deleteConnection = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const row_id = req.params.connectionID;
		const catalystTable = catalystApp.datastore().table('Module');
		await catalystTable.deleteRow(row_id);
		res.status(200).send({message : 'Delete successfully'});
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error in Getting User Details. Please try again after sometime.', error: err })
	}
}

/**SQL Request to get role ID in Role_Permission (Table) details */
async function getRoleConnectionDetail(catalystApp) {
	let query = 'SELECT * FROM Role_Permission WHERE Permission=Connection';
	let zcql = catalystApp.zcql();
	let roleDetail = await zcql.executeZCQLQuery(query);
	return roleDetail;
}

/**SQL Request to get module details */
async function getModulePermission(catalystApp, permissionDetail) {
	let query = 'SELECT * FROM Module WHERE ROWID='+permissionDetail.Role_Permission.Module_ID;
	let zcql = catalystApp.zcql();
	let moduleDetail = await zcql.executeZCQLQuery(query);
	return moduleDetail;
}

/**SQL Request to get role details */
async function getRolePermission(catalystApp, permissionDetail) {
	let query = 'SELECT * FROM Role WHERE ROWID='+permissionDetail.Role_Permission.Role_ID;
	let zcql = catalystApp.zcql();
	let roleDetail = await zcql.executeZCQLQuery(query);
	return roleDetail;
}

/**SQL Request to get connection module */
async function getConnectionModule(catalystApp) {
	let query = 'SELECT * FROM Module Where Connection IS NOT NULL';
	let zcql = catalystApp.zcql();
	let connectionModule = await zcql.executeZCQLQuery(query);
	return connectionModule;
}