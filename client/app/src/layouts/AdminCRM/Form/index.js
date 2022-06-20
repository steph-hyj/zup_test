import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

import { Formik, Form } from "formik";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";

import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";

import FormInfo from "./FormInfo";

import connectionForm from "./schemas/createForm";
import rolePermissionForm from "./schemas/rolePermissionForm";
import updateForm from "./schemas/updateForm";
import initialValues from "./schemas/initialValues";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

function getForms(formData, formName) {
  return <FormInfo formData={formData} formName={formName} />;
}

//Call API to create connection
function createConnection(connectionValue) {
  const app = connectionValue.Applications;
  const moduleValue = connectionValue.Modules;
  const module_api = connectionValue.Modules;
  const connBoolean = true;
  axios.post(baseUrl+"createConnection", {
      app,
      moduleValue,
      module_api,
      connBoolean
  }).then((response) => {
      console.log(response);
  }).catch((err) => {
      console.log(err);
  });
}

//Call API to update connection
function updateConnection(connectionValue, connectionID) {
  // console.log(values);
  // axios.put(baseUrl+"module/"+module+"/", {values}).then((response) => {
  //   console.log("API record",response.data);
  // }).catch((err) => {
  //     console.log(err);
  // });
}

function createRolePermission(rolePermValue) {
  console.log("Role Permission Value",rolePermValue);
  axios.post(baseUrl+"createRole",{rolePermValue})
  .then((response) => {
    console.log(response);
  }).catch((err) => {
      console.log(err);
  });
}

function ConnectionForm() {

  let { formName } = useParams();
  const url = useLocation();

  var formConst = null;

  if(formName === "connection") {
    formConst = connectionForm();
  } else if(formName === "rolePermission") {
    formConst = rolePermissionForm();
  }

  if(formConst) {
    const { formId, formField } = formConst;

    const handleSubmit = (value) => {
      if(url.pathname.includes("Create")) {
        if(formName === "connection") {
          createConnection(value);
        } else if(formName === "rolePermission") {
          createRolePermission(value);
        }
      } else {
        updateConnection(value);
      }
    };

    return (
      <DashboardLayout>
        {/* <DashboardNavbar /> */}
        <MDBox py={3} mb={20} height="65vh">
          <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
            <Grid item xs={12} lg={8}>
                <Formik initialValues={initialValues} onSubmit={( value ) => { handleSubmit(value) }}>
                {({ values, errors, touched, isSubmitting, setFieldValue, handleChange }) => (
                  <Form id={formId} autoComplete="off">
                    <Card sx={{ height: "100%" }}>
                      <MDBox p={3}>
                        <MDBox>
                          {getForms({
                            values,
                            touched,
                            formField,
                            errors,
                            setFieldValue,
                            handleChange
                          }, formName)}
                          <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                            <MDBox />
                            <MDButton
                              type="submit"
                              variant="gradient"
                              color="dark"
                            >
                              Send
                            </MDButton>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    </Card>
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </MDBox>
        {/* <Footer /> */}
      </DashboardLayout>
    );
  } else {
    return (
      <h1>Wait</h1>
    )
  }
}

export default ConnectionForm;
