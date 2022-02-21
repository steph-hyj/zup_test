import { useState } from "react";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import EditIcon from '@mui/icons-material/Edit';
import Grid from "@mui/material/Grid";
import { Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import { Tooltip } from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import FormField from "../../../../layouts/CRMPage/ProfilePage/component/FormField";

function ProfileInfoCard({ title, description, info, social, action, shadow }) {
  
  const [open, setOpen] = useState(false);
  
  const labels = [];
  const values = [];

  // Convert this form `objectKey` of the object key in to this `object key`
  if(info) {
    Object.keys(info).forEach((el) => {
      // console.log(el);
      if(el !== "Update") {
        if (el.match(/[A-Z\s]+/)) {
          const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
          const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);
    
          labels.push(newElement);
        } else {
          labels.push(el);
        }
      }
    });
  
    // Push the object values into the values array
    Object.values(info).forEach((el) => {
      if(typeof el !== "function") {
        values.push(el);
      }
    });
  }

  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <MDBox key={label} display="flex" py={1} pr={2}>
      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
        {label}: &nbsp;
      </MDTypography>
      <MDTypography variant="button" fontWeight="regular" color="text">
        &nbsp;{values[key]}
      </MDTypography>
    </MDBox>
  ));

  //Open form
  const handleOpen = () => setOpen(true);

  //Close form
  const handleClose = () => setOpen(false);

  //Form's field
  const formField = labels.map((label, key) => (
    <Grid item xs={12} sm={6}>
      <FormField label={label} placeholder={values[key]} />
    </Grid>
  ));


  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={10}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        <MDBox
          display="flex"
          color="dark"
          sx={{ cursor: "pointer" }}
          onClick={handleOpen}
        >
          <Tooltip title={action.tooltip} placement="top">
            <EditIcon />
          </Tooltip>
        </MDBox>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Modification contact</DialogTitle>
          <DialogContent>
            <MDBox component="form" pb={3} px={3}>
              <Grid container spacing={2}>
                {formField}
              </Grid>
            </MDBox>
          </DialogContent>
          <DialogActions>
            <MDButton fullWidth color="error" onClick={handleClose} >Annuler</MDButton>
            <MDButton fullWidth color="success" >Modifier</MDButton>
          </DialogActions>
        </Dialog>
      </MDBox>
      <MDBox px={10}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox>
          {renderItems}
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
