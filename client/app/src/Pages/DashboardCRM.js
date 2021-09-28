import React from 'react';
import axios from 'axios';

import { Paper, styled, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { tableCellClasses } from '@mui/material';

var baseUrl = "http://localhost:3000/server/crm_crud/";

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
        moduleDetails: []
    }

    /**Execute the function when the component is called */
    componentDidMount = function(){
        axios.get(baseUrl+"module/checkModule").then((response) => {
            var moduleDetails = response.data.Module;
            this.setState({moduleDetails : moduleDetails});
        }).catch((err) => {
            console.log(err);
        })
    }

    /**Execute a function according to the action of switch */
    userUpdate = function(checked, scope,module) {
        if(checked.target.checked !== true)
        {
            //this.deleteModule(id);
        }
        else
        {
            this.addModule(scope,module);
        }
    }

    /**Check into datastore of Zoho Catalyst to set at default the switch  */
    setCheck = function(module) {
        var check = false;
        this.state.moduleDetails.forEach(moduleDetail => {
            if(moduleDetail.Module.Module_name === module) {
                check = true;
            }
        });
        return check;
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
    deleteModule = function(col) {
        axios.delete(baseUrl+"module/"+col).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    }

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
                        <TableBody>
                            {this.props.modules.map(module => (
                                <StyledTableRow>
                                    <TableCell>
                                        {module.plural_label}
                                    </TableCell>
                                    <TableCell>
                                    <Switch onChange={(checked) => this.userUpdate(checked,"Create",module.plural_label)}/>
                                    </TableCell>
                                    <TableCell>
                                    <Switch defaultChecked={this.setCheck(module.plural_label)} onChange={(checked) => this.userUpdate(checked,"Read",module.plural_label)}/>
                                    </TableCell>
                                    <TableCell>
                                    <Switch onChange={(checked) => this.userUpdate(checked,"Update",module.plural_label)}/>
                                    </TableCell>
                                    <TableCell>
                                    <Switch onChange={(checked) => this.userUpdate(checked,"Delete",module.plural_label)}/>
                                    </TableCell>
                                </StyledTableRow>
                            ))} 
                        </TableBody>
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