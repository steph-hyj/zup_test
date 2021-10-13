import React from 'react';
import axios from 'axios';

//import { Paper, styled, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
//import { Box , tableCellClasses, Switch } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';

// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import AdminDashboardTable from "../../components/Table/AdminDashboardTable.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";

import {  InputLabel } from "@material-ui/core";
import FormControl from '@mui/material/FormControl';
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

class AdminDashboardPage extends React.Component {

    state = {
        moduleDetails: [],
        role: null,
        roles: [],
        permissions: []
    }

    componentDidMount() {
        axios.get(baseUrl+"getRoles").then((response)=>{ 
            this.setState({role : response.data.Role});
        }).catch((err) => {
            console.log(err)
        });
    }


    /**Execute a function according to the action of switch */
    userUpdate = function(checked,permission,role,module,moduleID) {
        if(checked.target.checked !== true)
        {
            this.deleteModule(moduleID);
        }
        else
        {
            this.addModule(permission,role,module);
        }
    }
    
    /**Insert Into Module(Table) the module to display*/
    addModule = function(permission, role,module) {
        axios.post(baseUrl+"module/"+module, {
            role,
            permission
        }).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Delete from Module(Table) the module to hide*/
    deleteModule = function(moduleID) {
        axios.delete(baseUrl+"module/"+moduleID).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Get from Module(Table) the col to display */
    getIDModule = function(scope,module) {
        let moduleCol = axios.get(baseUrl+"module/checkModule").then((response) => {
            return response.data.Module;
        }).catch((err) => {
            console.log(err);
        });
        let moduleID = moduleCol.then((modules) => {
            var id;
            modules.forEach(mod => {
                if(mod.Module.Module_name === module && scope === mod.Module.Scope) {
                    id = mod.Module.ROWID;
                }
            })
            return id;
        }).catch((err) => {
            console.log(err);
        })
        return moduleID;
    }

    getCheck = function(permissions,moduleDetails) {
        permissions.forEach((permission) => {
            moduleDetails.forEach(moduleDetail => {
                const module = moduleDetail[0].Module.Module_name;
                const scope = permission.Role_Permission.Permission;
                this.setState({[module + scope] : true, [module + scope + "ID"] : permission.Role_Permission.Module_ID})
            })
        })
    }

    handleChange = function(event, name,scope) {
        this.setState({ [name+scope]: event.target.checked });
    };

    handleSelectChange = function(event) {
        this.setState({ roles: event.target.value });
    };

    getRoles = function() {
        if(this.state.role) {
          return (
            this.state.role.map(role => {
              return <MenuItem  value={role.Role.ROWID} 
                                onClick={() => this.getPermissions(role.Role.ROWID)}
                     >
                         {role.Role.Role_name}
                     </MenuItem>
            })
          )
        }
    };

    getPermissions = function(roleId) {
        let permissions = axios.get(baseUrl+"module/getPermissions/"+roleId).then((response) => {
            return response.data;
        }).catch((err) => {
            console.log(err);
        });
        permissions.then((permission) => {
            this.getCheck(permission.Permissions,permission.Module)
        }).catch((err) => {
            console.log(err);
        })
    }

    render() {
        if(this.props.role === "App Administrator") {
            return (
                <GridContainer>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="role">Role</InputLabel>
                        <Select
                        labelId="role"
                        id="role"
                        value={this.state.roles}
                        onChange={(event)=>this.handleSelectChange(event)}
                        label="Role"
                        >
                        <MenuItem value="">
                            <em> - Choisir un role - </em>
                        </MenuItem>
                        {this.getRoles()}
                        </Select>
                    </FormControl>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="info">
                                <h4 className={styles.cardTitleWhite}>Tableau de bord</h4>
                            </CardHeader>
                            <CardBody> 
                                <AdminDashboardTable
                                    tableHeaderColor="info"
                                    tableHead={["Nom champs","Créer","Afficher","Modifier","Supprimer"]}
                                    tableData={this.props.modules}
                                    tableSwitch={this.state}
                                    tableApi={["plural_label","Create","Read","Update","Delete"]}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            );
        }
        else
        {
            return <div></div>
        }
    }
}
/*<TableContainer component={Paper}>
    <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
            <TableRow>
                <StyledTableCell>Nom champs</StyledTableCell>
                <StyledTableCell>Créer</StyledTableCell>
                <StyledTableCell>Afficher</StyledTableCell>
                <StyledTableCell>Modifier</StyledTableCell>
                <StyledTableCell>Supprimer</StyledTableCell>
            </TableRow>
        </TableHead>
        {this.props.modules ?
            <TableBody>
                {this.props.modules.map(module => (
                    <StyledTableRow>
                        <TableCell>
                            {module.plural_label}
                        </TableCell>
                        <TableCell>
                            <Switch //defaultChecked={this.getCheck(this.props.moduleDetails,module.plural_label + "Create")}
                                    checked={this.state[module.plural_label + "Create"]}
                                    onChange={(checked) => {
                                        this.handleChange(checked,module.plural_label,"Create")
                                        this.userUpdate(checked,"Create",module.plural_label,this.getIDModule("Create",module.plural_label))
                                    }}
                                    value= {module.plural_label + "Create"}
                                    color="success"
                            />
                        </TableCell>
                        <TableCell>
                            <Switch //defaultChecked={this.getCheck(this.state.permissions,this.state.moduleDetails,module.plural_label, "Read")}
                                    checked={this.state[module.plural_label + "Read"]}
                                    onClick={(checked) => {
                                        this.handleChange(checked,module.plural_label,"Read")
                                        this.userUpdate(checked,"Read",this.state.roles,module.plural_label,this.state[module.plural_label + "ReadID"])
                                    }}
                                    value= {module.plural_label + "Read"}
                                    color="success"
                            />
                        </TableCell>
                        <TableCell>
                            <Switch //defaultChecked={this.getCheck(this.props.moduleDetails,module.plural_label + "Update")}
                                    checked={this.state[module.plural_label + "Update"]}
                                    onChange={(checked) => {
                                        this.handleChange(checked,module.plural_label,"Update")
                                        this.userUpdate(checked,"Update",module.plural_label,this.getIDModule("Update",module.plural_label))
                                    }}
                                    value= {module.plural_label + "Update"}
                                    color="success" 
                            />
                        </TableCell>
                        <TableCell>
                            <Switch //defaultChecked={this.getCheck(this.props.moduleDetails,module.plural_label + "Delete")}
                                    checked={this.state[module.plural_label]}
                                    onChange={(checked) => {
                                        this.handleChange(checked,module.plural_label,"Delete")
                                        this.userUpdate(checked,"Delete",module.plural_label,this.getIDModule("Delete",module.plural_label))
                                    }}
                                    value= {module.plural_label + "Delete"}
                                    color="success" 
                            />
                        </TableCell>
                    </StyledTableRow>
                ))} 
            </TableBody></Table></TableContainer>
        :
            /**Loading 
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        }
*/
export default AdminDashboardPage;