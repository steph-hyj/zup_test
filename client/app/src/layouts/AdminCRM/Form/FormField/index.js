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
import { Autocomplete, TextField } from "@mui/material";

function selectReturn(field, setFieldValue, handleChange, values, multiple) {
  return(
    <Autocomplete
      multiple={multiple}
      id={field.name}
      name={field.name}
      options={field.options}
      getOptionLabel={(option) => option.name}
      onChange={(event, value) => {
        setFieldValue([field.label], field.type === "select" ? value.value : value);
      }}
      renderInput={(params) => <TextField
        onChange={handleChange}
        variant="standard"
        value={values?.module}
        label={field.label}
        fullWidth
        InputLabelProps={{ shrink: true }}
        {...params}
      />}
    />
  )
}

function checkboxReturn(field) {
  return (
    <>
      <MDBox mt={0.75}>
        <MDTypography component="div" variant="standard" color="error" fontWeight="regular">
          {field.name}
        </MDTypography>
      </MDBox>
      <Field type={field.type}
              name={field.name}
              id={field.name}
              variant="standard"
              label={field.label}
              fullWidth
        />
    </>
  );
}

function inputReturn(field) {
  return (
    <>
      <Field type={field.type} placeholder={field.placeholder} name={field.name} id={field.name} defaultValue={field.value}
              as={MDInput} variant="standard" label={field.label} fullWidth />
      <MDBox mt={0.75}>
        <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
          <ErrorMessage name={field.name} />
        </MDTypography>
      </MDBox>
    </>
  );
}

function FormField({ fieldData, setFieldValue, handleChange, values }) {

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MDBox mb={1.5}>
          {
            fieldData.map(field => {
              if(field.type === "select") {
                return selectReturn(field, setFieldValue, handleChange, values);
              } else if(field.type === "checkbox"){
                return checkboxReturn(field);
              } else if(field.type === "multiSelect") {
                return selectReturn(field, setFieldValue, handleChange, values, true);
              } else {
                return inputReturn(field);
              }
            })
          }
        </MDBox>
      </Grid>
    </Grid>
  )

  }

// typechecking props for FormField
FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default FormField;
