//React
import React, { useEffect, useState } from "react";

//Axios call API
import axios from 'axios';

// @mui icons
import ImageIcon from '@mui/icons-material/Image';
import DashboardIcon from '@mui/icons-material/Dashboard';
//Pages
import InvoicePage from "./views/TableList/InvoicePage";
import RolePermission from "./layouts/roles&permissions";
import CRMPage from "./layouts/CRMPage";
import DashboardPage from "./layouts/CRMPage/DashboardPage";
import AdminCRM from "./layouts/AdminCRM";

// import RolePermission from "./layouts/roles&permissions/data/rolepermissionsData"
// Version dev
const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function ModuleRoutes() {

  const [modules, setModules] = useState({});
  const [modulesDetails, setModulesDetails] = useState([]);
  const [moduleScope, setModuleScope] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [appRole, setAppRole] = useState({});
  const [userEmail, setUserEmail] = useState(null);
  
  useEffect(() =>{
    //Call API to get all modules
    axios.get(baseUrl+"module").then((response) => {
      setModules(response.data.modules);
    }).catch((err) => {
        console.log(err);
    });    

    axios.get(baseUrl+"getUserDetails").then((response) => {
      // this.setState({ role : response.data.userRole, userEmail : response.data.user.email_id});
      // console.log(response.data);
      setAppRole(response.data.userRole);
      setUserEmail(response.data.user.email_id);
      setUserRole(response.data.role);
      }).catch((err) => {
          console.log(err);
    });
  },[]);

  useEffect(() => {
    //Call API to get module where scope == Read
    if(userRole.length > 0) {
      axios.get(baseUrl+"module/getPermissions/"+userRole[0].User_role.id_role)
      .then((response) => {
        var module = [];
        var moduleArray = [];
        response.data.Module.forEach((moduleDetails) => {
          if(moduleDetails.Scope === "Read") {
            modules.forEach(mod => {
              if(mod.plural_label === moduleDetails.Module[0].Module.Module_name) {
                module.push(mod);
              }
            });
          } else {
            modules.forEach(mod => {
              if(mod.plural_label === moduleDetails.Module[0].Module.Module_name) {
                const moduleObj = {
                  scope: String,
                  module_name: String,
                };
                moduleObj.scope = moduleDetails.Scope;
                moduleObj.module_name = moduleDetails.Module[0].Module.Module_name;
                moduleArray.push(moduleObj);
              }
            });
          }
        });
        setModulesDetails(module);
        setModuleScope(moduleArray);
      }).catch((err) => {
        console.log(err)
      });
    }
  },[userRole,modules]);

  var moduleRoute = [];
  console.log(moduleScope);
  if(modulesDetails.length >= 0 && appRole.length >= 0 && moduleScope.length > 0)
  {
    modulesDetails.forEach((module) => {
      var routeObj = {
        name: String,
        key: String,
        route: String,
        path: String,
        component: String
      }

      const mod = moduleScope.filter(m=> m.scope === "Update" && m.module_name === module.plural_label)
      console.log(mod[0]);
      routeObj.name = module.plural_label;
      routeObj.key = module.plural_label;
      routeObj.route = "app/CRM/"+module.plural_label;
      routeObj.component = <CRMPage module={module.api_name} userEmail={userEmail} scope={mod[0] ? mod[0].scope : null}/>;
      moduleRoute.push(routeObj);
    });
  }
  
  const routes = [
      { 
        type: "collapse",
        name: "Dashboards",
        key: "dashboards",
        icon: <DashboardIcon />,
        collapse : [
          {
            name: "Dashboard",
            key: "dashboard",
            route: "/app/dashboard",
            component: <DashboardPage />,
          },
        ]
      },
      { type: "title", title: "Applications", key: "title-pages" },
      {
        type: "collapse",
        name: "Zoho CRM",
        key: "CRM",
        icon: <ImageIcon />,
        collapse: moduleRoute.length > 1 ? moduleRoute : null
      },
      {
        type: "collapse",
        name: "Zoho Books",
        key: "books",
        icon: <ImageIcon />,
        collapse: [
          {
            name: "Factures",
            key: "factures",
            route: "/app/books/invoice",
            //component: <Kanban />,
          },
          {
            name: "Devis",
            key: "devis",
            route: "/app/books/quote",
            //component: <Wizard />,
          }
        ],
      },
      { type: "divider", key: "divider-1" },
    ];
  return routes;
}