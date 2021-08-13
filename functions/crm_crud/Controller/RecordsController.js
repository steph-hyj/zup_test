const catalyst = require('zcatalyst-sdk-node');

exports.hideColumn = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const Field_name = req.body.Column;
		const catalystTable = catalystApp.datastore().table('Field');
		await catalystTable.insertRow({
			Field_name
		});
		res.status(200); //Add your app domain*/
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

exports.checkColumn = async(req, res) => {
    try {
		const catalystApp = catalyst.initialize(req);
		const fieldDetail = await getFieldDetails(catalystApp);
		let userManagement = catalystApp.userManagement();
		let userDetail = await userManagement.getCurrentUser();
		console.log("test => " + fieldDetail.length);
		res.status(200).send({Field : fieldDetail, User : userDetail});
	}
	catch (err) {
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

exports.showColumn = async(req, res) => {
    try{
		const catalystApp = catalyst.initialize(req);
		const catalystTable = catalystApp.datastore().table('Field');
		var row_id = req.params.colID;
        console.log(row_id);
		await catalystTable.deleteRow(row_id);
		res.status(200);
	}
	catch (err)
	{
		console.log(err);
		res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
	}
}

async function getFieldDetails(catalystApp) {

	let query = 'SELECT * FROM Field';
	let zcql = catalystApp.zcql();
	let fieldDetail = await zcql.executeZCQLQuery(query);
	return fieldDetail;

}