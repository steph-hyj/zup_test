import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import GridContainer from "../../components/Grid/GridContainer.js";
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Select, InputLabel } from "@material-ui/core";
import { Box } from "@mui/system";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import axios from "axios";
// core components
import styles from "../../assets/jss/style/components/tableStyle.js";

const useStyles = makeStyles(styles);

//Version dev
var baseUrl = "http://localhost:3000/server/crm_crud/";

//Version deployment
//var baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function CustomTable(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [roleName, setRoleName] = React.useState();
  const [moduleValue, setModuleValue] = React.useState('');
  const [moduleID, setModuleID] = React.useState('');
  const [roleID, setRoleID] = React.useState('');
  const [permissionID, setPermissionID] = React.useState('');
  const [app, setApp] = React.useState('');
  const [connection, setConnection] = React.useState('');
  const { tableHead, tableData, tableHeaderColor, tableApi, Module, App } = props;

  const handleClickOpen = (data) => {
    if(App === "rôle") {
      setModuleValue(data["Module_ID"]);
      setRoleName(data["Role_name"]);
      setRoleID(data["Role_ID"]);
      setPermissionID(data["Permission_ID"]);
    } else {
      setModuleValue(data["Module_name"]);
      setApp(data["Application"]);
      setConnection(data["Connection"]);
      setModuleID(data["ROWID"]);
    }
    
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeApp = (event) => {
    setApp(event.target.value);
  };

  const handleChange = (event) => {
    setRoleName(event.target.value);
  };

  const handleChangeModule = (event) => {
    setModuleValue(event.target.value);
  };

  const handleChangeCheckbox = (event) => {
    setConnection(event.target.checked);
  }

  function updateRole() {
    axios.put(baseUrl+"/updateRole", {
      roleID,
      roleName,
      moduleValue,
      permissionID
    }).then((response) => {
      console.log(response);
    }).catch((err)=> {
      console.log(err);
    })
  };

  function deleteRole(roleID) {
    axios.delete(baseUrl+"/deleteRole/"+roleID)
    .then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log(err);
    })
  }

  function updateConnection() {
    axios.put(baseUrl+"/updateConnection", {
      moduleID,
      moduleValue,
      connection,
      app
    }).then((response) => {
      console.log(response);
    }).catch((err)=> {
      console.log(err);
    })
  };

  function deleteConnection(moduleID) {
    axios.delete(baseUrl+"/deleteConnection/"+moduleID)
    .then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log(err);
    })
  }

  function editForm () {
    return (
      <>
      <DialogTitle> Modifier { App === "rôle" ? `le rôle : ${roleName}` : "la connexion"} </DialogTitle>
      <DialogContent>
        <FormControl sx={{ m: 1, minWidth: "90%" }} >
          { App === "rôle" ? 
            <>
              <TextField
                autoFocus
                margin="dense"
                id={roleID}
                label="Nom du role"
                type="text"
                fullWidth
                variant="standard"
                onChange={handleChange}
                value={roleName ? roleName : null}
              />
            </>
          : 
            <>
              <InputLabel id="app">Applications</InputLabel>
              <Select
                value={app}
                label="app"
                onChange={handleChangeApp}
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
            </>
          }
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
            {Module.map(moduleConnection => {
              if(App === "rôle") {
                return (
                  <MenuItem value={moduleConnection.Module.ROWID}>{moduleConnection.Module.Module_name}</MenuItem>
                )
              } else {
                return (
                  <MenuItem value={moduleConnection.api_name}>{moduleConnection.plural_label}</MenuItem>
                )
              }
            })}
            </Select>
          </FormControl>
          {App === "rôle" ?
            <></>
           :
            <FormControl sx={{ m: 1, minWidth: "90%" }} >
              <InputLabel id="connection">Connexion</InputLabel>
              <Checkbox checked={connection} onChange={handleChangeCheckbox}/>
            </FormControl>
          }
        </DialogContent>
        <DialogActions>
          <Button fullWidth color="error" variant="outlined" onClick={()=>handleClose()}>Annuler</Button>
          <Button fullWidth color="success" variant="outlined" onClick={App === "rôle" ? ()=>updateRole() : ()=>updateConnection()}>Modifier</Button>
        </DialogActions>
      </>
    )
  }

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => { 
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                {tableApi.map(api => {
                  if(api === "Connection") {
                    return (
                      <TableCell className={classes.tableCell} key={api}>
                          <Checkbox checked={prop[api]} disabled />
                      </TableCell>
                    )
                  } else if (api === "Update/Delete") {
                    return (
                      <>
                        <TableCell className={classes.tableCell} key={api}>
                            <IconButton aria-label="edit">
                              <ModeEditOutlineIcon onClick={() => handleClickOpen(prop)} /> 
                            </IconButton>
                            
                            <IconButton aria-label="delete">
                              <DeleteIcon onClick={App === "rôle" ? () => deleteRole(prop["Role_ID"]) : () => deleteConnection(prop["ROWID"])} />
                            </IconButton>
                        </TableCell>
                        <GridContainer>
                          <Box className={classes.box}>
                            <Dialog open={open} onClose={handleClose}>
                              {editForm()}
                            </Dialog>
                          </Box>
                        </GridContainer>
                      </>
                    )
                  } else {
                    return (
                      <TableCell className={classes.tableCell} key={api}>
                          {prop[api]}
                      </TableCell>
                    )
                  }
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
