import React, { useEffect, useState } from 'react';
import Typography from "@material-ui/core/Typography";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@material-ui/core';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import CreatePage from './CreatePage';

//Version Dev
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
        showForm: false,
        fields : []
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
            this.props.columns.forEach(column => {
                if(key === column.Field.Field_name && this.props.module === column.Field.Module)
                {
                    this.props.fields.forEach(fields => {
                        if(key === fields.api_name) {
                            console.log(fields.display_label);
                            col.push(fields);
                        }
                    })
                }
            })
        })
        return col;
    }

    /**Set Table cell with getKeys*/
    getHeader = function(){
        var keys = this.getKeys();
        return keys.map((key)=>{
            return <StyledTableCell key={key.api_name}>{key.display_label.toUpperCase()}</StyledTableCell>
        })
    }

    /**Fill in the table with records */
    getRowsData = function(column){
        if(this.props.role !== "App Administrator") {
            var items = this.props.records;
            var keys = this.getKeys();
            return items.map((row)=>{
                return <StyledTableRow key={row.name}><RenderRow data={row} role={this.props.role} keys={keys}/></StyledTableRow>
            })
        } else {
            var cols = ["Nom","Afficher"];
            return column.map((row)=>{
                return <StyledTableRow key={row}><RenderRow data={row} module={this.props.module} role={this.props.role} columns={this.props.columns} keys={cols}/></StyledTableRow>
            })
        }
    }

    showForm = function(boolean) {
        this.setState({ showForm : boolean })
    }

    getFields = function() {
        axios.get(baseUrl+"module/getFields/"+this.props.moduleAPI).then((response) => {
            console.log(response.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    getCheck = function(columns, col) {
        var boolean = false;
        try {
            columns.forEach((column) => {
                if(column.Field.Field_name === col) {
                    boolean = true;
                    throw boolean;
                }
            })
        } catch(e) {
            console.log(e)
        }
        this.setState({[col] : boolean}) 
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
                        {this.state.showForm ? 
                            <div>
                                <Stack  sx={{ m: 2 }} direction="row">
                                    <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => this.showForm(false)}>
                                        Return
                                    </Button>
                                </Stack>
                                <CreatePage /> 
                            </div>
                        : 
                            <div>
                                <Stack  sx={{ m: 2 }} direction="row">
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                                            this.showForm(true)
                                            this.getFields()
                                    }}>
                                        Create
                                    </Button>
                                </Stack>
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
                        }
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
                                {this.getRowsData(column)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            }
        }
        else
        {
            /**Loading */
            return(
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            )
        }
    }
}


/**Data in Table Row */
const RenderRow = (props) =>{

    const [state, setState] = useState([]);

    useEffect(() => {
        if(props.role === "App Administrator") {
        /**Check if it's ticked */
        function getCheck() {
            var boolean = false;
            props.columns.forEach((column) => {
                if(column.Field.Field_name === props.data) {
                    boolean = true;
                }
            })
            return boolean
        }
        setState({[props.data] : getCheck()});  
    }
    },[props.data, props.role,props.columns]);

    /**Change switch */
    function handleChange(event, name) {
        setState({ [name]: event.target.checked });
        console.log(state[name]);
    }

    /**Execute a function according to the action of switch */
    function userUpdate(checked, col, fieldID, module) {
        if(checked.target.checked !== true)
        {
            deleteField(fieldID);
        }
        else
        {
            addField(col,module);
        }
    }

    /**Insert Into Field(Table) the col to display*/
    function addField(Column, module) {
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
    function deleteField(fieldID) {
        fieldID.then((fieldID) => {
            axios.delete(baseUrl+"record/"+fieldID).then((response) => {
                console.log(response);
            }).catch((err) => {
                console.log(err);
            });
        })
    }

    /**Get from Field(Table) the col to display */
    function getIDField(col) {
        let fieldsCol = axios.get(baseUrl+"record/checkColumn/"+props.module).then((response) => {
            return response.data.Field;
        }).catch((err) => {
            console.log(err);
        });
        let fieldID = fieldsCol.then((fields) => {
            var id;
            fields.forEach(field => {
                if(field.Field.Field_name === col) {
                    id = field.Field.ROWID;
                }
            })
            return id;
        }).catch((err) => {
            console.log(err);
        })
        return fieldID;
    }

    if(props.role !== "App Administrator") {
        return props.keys.map(key=>{
            if(props.data[key.api_name] === null)
            {
                return <TableCell></TableCell>
            } else {
                return <TableCell key={props.data[key.api_name]}>{typeof props.data[key.api_name] == "string" ? props.data[key.api_name] : props.data[key.api_name].name}</TableCell>
            }
            
        })
    } else {
        return props.keys.map(key => {
            if(props.keys.indexOf(key) === 0) {
                return <TableCell>{props.data}</TableCell>
            } else {
                return (
                    <TableCell>
                    {state[props.data] !== undefined ? 
                        <Switch checked={state[props.data]}
                                onChange={(event) => {
                                    handleChange(event, props.data)
                                    userUpdate(event, props.data,getIDField(props.data),props.module)
                                }}
                                color="success" 
                        />
                    :
                        /**Loading */
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    }
                    </TableCell>
                
                )
            }
            
        })
    }
}

export default CRMPage;