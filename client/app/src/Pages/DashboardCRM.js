import React from 'react';
import axios from 'axios';

import { Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Box ,CircularProgress, tableCellClasses, Switch } from '@mui/material';

//Version dev
var baseUrl = "http://localhost:3000/server/crm_crud/";

//Version deployment
//var baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

/**Table Row Design */
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
}));

/**Table Cell Design */
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));

class DashboardCRM extends React.Component {

    state = {
        moduleDetails: [],
    }

    /**Execute a function according to the action of switch */
    userUpdate = function(checked, scope,module,moduleID) {
        if(checked.target.checked !== true)
        {
            this.deleteModule(moduleID);
        }
        else
        {
            this.addModule(scope,module);
        }
    }
    
    /**Insert Into Module(Table) the module to display*/
    addModule = function(scope,module) {
        axios.post(baseUrl+"module/"+module, {
            scope,
            module
        }).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Delete from Module(Table) the module to hide*/
    deleteModule = function(moduleID) {
        moduleID.then((moduleID) => {
            axios.delete(baseUrl+"module/"+moduleID).then((response) => {
                console.log(response);
            }).catch((err) => {
                console.log(err);
            });
        })
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

    getCheck = function(modules, moduleScope) {
        var boolean = false;
        try {
            modules.forEach((module) => {
                var moduleData = module.Module.Module_name + module.Module.Scope;
                if(moduleData === moduleScope) {
                    boolean = true;
                    throw boolean;
                }
            })
        }catch(e) {
            console.log(boolean);
        }
        return boolean
        //return this.state[module];
    }

    handleChange = function(event, name,scope) {
        this.setState({ [name+scope]: event.target.checked });
    };

    render() {
        if(this.props.role === "App Administrator") {
            return (
                <TableContainer component={Paper}>
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
                                            <Switch defaultChecked={this.getCheck(this.props.moduleDetails,module.plural_label + "Create")}
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
                                            <Switch defaultChecked={this.getCheck(this.props.moduleDetails,module.plural_label + "Read")}
                                                    checked={this.state[module.plural_label + "Read"]}
                                                    onClick={(checked) => {
                                                        this.handleChange(checked,module.plural_label,"Read")
                                                        this.userUpdate(checked,"Read",module.plural_label,this.getIDModule("Read",module.plural_label))
                                                    }}
                                                    value= {module.plural_label + "Read"}
                                                    color="success" 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Switch defaultChecked={this.getCheck(this.props.moduleDetails,module.plural_label + "Update")}
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
                                            <Switch defaultChecked={this.getCheck(this.props.moduleDetails,module.plural_label + "Delete")}
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
                            </TableBody>
                        :
                            /**Loading */
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress />
                            </Box>
                        }
                    </Table>
                </TableContainer>
            );
        }
        else
        {
            return <div></div>
        }
    }
}

export default DashboardCRM;