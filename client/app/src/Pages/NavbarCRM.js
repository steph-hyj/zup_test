import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';

/**Import Page */
import CRMPage from './CRMPage';
import { Divider, withStyles } from '@material-ui/core';
import DashboardCRM from './DashboardCRM';

var baseUrl = "http://localhost:3000/server/crm_crud/";

/**NavbarCRM Design */
const styles = theme => ({
    navBar: {
      height: '100%',
      float: 'left',
      width: '100%',
      maxWidth: 200,
      minWidth: 200,
      backgroundColor : 'white',
      marginRight: '20px',
    },
    dashbord: {
      height: '100%',
      float: 'left',
      width: '100%',
      maxWidth : window.innerWidth
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
        data : false,
        label : null,
        moduleAPI : null,
        relatedListAPI : null,
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


    setData(data, label) {
        this.setState({ label : label });
        if(this.props.userRole === "App Administrator") {
            /**Get All records data of specific module */
            axios.get(baseUrl+"module/getRecords/"+data).then((response) => {
                const recordsData = response.data.data;
                this.setState ({ records : recordsData });
            }).catch((err) => {
                console.log(err);
            });
        }
        else
        {
            /**Get user's records data of specific module */
            axios.get(baseUrl+"module/"+data+"/"+this.props.userEmail).then((response) => {
                const recordsData = response.data.data;
                this.setState ({ records : recordsData });
            }).catch((err) => {
                console.log(err);
            });
        }

         /**Get Related List of specific module */
         axios.get(baseUrl+"list/getRelatedList/"+data).then((response)=> {
            this.setState({relatedList : response.data.related_lists, moduleAPI : data});
        }).catch((err) => {
            console.log(err);
        });

        /**Check Column for records tab */
        axios.get(baseUrl+"record/checkColumn/"+label).then((response) => {
            console.log(response);
            this.setState({ column : response.data.Field });
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Get module dto display */
    getModule() {
        axios.get(baseUrl+"module/checkModule").then((response) => {
            this.setState({ moduleDetails : response.data.Module});
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
        if(modules !== undefined && this.state.moduleDetails !== undefined) {
            modules.forEach(module => {
                this.state.moduleDetails.forEach(key => {
                    if(key.Module.Module_name === module.plural_label)
                    {
                        mod.push(module);
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
                                    <ListItemText primary={"CRM"}/>
                            </ListItem>
                            <Divider />
                            {mod.map(module => (
                                <ListItem button onClick={() => {
                                    this.setData(module.api_name, module.plural_label);
                                    this.handleClick(true);
                                }}>
                                    <ListItemText primary={module.plural_label}/>
                                </ListItem>
                            ))}
                            <Divider />
                            {this.state.relatedList.map(relatedList => (
                                <ListItem button onClick={() => {
                                    this.getRelatedData(relatedList.api_name,this.state.moduleAPI,relatedList.display_label);
                                    this.handleClick(true);
                                }}>
                                    <ListItemText key={relatedList.api_name} primary={relatedList.display_label}/>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div className={classes.dashbord}>
                        {this.state.data ? <h2>{this.state.label}</h2> : <h2>Tableau de bord</h2>}
                        {this.state.data ? 
                        <CRMPage role={this.props.userRole} records={this.state.records} module={this.state.label} columns={this.state.column}/> : 
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