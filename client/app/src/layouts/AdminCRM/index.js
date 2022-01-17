import { useEffect, useState } from "react";
import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";
// Material Dashboard 2 PRO React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
// Material Dashboard 2 PRO React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
import AdminDashboardData from "./data/dashboardData";
import AdminCRMPageData from "./data/AdminCRMPageData";


const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

function DataTables(props) {

  const [role, setRole] = useState(null);
  const [roleNameList, setRoleNameList] = useState({});
  const [roleList, setRoleList] = useState({});
  const { module } = props;
  var AdminCRMData = null;
  
  useEffect(() => {
    axios.get(baseUrl+"getRoles").then((response)=>{ 
        const roles = response.data.ModuleRole;
        setRoleList(roles);
        var roleNameList = [];
        roles.forEach(roleName => {
          roleNameList.push(roleName.Role_name);
        });
        setRoleNameList(roleNameList);
    }).catch((err) => {
        console.log(err)
    });
  },[])

  function handleSelectChange(event) {
    roleList.forEach(r => {
      if(r.Role_name === event.target.textContent) {
        // console.log(r)
        setRole(r.Role_ID);
      }
    });
  };

  if(module) {
    AdminCRMData = AdminCRMPageData(module);
  } else {
    AdminCRMData = AdminDashboardData(role ? role : null);
  }
  
  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} lineHeight={1}>
            <MDTypography variant="h5" fontWeight="medium">

            </MDTypography>
            <Autocomplete
                options={roleNameList}
                onChange={(event) => handleSelectChange(event)}
                renderInput={(params) => <MDInput {...params} variant="standard" />}
            />
          </MDBox>
            {
              role || module ?
                <DataTable table={AdminCRMData} canSearch />
              :
                <h1>Selectionner un rôle</h1>
            }
        </Card>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default DataTables;
