import { Typography } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import {HashRouter as Router,Route,} from 'react-router-dom';

import Navbar from './Navbar';

var baseUrl = "http://localhost:3000/server/crm_crud/";

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
                </Router>
            )
        }
        else
        {
            return(
               <Typography><a href="/app/login.html">Login here</a></Typography>
            )
        }
    }
}
   
export default Routes;