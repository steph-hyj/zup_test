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
import { Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select } from "@material-ui/core";
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import { Box } from "@mui/system";
import axios from "axios";
import { CircularProgress } from "@mui/material";


//Version dev
var baseUrl = "http://localhost:3000/server/crm_crud/";

//Version deployment
//var baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

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

export default function ConnectionPage(prop) {
  const classes = useStyles();
  const [app, setApp] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [modules, setModules] = React.useState('');
  const [moduleValue, setModuleValue] = React.useState('');
  const [done, setDone] = React.useState(undefined);
  const [moduleConnection, setModuleConnection] = React.useState('');

  useEffect(() => {

    /**Get Connection Module */
    axios.get(baseUrl+"getConnection").then((response) => {
      setModuleConnection(response.data.module);
    }).catch((err) => {
      console.log(err);
    });

    let modules = axios.get(baseUrl+"module").then((response)=>{ 
      return response.data.modules
    }).catch((err) => {
      console.log(err)
    });

    const moduleTab = [];

    modules.then((modules)=>{
      modules.forEach(module => {
          axios.get(baseUrl+"module/getFields/"+module.api_name).then((response) => {
              var status = response.data.status;
              if(!status) {
                  response.data.fields.forEach((field)=>{
                      if(field.api_name === "Email") {
                          moduleTab.push(module)
                      }
                  })
              }
              setModules(moduleTab);
          }).catch((err)=> {
              console.log(err);
          })
      });
    }).catch((err)=>{
        console.log(err);
    });


    setTimeout(() => {
      setDone(true);
    }, 2000);
  },[])
  
  const handleChange = (event) => {
    setApp(event.target.value);
  };

  const handleChangeModule = (event) => {
    setModuleValue(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getModule() {
    if(modules) {
      return(
        modules.map(module => {
          return <MenuItem value={module.api_name}>{module.plural_label}</MenuItem>
        })
      )
    }
  }

  /**Create Connection*/
  function createConnection() {
    const connection = true;
    axios.post(baseUrl+"createConnection", {
        app,
        moduleValue,
        connection
    }).then((response) => {
        console.log(response);
        setOpen(false);
    }).catch((err) => {
        console.log(err);
    });
  }

  /**Set table header */
  function setTableData() {
    const connectionTab = [];
    moduleConnection.forEach(module => {
      connectionTab.push(module.Module);
    })
    return connectionTab
  }

  return (
    <>
      {!done ? 
      (
        <Box sx={{ display: 'flex' }}>
        <CircularProgress />
        </Box>
      )
      :
      (
        <GridContainer>
          <Box className={classes.box}>
            <Button variant="outlined"
              startIcon={<AddIcon />}  
              onClick={handleClickOpen}
            >
              Créer une connexion
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Créer une connexion</DialogTitle>
              <DialogContent>
                <FormControl sx={{ m: 1, minWidth: "90%" }} >
                  <InputLabel id="app">Applications</InputLabel>
                  <Select
                    value={app}
                    label="app"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em> - Choisir une application - </em>
                    </MenuItem>
                    <MenuItem value="Zoho CRM">
                      Zoho CRM
                    </MenuItem>
                    <MenuItem value="Zoho Books">
                      Zoho Books
                    </MenuItem> 
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: "90%" }} >
                  <InputLabel id="module">Module</InputLabel>
                  <Select
                    value={moduleValue}
                    label="module"
                    onChange={handleChangeModule}
                  >
                    <MenuItem value="">
                      <em> - Choisir le module - </em>
                    </MenuItem>
                    {getModule()}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button fullWidth color="success" variant="contained" onClick={() => createConnection()}>Créer</Button>
                <Button fullWidth color="error" variant="contained" onClick={handleClose}>Annuler</Button>
              </DialogActions>
            </Dialog>
          </Box>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info">
                <h4 className={classes.cardTitleWhite}>{prop.title}</h4>
              </CardHeader>
              <CardBody>
                <Stack direction="row" spacing={2}>
                  <Button href="index.html#/role_permissions">Role</Button>
                </Stack>
                {moduleConnection ? 
                  <Table
                    tableHeaderColor="info"
                    tableHead={["Module","Application","Connexion", " "]}
                    tableData={setTableData()}
                    tableApi={["Module_name","Application","Connection", "Update/Delete"]}
                    Module={modules}
                    App={"connexion"}
                  />
                :
                  /**Loading */
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                  </Box>
                }
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </>
  );
}