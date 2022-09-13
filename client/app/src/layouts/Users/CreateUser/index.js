// import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

import { Formik, Form } from "formik";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";

import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";

import FormInfo from "../../AdminCRM/Form/FormInfo";

import userForm from "../../AdminCRM/Form/schemas/userForm";
import initialValues from "../../AdminCRM/Form/schemas/initialValues";

function getForms(formData, formName) {
  return <FormInfo formData={formData} formName={formName} />;
}

//Call API to update connection
function updateUser(connectionValue, connectionID) {
  // console.log(values);
  // axios.put(baseUrl+"module/"+module+"/", {values}).then((response) => {
  //   console.log("API record",response.data);
  // }).catch((err) => {
  //     console.log(err);
  // });
}

function createUser(userValue) {
  console.log("User Value",userValue);
  // console.log("Role Permission Value",rolePermValue);
  // axios.post(baseUrl+"createRole",{rolePermValue})
  // .then((response) => {
  //   console.log(response);
  // }).catch((err) => {
  //     console.log(err);
  // });
}

function UserForm() {

  let { formName } = useParams();
  const url = useLocation();

  const formConst = userForm();

  if(formConst) {
    const { formId, formField } = formConst;

    const handleSubmit = (value) => {
      if(url.pathname.includes("Create") || url.pathname.includes("create")) {
          createUser(value);
      } else {
        updateUser(value);
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

export default UserForm;
