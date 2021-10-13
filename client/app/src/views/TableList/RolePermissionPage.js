import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/Table.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@material-ui/core";
import AddIcon from '@mui/icons-material/Add';
import { Box } from "@mui/system";
import axios from "axios";


var baseUrl = "http://localhost:3000/server/crm_crud/";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  box: {
    minWidth: "95%",
    margin: "40px",
    textAlign: "right"
  },
};

const useStyles = makeStyles(styles);

export default function RolePermissionPage() {
  const classes = useStyles();
  const [roles, setRoles] = React.useState('');
  const [roleName, setRoleName] = React.useState('');
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    axios.get(baseUrl+"getRoles").then((response)=>{ 
      setRoles(response.data.Role);
    }).catch((err) => {
      console.log(err)
    });
  },[])

  const handleChange = (event) => {
    setRoleName(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getRole() {
    if(roles) {
      console.log(roles);
      return (
        roles.map(role => {
          return <MenuItem value={role.Role.ROWID}>{role.Role.Role_name}</MenuItem>
        })
      )
    }
  };

  function createRole() {
    axios.post(baseUrl+'createRole',{
      roleName
    }).then((response)=> {
      console.log(response);
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <GridContainer>
      <Box className={classes.box}>
        <Button variant="outlined"
                startIcon={<AddIcon />}  
                onClick={handleClickOpen}
          >
          Créer un role
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Créer un role</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="role_name"
              label="Nom du role"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button fullWidth onClick={()=>createRole()}>Créer</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Simple Table</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
          <Stack direction="row" spacing={2}>
            <Button href="index.html#/connection">Connexion</Button>
          </Stack>
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "Country", "City", "Salary"]}
              /*tableData={[
                ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
                ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
                ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
                ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
                ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
                ["Mason Porter", "Chile", "Gloucester", "$78,615"],
              ]}*/
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
