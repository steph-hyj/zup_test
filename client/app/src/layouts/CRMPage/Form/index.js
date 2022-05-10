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

import createForm from "./schemas/createForm";
import updateForm from "./schemas/updateForm";
import initialValues from "./schemas/initialValues";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

function getForms(formData) {
  return <FormInfo formData={formData} />;
}

function CreateForm() {

  let { module, deal_id } = useParams();
  const url = useLocation();
  
  var formConst = null;
  
  if(url.pathname.includes("create")) {
    formConst = createForm();
  } else {
    formConst = updateForm(module, deal_id);
  }

  if(formConst) {
    const { formId, formField, userId } = formConst;

    const handleSubmit = (values) => {
      
      if(url.pathname.includes("create")) {
        const values_obj = {
          Account_Name: String,
          Contact_Name: String,
        }
        values_obj.Account_Name = userId.Account_Name;
        values_obj.Contact_Name = userId.id;
        Object.assign(values, values_obj);
        //Call API to create record
        console.log(values);
        axios.post(baseUrl+"module/"+module+"/createRecord", {values}).then((response) => {
          console.log("API record",response.data);
        }).catch((err) => {
            console.log(err);
        });
      } else {
        console.log(values);
        //Call API to update record
        axios.put(baseUrl+"module/"+module+"/"+deal_id, {values}).then((response) => {
          console.log("API record",response.data);
        }).catch((err) => {
            console.log(err);
        });
      }

    };
  
    return (
      <DashboardLayout>
        {/* <DashboardNavbar /> */}
        <MDBox py={3} mb={20} height="65vh">
          <Grid container justifyContent="center" alignItems="center" sx={{ height: "100%", mt: 8 }}>
            <Grid item xs={12} lg={8}>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, errors, touched, isSubmitting }) => (
                  <Form id={formId} autoComplete="off">
                    <Card sx={{ height: "100%" }}>
                      <MDBox p={3}>
                        <MDBox>
                          {getForms({
                            values,
                            touched,
                            formField,
                            errors,
                          })}
                          <MDBox mt={2} width="100%" display="flex" justifyContent="space-between">
                            <MDBox />
                            <MDButton
                              disabled={isSubmitting}
                              type="submit"
                              variant="gradient"
                              color="dark"
                            >
                              send
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

export default CreateForm;
