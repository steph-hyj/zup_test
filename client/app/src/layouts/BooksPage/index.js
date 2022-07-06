// @mui material components
import Card from "@mui/material/Card";
import { useEffect } from "react";
// import axios from "axios";
// import { useEffect, useState } from "react";

// Material Dashboard 2 PRO React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 PRO React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
import BooksData from "./data/booksdata";

function DataTables(props) {

  const { module, userEmail } = props;

  let [ data, getUserBooksData] = BooksData(module, userEmail);

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">
              
            </MDTypography>
          </MDBox>
          <DataTable table={data} canSearch />
        </Card>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default DataTables;
