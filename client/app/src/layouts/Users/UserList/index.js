// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// Material Dashboard 2 PRO React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import DataTable from "../../../examples/Tables/DataTable";

// Data
// import RolePermissionsData from "./data/users";
import Users from "./data/users";
// import EditIcon from "@mui/icons-material/Edit";
// import MDButton from "../../../components/MDButton";

function DataTables() {

  const usersData = Users();
  // console.log(usersData);
  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Utilisateurs
            </MDTypography>
          </MDBox>
          <DataTable table={usersData} canSearch />
        </Card>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default DataTables;
