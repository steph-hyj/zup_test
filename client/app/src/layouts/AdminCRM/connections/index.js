// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

// Material Dashboard 2 PRO React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import DataTable from "../../../examples/Tables/DataTable";

// Data
import ConnectionData from "./data/connectionsData";

function DataTables() {

  const connectionData = ConnectionData();
  // console.log(connectionData);
  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox pt={6} pb={3}>
        <MDButton variant="gradient" color="info" href={"http://localhost:3000/app/index.html#/adminCreateForm/connection"}>
          New Connection
        </MDButton>
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
            Connections
            </MDTypography>
          </MDBox>
          <DataTable table={connectionData} canSearch />
        </Card>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default DataTables;
