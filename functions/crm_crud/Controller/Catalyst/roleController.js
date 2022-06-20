'use strict';
const catalyst = require('zcatalyst-sdk-node');

/*******************API Role************************* */
/**Function to get Role */
exports.getRoleDetail = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const permissionDetails = await getRoleConnectionDetail(catalystApp);
		var moduleRoleDetails = [];
		for(const permissionDetail of permissionDetails) {
			const moduleDetail = await getModulePermission(catalystApp, permissionDetail);
			const roleDetail = await getRolePermission(catalystApp, permissionDetail);
			let Role_name = null;
			let Role_ID = null;
			roleDetail.forEach(role => {
				Role_name = role.Role.Role_name;
				Role_ID = role.Role.ROWID;
			});
			let Module_name = null;
			let Module_ID = null;
			let Application = null;
			moduleDetail.forEach(module => {
				Module_name = module.Module.Module_name;
				Application = module.Module.Application;
				Module_ID = module.Module.ROWID;
			});
			const permission_ID = permissionDetail.Role_Permission.ROWID;
			const moduleRole = { Application: Application,Module_name: Module_name, Module_ID:  Module_ID , Role_name: Role_name, Role_ID: Role_ID, Permission_ID: permission_ID};
			moduleRoleDetails.push(moduleRole);
		}
		res.status(200).send(moduleRoleDetails);
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
		console.log("Requeste Body",req.body);
		const Role_name = req.body.rolePermValue['Role name'];
		const scopes = req.body.rolePermValue.Permissions;
		console.log("Role name",Role_name);
		const catalystTable = catalystApp.datastore().table('Role');
		const Role = await catalystTable.insertRow({
			Role_name,
		});
		if(Role.ROWID) {
			for(const scope of scopes) {
				const catalystTable = catalystApp.datastore().table('Role_Permission');
				const Permission = scope.value;
				const Role_ID = Role.ROWID;
				const Module_ID = req.body.rolePermValue.Modules;
				await catalystTable.insertRow({
					Role_ID,
					Module_ID,
					Permission
				});
			}
			res.status(200).send({message: "Success"});
		} else {
			res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
		}
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
};

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
};

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
};
/*********************************************************/

/**SQL Request to get role details */
async function getRolePermission(catalystApp, permissionDetail) {
	let query = `SELECT * FROM Role WHERE ROWID=${permissionDetail.Role_Permission.Role_ID}`;
	let zcql = catalystApp.zcql();
	let roleDetail = await zcql.executeZCQLQuery(query);
	return roleDetail;
}

/**SQL Request to get module details */
async function getModulePermission(catalystApp, permissionDetail) {
	let query = `SELECT * FROM Module WHERE ROWID=${permissionDetail.Role_Permission.Module_ID}`;
	let zcql = catalystApp.zcql();
	let moduleDetail = await zcql.executeZCQLQuery(query);
	return moduleDetail;
}

/**SQL Request to get role ID in Role_Permission (Table) details */
async function getRoleConnectionDetail(catalystApp) {
	let query = "SELECT * FROM Role_Permission WHERE Permission='Connection'";
	let zcql = catalystApp.zcql();
	let roleDetail = await zcql.executeZCQLQuery(query);
	return roleDetail;
}

async function getPermissionDetail(catalystApp) {
	let query = "SELECT * FROM Role_Permission"
	let zcql = catalystApp.zcql();
	let permissionDetails = await zcql.executeZCQLQuery(query);
	return permissionDetails;
}