// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
// import MDInput from "../../../../components/MDInput";

// formik components
// import { ErrorMessage, Field } from "formik";

// NewUser page components
import FormField from "../FormField";

function FormInfo({ formData }) {
  // const { formField, values, errors, touched } = formData;
  const { formField } = formData;
  const fieldArray = [];

  for (let i = 0; i < Object.keys(formField).length; i++) {
    fieldArray.push(formField[i]);
  }

  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">About me</MDTypography>
        <MDTypography variant="button" color="text">
          Mandatory informations
        </MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <FormField
          fieldData = {fieldArray}
        />
      </MDBox>
    </MDBox>
  );
}

// typechecking props for UserInfo
FormInfo.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default FormInfo;
