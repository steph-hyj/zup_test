import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Select, InputLabel } from "@material-ui/core";
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/TableUser.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";

import axios from "axios";

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

export default function RolePermissionPage() {
    const classes = useStyles();
    const [roleName, setRoleName] = React.useState('');
    const [userPage, setUserPage] = React.useState();
    const [modulesConnection, setModulesConnection] = React.useState('');
    const [last_name, setUserName] = React.useState('');
    const [first_name, setUserFirstName] = React.useState('');
    const [email_id, setUserEmail] = React.useState('');
    const [role_id, setRoleValue] = React.useState('');
    const [moduleValue, setModuleValue] = React.useState('');
    const [done, setDone] = React.useState(undefined);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        axios.get(baseUrl+"getRoles").then((response)=>{
            setUserPage(response.data.ModuleRole);
        }).catch((err) => {
            console.log(err)
        });

        /**Get Connection Module */
        axios.get(baseUrl+"getConnection").then((response) => {
            setModulesConnection(response.data.module);
        }).catch((err) => {
            console.log(err);
        });

        setTimeout(() => {
            setDone(true);
        }, 2000);

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

    const handleChangeModule = (event) => {
        setModuleValue(event.target.value);
    };

    const handleChangeName = (event) => {
        setUserName(event.target.value);
    }

    const handleChangeEmail = (event) => {
        setUserEmail(event.target.value);
    }

    const handleChangeFirstName = (event) => {
        setUserFirstName(event.target.value);
    }

    const handleChangeRole = (event) => {
        setRoleValue(event.target.value);
    }

    function createUser() {
        axios.post(baseUrl+'createUser',{
            last_name,
            first_name,
            email_id,
            role_id,
        }).then((response)=> {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
        setOpen(false);
    };

    function getModule() {
        if(modulesConnection) {
            return(
                modulesConnection.map(moduleConnection => {
                    return <MenuItem value={moduleConnection.Module.ROWID}>{moduleConnection.Module.Module_name}</MenuItem>
                })
            )
        }
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
                                Créer un utilisateur
                            </Button>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Créer un utilisateur</DialogTitle>
                                <DialogContent>
                                    <FormControl sx={{ m: 1, minWidth: "90%" }} >
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="roleName"
                                            label="Nom du role"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: "90%" }} >
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="last_name"
                                            label="Nom"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            onChange={handleChangeName}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: "90%" }} >
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="first_name"
                                            label="Prénom"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            onChange={handleChangeFirstName}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: "90%" }} >
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="email_id"
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            variant="standard"
                                            onChange={handleChangeEmail}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: "90%" }} >
                                        <InputLabel id="module">Role</InputLabel>
                                        <Select
                                            value={role_id}
                                            label="module"
                                            onChange={handleChangeRole}
                                        >
                                            <MenuItem value="">
                                                <em> - Choisir le role - </em>
                                            </MenuItem>
                                            {getModule()}
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
                                    <Button fullWidth color="error" onClick={handleClose}>Annuler</Button>
                                    <Button fullWidth color="success" onClick={()=>createUser()}>Créer</Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card>
                                <CardHeader color="info">
                                    <h4 className={classes.cardTitleWhite}>Liste des utilisateurs</h4>
                                </CardHeader>
                                <CardBody>
                                    {userPage ?
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={["Nom", "Prénom","Email", "Module", "Rôle", "Actions"]}
                                            tableData={userPage}
                                            tableApi={[" ", " ", " ", "Module_name", "Role_name", "Update/Delete"]}
                                            Module = {modulesConnection}
                                            App = {"rôle"}
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
