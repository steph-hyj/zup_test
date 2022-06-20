'use strict';
const catalyst = require('zcatalyst-sdk-node');
const roleController = require('./roleController');

/*******************API Permissions*********************/
exports.getPermission = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
        const roleDetails = await getRoles(catalystApp);
		const permissionsDetails = await getPermissionDetail(catalystApp);
		for(const permissionDetail of permissionsDetails) {
			const moduleDetail = await getModulePermission(catalystApp, permissionDetail);
			const roleDetail = await getRolePermission(catalystApp, permissionDetail);
		}
		// console.log("Connection",connectionModule);
		let userManagement = catalystApp.userManagement();
		let userDetail = await userManagement.getCurrentUser();
		res.status(200).send({roles : roleDetails, User : userDetail});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error in Getting User Details. Please try again after sometime.', error: err })
	}
};
/*********************************************************/
/**SQL Request to get all roles */
async function getRoles(catalystApp) {
    let query = "SELECT * FROM Role";
	let zcql = catalystApp.zcql();
	let roleDetails = await zcql.executeZCQLQuery(query);
	return roleDetails;
}

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

async function getPermissionDetail(catalystApp) {
	let query = "SELECT * FROM Role_Permission"
	let zcql = catalystApp.zcql();
	let permissionDetails = await zcql.executeZCQLQuery(query);
	return permissionDetails;
}
