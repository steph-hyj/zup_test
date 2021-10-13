import { Typography } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import {HashRouter as Router,Route} from 'react-router-dom';

import Navbar from './Navbar';
import Layout from '../layouts/Layouts';
import Sidebar from '../components/Sidebar/Sidebar';
import CreatePage from './CreatePage';

//Version local
var baseUrl = "http://localhost:3000/server/crm_crud/";
//Version deployment
//var baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";
class Routes extends React.Component {

    state = {
        user : []
    }

    /**Execute the function when the component is called */
    componentDidMount() {
        axios.get(baseUrl+"getUserDetails").then((response) => {
          this.setState({ user : response.data });
        }).catch((err) => {
              console.log(err);
        });
    }
    render() {
        if(this.state.user.userId) 
        {
            return(
                <Router>
                    <Route exact path="/" render={(props) => <Navbar app={"index"} {...props}/>} />
                    <Route path="/crm" render={(props) => <Navbar app={"crm"}  {...props}/>} />
                    <Route path="/role_permissions" render={(props) => <Navbar app={"role"}  {...props}/>} />
                    <Route path="/connection" render={(props) => <Navbar app={"roleConnection"}  {...props}/>} />
                    <Route path="/route" render={()=> <Layout />}/>
                </Router>
            )
        }
        else
        {
            return(
               <Typography></Typography>
            )
        }
    }
}

export default Routes;