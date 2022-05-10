// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// formik components
import { ErrorMessage, Field } from "formik";

// Material Dashboard 2 PRO React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDInput from "../../../../components/MDInput";

function FormField({ fieldData }) {

  return(
    fieldData.map(field => {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <MDBox mb={1.5}>
              <Field type={field.type} placeholder={field.placeholder} name={field.name} id={field.name} defaultValue={field.value} 
                     as={MDInput} variant="standard" label={field.label} fullWidth />
              <MDBox mt={0.75}>
                <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  <ErrorMessage name={field.name} />
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      );
    })
  )
}

// typechecking props for FormField
FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default FormField;
