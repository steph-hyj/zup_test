const catalyst = require('zcatalyst-sdk-node');

/**Insert INTO Field(Table) to display col */
exports.showColumn = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const Field_name = req.body.Column;
		const Module = req.body.module;
		const catalystTable = catalystApp.datastore().table('Field');
		await catalystTable.insertRow({
			Field_name,
			Module
		});
		res.status(200); //Add your app domain*/
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

/**Get Field(Table) to display col */
exports.checkColumn = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const fieldDetail = await getFieldDetails(catalystApp,req.params.module);
		let userManagement = catalystApp.userManagement();
		let userDetail = await userManagement.getCurrentUser();
		res.status(200).send({Field : fieldDetail, User : userDetail});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

/**Delete FROM Field(TAble) to hide col */
exports.hideColumn = async(req, res) => {
    try{
		const catalystApp = catalyst.initialize(req);
		const catalystTable = catalystApp.datastore().table('Field');
		var row_id = req.params.colID;
		await catalystTable.deleteRow(row_id);
		res.status(200);
	}
	catch (err)
	{
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

/**SQL request to get fields details */
async function getFieldDetails(catalystApp,module) {
	let query = `SELECT * FROM Field WHERE Module = '${module}'`;
	let zcql = catalystApp.zcql();
	let fieldDetail = await zcql.executeZCQLQuery(query);
	return fieldDetail;
}