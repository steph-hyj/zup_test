import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';

/**Import Page */
import CRMPage from './CRMPage';
import { Divider, withStyles } from '@material-ui/core';
import DashboardCRM from './DashboardCRM';

//Version dev
var baseUrl = "http://localhost:3000/server/crm_crud/";

//Version deployment
//var baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

/**NavbarCRM Design */
const styles = theme => ({
    navBar: {
      height: window.innerHeight - 64,
      float: 'left',
      width: '100%',
      maxWidth: 200,
      minWidth: 200,
      backgroundColor : '#226EB3',
      color: 'white',
      marginRight: '20px',
    },
    dashboard: {
      height: '100%',
      float: 'left',
      width: '100%',
      maxWidth : window.innerWidth,
      padding: '3%'
    },
    displayFlex: {
        display: 'flex'
    }
});

class NavCRM extends React.Component {

    state = {
        modules : [],
        column : [],
        records : [],
        moduleDetails : [],
        relatedList : [],
        fields : [],
        data : false,
        label : null,
        moduleAPI : null,
        relatedListAPI : null,
        userID : null,
    }

    /**Execute the function when the component is called */
    componentDidMount() {
        axios.get(baseUrl+"module").then((response) => {
            const modulesData = response.data.modules;
            this.setState({modules : modulesData});
        }).catch((err) => {
            console.log(err);
        });
        this.getModule();
    }

    /**Onclick action */
   handleClick(data) {
        this.setState ({ data : data});
    }

    setData(module) {

        let userID = axios.get(baseUrl+"getUserZohoID/"+this.props.userEmail).then((response) => {
                        return response.data.data[0]
                    }).catch((err) => {
                        console.log(err);
                    });

        let fields = axios.get(baseUrl+'module/getFields/'+module.api_name).then((response) => {
            this.setState({ fields : response.data.fields});
            return response.data.fields
        }).catch((err) => {
            console.log(err)
        })
        this.setState({ label : module.plural_label });
        if(this.props.userRole === "App Administrator") {
            /**Get All records data of specific module */
            axios.get(baseUrl+"module/getRecords/"+module.api_name).then((response) => {
                const recordsData = response.data.data;
                this.setState ({ records : recordsData });
            }).catch((err) => {
                console.log(err);
            });
        }
        else
        {
            if(module.api_name === "Accounts") {
                var parentModule = "Accounts"
                var field = "id"
                userID.then((userID) => {
                    /**Get user's records data of specific module */
                    axios.get(baseUrl+"module/"+parentModule+"/"+field+"/"+userID.Account_Name.id).then((response) => {
                        const recordsData = response.data.data;
                        this.setState ({ records : recordsData });
                    }).catch((err) => {
                        console.log(err);
                    });
                })
            } else {
                fields.then((fields) => {
                    var fieldTab = [];
                    fields.forEach((field) => {
                        if(field.api_name === "Email" || field.api_name === "Contact_Name") {
                            fieldTab.push(field.api_name);
                        }
                    })
                    console.log(fieldTab);
                    if(fieldTab.length === 0) {
                        /**Get All records data of specific module */
                        axios.get(baseUrl+"module/getRecords/"+module.api_name).then((response) => {
                            const recordsData = response.data.data;
                            this.setState ({ records : recordsData });
                        }).catch((err) => {
                            console.log(err);
                        });
                    } else {
                        if(fieldTab[0] === "Email") {
                            /**Get user's records data of specific module*/ 
                            axios.get(baseUrl+"module/"+module.api_name+"/"+fieldTab[0]+"/"+this.props.userEmail).then((response) => {
                                const recordsData = response.data.data;
                                this.setState ({ records : recordsData });
                            }).catch((err) => {
                                console.log(err);
                            });
                        } else if(fieldTab[0] === "Contact_Name") {
                            userID.then((userID) => {
                                /**Get user's records data of specific module */
                                axios.get(baseUrl+"module/"+module.api_name+"/"+fieldTab[0]+"/"+userID.id).then((response) => {
                                    const recordsData = response.data.data;
                                    console.log(recordsData);
                                    this.setState ({ records : recordsData });
                                }).catch((err) => {
                                    console.log(err);
                                });
                            })
                        }
                    }
                });
            }
        }
         /**Get Related List of specific module */
         axios.get(baseUrl+"list/getRelatedList/"+module.api_name).then((response)=> {
            this.setState({relatedList : response.data.related_lists, moduleAPI : module.api_name});
        }).catch((err) => {
            console.log(err);
        });

        /**Check Column for records tab */
        axios.get(baseUrl+"record/checkColumn/"+module.plural_label).then((response) => {
            this.setState({ column : response.data.Field });
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Get module dto display */
    getModule() {
        axios.get(baseUrl+"module/checkModule").then((response) => {
            response.data.Module.forEach((moduleDetails) => {
                if(moduleDetails.Module.Scope === "Read") {
                    this.setState({ moduleDetails : response.data.Module});
                }
            })
        }).catch((err) => {
            console.log(err);
        })
    }

    /**Get Related List data of specific module*/
    getRelatedData = function(relatedListAPI,module,relatedListDisplay){
        if(this.state.records.length > 0){
            this.state.records.forEach(record => {
                axios.get(baseUrl+"list/getListData/"+record.id+"/"+module+"/"+relatedListAPI).then((response)=> {
                    this.setState({ records : response.data.data, label : relatedListDisplay})
                }).catch((err) => {
                    console.log(err);
                })
            })
        }
    }

    render() {
        const { classes, theme } = this.props;
        const modules = this.state.modules;
        var mod = [];
        if(this.state.moduleDetails !== undefined) {
            modules.forEach(module => {
                this.state.moduleDetails.forEach(key => {
                    if(key.Module.Scope === "Read") {
                        if(key.Module.Module_name === module.plural_label) {
                            if(module.api_name !== "Home") {
                                mod.push(module)
                            }
                        }
                    }
                })
            });
        }
        if(modules)
        {
            return (
                <div className={classes.displayFlex}>
                    <div className={classes.navBar}>
                        <List component="nav">
                            <ListItem button onClick={() => {
                                    this.getModule();
                                    this.handleClick(false);
                                }}>
                                    {this.props.userRole === "App Administrator" ? <ListItemText primary={"CRM"}/> : <ListItemText primary={"Dashboard"}/> }
                            </ListItem>
                            <Divider />
                            {mod.map(module => (
                                <ListItem button onClick={() => {
                                    this.setData(module);
                                    this.handleClick(true);
                                }}>
                                    <ListItemText primary={module.plural_label}/>
                                </ListItem>
                            ))}
                            <Divider />
                        </List>
                    </div>
                    <div className={classes.dashboard}>
                        {this.state.data ? <h2>{this.state.label}</h2> : <h2>Tableau de bord</h2>}
                        {this.state.data ? 
                        <CRMPage fields={this.state.fields} role={this.props.userRole} records={this.state.records} module={this.state.label} moduleAPI={this.state.moduleAPI} columns={this.state.column}/> : 
                        <DashboardCRM modules={modules} moduleDetails={this.state.moduleDetails} role={this.props.userRole} />}
                    </div>
                </div>
            );
        }
        else
        {
            return (
                <List component="nav">
                    <ListItem button>
                        <ListItemText primary="" />
                    </ListItem>
                </List>
            );
        }
    }
}

export default withStyles(styles, { withTheme: true })(NavCRM);