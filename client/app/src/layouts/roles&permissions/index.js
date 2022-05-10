// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 PRO React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
import RolePermissionsData from "./data/rolepermissionsData";

function DataTables() {

  const roleData = RolePermissionsData()
  console.log(roleData)
  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              Roles & Permissions
            </MDTypography>
          </MDBox>
          <DataTable table={roleData} canSearch />
        </Card>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default DataTables;
