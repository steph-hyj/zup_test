const AUTH_HOST = 'https://accounts.zoho.eu/oauth/v2/token';
const fetch = require('node-fetch');
const CLIENTID = '1000.IYF7J63XV0A53M4ETIBX0VOW390GRU';
const CLIENT_SECRET = '395daade4fea147b9bdb37e0e9f84f2f00c223ee74';


module.exports = {
    //Fetches an Access Token using the Refresh Token
    async getAccessToken(catalystApp, userDetails){
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
        console.log("Refresh token => " + refresh_token);
        return accessToken;
    },

    //Fetches the Refresh Token by passing the required details
    async getRefreshToken(code, res) {
        try {
            const URL = `${AUTH_HOST}?code=${code}&client_id=${CLIENTID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=http://localhost:3000/server/crm_crud/generateToken`; //Add your app domain
            console.log("URL => "+URL);
            const response = await fetch(URL, { method: 'post' })
            const data = await response.json();
            return data.refresh_token;
        }
        catch (err) {
            console.log(err);
            res.status(500).send({ message: 'Internal Server Error. Please try again after sometime.', error: err })
        }
    },

    //Fetches the record from the Token table that contains the Refresh Token, by passing the userID
    async getUserDetails(catalystApp) {

        let userManagement = catalystApp.userManagement();
        let userDetails = await userManagement.getCurrentUser();
        let query = 'SELECT * FROM Token where UserId=' + userDetails.user_id;
        let zcql = catalystApp.zcql();
        let userDetail = await zcql.executeZCQLQuery(query);
        //console.log("User => "+ JSON.stringify(userDetails));
        //console.log("User type => " + userDetails.user_type);

        return userDetail;

    }
}