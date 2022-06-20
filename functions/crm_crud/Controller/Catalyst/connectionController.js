'use strict';
const catalyst = require('zcatalyst-sdk-node');

/********************API Connection********************/
/**Create Connection*/
exports.createConnection = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const Application = req.body.app;
		const Module_name = req.body.moduleValue;
		const Module_api = req.body.module_api;
		const Connection = req.body.connBoolean;
		const catalystTable = catalystApp.datastore().table('Module');
		await catalystTable.insertRow({
			Module_name,
			Application,
			Module_api,
			Connection
		});
		res.status(200);
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
};

/**Get Connection*/
exports.getConnection = async(req, res) => {
	try {
		const catalystApp = catalyst.initialize(req);
		const connectionModule = await getConnectionModule(catalystApp);
		res.status(200).send({module : connectionModule});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error in Getting User Details. Please try again after sometime.', error: err })
	}
};

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
};

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
};
/*******************************************************/

/**SQL Request to get connection module */
async function getConnectionModule(catalystApp) {
	let query = 'SELECT * FROM Module Where Connection=true';
	let zcql = catalystApp.zcql();
	let connectionModule = await zcql.executeZCQLQuery(query);
	return connectionModule;
}