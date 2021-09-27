import React from 'react';
import Typography from "@material-ui/core/Typography";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Switch } from '@material-ui/core';
import axios from 'axios';

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

/**Table cell Design */
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));

/**React Component => A detailed API reference */
class CRMPage extends React.Component {

    state = {
        open: false,
    };

    /**Get Related List data of specific module*/
    getRelatedData = function(){
        if(this.props.records.length > 0){
            this.props.records.forEach(record => {
                axios.get(baseUrl+"list/getListData/"+record.id).then((response)=> {

                }).catch((err) => {
                    console.log(err);
                })
            })
        }
    }

    /**Get key array */
    getKeys = function(){
        var col = [];
        Object.keys(this.props.records[0]).forEach(key => {
            this.props.columns.forEach(field => {
                if(key === field.Field.Field_name && this.props.module === field.Field.Module)
                {
                    col.push(key);
                }
            })
        })
        return col;
    }

    /**Set Table cell with getKeys*/
    getHeader = function(){
        var keys = this.getKeys();
        return keys.map((key)=>{
            return <StyledTableCell key={key}>{key.toUpperCase()}</StyledTableCell>
        })
    }

    /**Fill in the table with records */
    getRowsData = function(){
        var items = this.props.records;
        var keys = this.getKeys();
        return items.map((row)=>{
            return <StyledTableRow key={row.name}><RenderRow data={row} keys={keys}/></StyledTableRow>
        })
    }

    /**Execute a function according to the action of switch */
    userUpdate = function(checked, col,id,module) {
        if(checked.target.checked !== true)
        {
            this.deleteField(id);
        }
        else
        {
            this.addField(col,module);
        }
    }

    /**Check into datastore of Zoho Catalyst to set at default the switch  */
    setCheck = function(col, columns,module) {
        var checked = false;
        columns.forEach(columnDetail => {
            if(columnDetail.Field.Field_name === col && columnDetail.Field.Module === module) {
                checked = true;
            }
        })
        return checked;
    }

    /**Insert Into Field(Table) the col to display*/
    addField = function(Column,module) {
        axios.post(baseUrl+"record/"+Column, {
            Column,
            module
        }).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Delete from Field(Table) the col to hide*/
    deleteField = function(col) {
        axios.delete(baseUrl+"record/"+col).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Get from Field(Table) the col to display */
    getField = function(col,fields) {
        var id;
        fields.forEach(field => {
            if(field.Field.Field_name === col) {
                id = field.Field.ROWID;
            }
        });
        return id;
    }

    /**render() is mandatory if create a react component */
    render() {
        const records = this.props.records;
        if(records !== undefined)
        {
            if(this.props.role !== "App Administrator")
            {
                /**Customer's View */
                return (
                    <div>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        {records.length > 0 ? this.getHeader() : <Typography></Typography>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {records.length > 0 ? this.getRowsData() : <Typography></Typography>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                );
            }
            else
            {
                var column = [];
                for(var key in records[0])
                {
                    column.push(key);
                }
                /**Admin's View */
                return (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Nom champs</StyledTableCell>
                                    <StyledTableCell>Afficher</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {column.map(col => (
                                    <StyledTableRow>
                                        <TableCell>
                                            {col}
                                        </TableCell>
                                        <TableCell>
                                        <Switch
                                            onChange={(checked) => this.userUpdate(checked, col,this.getField(col,this.props.columns),this.props.module)}
                                            defaultChecked = {this.setCheck(col,this.props.columns,this.props.module)}
                                        />
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            }
        }
        else
        {
            /**Must have a return so if records is null return nothing */
            return(
                <Typography>
                </Typography>
            )
        }
    }
}


/**Data in Table Row */
const RenderRow = (props) =>{
    return props.keys.map(key=>{
        if(props.data[key] === null)
        {
            return <TableCell></TableCell>
        }
        else
        {
            return <TableCell key={props.data[key]}>{typeof props.data[key] == "string" ? props.data[key] : props.data[key].name}</TableCell>
        }
        
    })
}

export default CRMPage;