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
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Select, InputLabel } from "@material-ui/core";
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
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

export default function UsersPage() {
    const classes = useStyles();
    //-----CREATION CONST
    // const [get-User, set-USer] = React.useState('');
    const [roles, setRoles] = React.useState('');
    //Pop-up formulaire
    const [done, setDone] = React.useState(undefined);
    const [open, setOpen] = React.useState(false);
    // Variable - formulaire
    const [roleName, setRoleName] = React.useState('');
    const [modules, setModules] = React.useState('');
    const [moduleValue, setModuleValue] = React.useState('');

    //Appel automatique de l'api(avec axios) au moment de l'arriver
    useEffect(() => {
        axios.get(baseUrl+"getRoles").then((response)=>{
            setRoles(response.data.Role);
        }).catch((err) => {
            console.log(err)
        });

        //Temps de chargmnt
        setTimeout(() => {
            setDone(true);
        }, 3000);
    },[])

    //onclick affiche popup
    const handleClickOpen = () => {
        setOpen(true);
    };

    //onclick close popup
    const handleClose = () => {
        setOpen(false);
    };

    //Récup nom role - formulaire
    const handleChange = (event) => {
        setRoleName(event.target.value);
    };

    //Récup module contenant email, liste déroulante - formulaire
    function getModule() {
        if(modules) {
            return(
                modules.map(module => {
                    return <MenuItem value={module.api_name}>{module.plural_label}</MenuItem>
                })
            )
        }
    }

    //recup choix module
    const handleChangeModule = (event) => {
        setModuleValue(event.target.value);
    };

    //Enregistrement Role ds API
    function createRole() {
        axios.post(baseUrl+'createRole',{
            roleName
        }).then((response)=> {
            console.log(response);
            setOpen(false);
        }).catch((err) => {
            console.log(err);
        })
    };

    //Création tableau
    function setTableData() {
        const roleTab = [];
        roles.forEach(role => {
            roleTab.push(role.Role);
        })
        return roleTab
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
                                Créer un role
                            </Button>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Créer un role</DialogTitle>
                                <DialogContent>
                                    <FormControl sx={{ m: 1, minWidth: "90%" }} >
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
                                    <Button fullWidth onClick={()=>createRole()}>Créer</Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card>
                                <CardHeader color="info">
                                    <h4 className={classes.cardTitleWhite}>Role & Permission</h4>
                                </CardHeader>
                                <CardBody>
                                    <Stack direction="row" spacing={2}>
                                        <Button href="index.html#/connection">Connexion</Button>
                                    </Stack>
                                    {roles ?
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={["Role", "Module"]}
                                            tableData={setTableData()}
                                            tableApi={["Role_name","Module_Name"]}
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
