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
import AdminCRM from "./layouts/AdminCRM";
// import RolePermission from "./layouts/roles&permissions/data/rolepermissionsData"
// Version dev
const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function ModuleRoutes() {

  const [modules, setModules] = useState({});
  const [modulesDetails, setModulesDetails] = useState({});
  const [userRole, setUserRole] = useState({});
  const [userEmail, setUserEmail] = useState({});
  
  useEffect(() =>{
    //Call API to get all modules
    axios.get(baseUrl+"module").then((response) => {
      setModules(response.data.modules);
    }).catch((err) => {
        console.log(err);
    });

    //Call API to get module where scope == Read
    axios.get(baseUrl+"module/checkModule").then((response) => {
      var module = [];
      response.data.Module.forEach((moduleDetails) => {
            if(moduleDetails.Module.Scope === "Read") {
                module.push(moduleDetails);
            }
        })
      setModulesDetails(module);
      }).catch((err) => {
          console.log(err);
    });

    axios.get(baseUrl+"getUserDetails").then((response) => {
      // this.setState({ role : response.data.userRole, userEmail : response.data.user.email_id});
      setUserRole(response.data.userRole);
      setUserEmail(response.data.email_id);
      }).catch((err) => {
          console.log(err);
    });
  },[]);


  var moduleRoute = [];

  if(modulesDetails.length > 0 && userRole.length > 0)
  {
    moduleRoute = [
      {
        name: "CRM Dashboard",
        key: "CRM",
        route:"/app/CRM/dashboard",
        component: <AdminCRM />
      }
    ]

    modulesDetails.forEach((module) => {
      var routeObj = {
        name: String,
        key: String,
        route: String,
        component: String
      }
      routeObj.name = module.Module.Module_name;
      routeObj.key = module.Module.Module_name;
      routeObj.route = "/app/CRM/"+module.Module.Module_name;
      if(userRole === "App Administrator") {
        routeObj.component = <AdminCRM module={module.Module.Module_name}/>
      } else {
        routeObj.component = <CRMPage module={module.Module.Module_name}/>
      }
      moduleRoute.push(routeObj);
    });
  }
  
  const  routes = [
      {
        type: "collapse",
        name: "Users",
        key: "users",
        route: "/app/users",
        // component: <Users />,
        noCollapse: true,
      },
      {
        type: "collapse",
        name: "Roles",
        key: "roles&permissions",
        collapse: [
          {
            name: "Roles & Permissions",
            key: "roles&permissions",
            route: "/app/roles_permissions",
            component: <RolePermission />,
          },
          {
            name: "Connections",
            key: "connections",
            route: "/app/roles_permissions/connection",
            //component: <Connections />,
          },
        ],
      },
      { type: "divider", key: "divider-0" },
      {
        type: "collapse",
        name: "Dashboards",
        key: "dashboards",
        icon: <DashboardIcon />,
        collapse: [
          {
            name: "Analytics",
            key: "analytics",
            route: "/dashboards/analytics",
            //component: <Analytics />,
          },
          {
            name: "Sales",
            key: "sales",
            route: "/dashboards/sales",
            //component: <Sales />,
          },
        ],
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