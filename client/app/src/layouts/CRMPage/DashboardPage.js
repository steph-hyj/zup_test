// @mui material components
import Card from "@mui/material/Card";
import axios from "axios";
import { useEffect, useState } from "react";

// Material Dashboard 2 PRO React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 PRO React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
import CRMData from "./data/crmdata";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

function DataTables(props) {

  const [userID, setUserID] = useState({});

  const { module, userEmail } = props;

  useEffect(() =>{
    axios.get(baseUrl+"getUserZohoID/"+userEmail).then((response) => {
      setUserID(response.data.data[0]);
    }).catch((err) => {
        console.log(err);
    });
  },[userEmail]);

  const crmData = CRMData(module, userEmail, userID);

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Dashboard
            </MDTypography>
          </MDBox>
          <DataTable table={crmData} canSearch />
        </Card>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default DataTables;
