import axios from "axios";
import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 PRO React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 PRO React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
// import Footer from "../../../examples/Footer";
import ProfileInfoCard from "../../../examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "../../CRMPage/ProfilePage/component/Header";
import CRMData from "../data/crmdata";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";


function Overview(props) {

    const [userID, setUserID] = useState({});

    const { module, userEmail, scope } = props;

    useEffect(() =>{
        axios.get(baseUrl+"getUserZohoID/"+userEmail).then((response) => {
            setUserID(response.data.data[0]);
        }).catch((err) => {
            console.log(err);
        });
    },[userEmail]);

    const crmData = CRMData(module, userEmail, userID, scope);
    // console.log(crmData);
  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <Header>
        <MDBox module={module} mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} xl={44} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: 0, mr: 1 }} />
              <ProfileInfoCard
                title={"--------------- "+module+" information ---------------"}
                info={crmData.rows.length > 0 ? crmData.rows[0] : undefined}
                action={{tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Overview;
