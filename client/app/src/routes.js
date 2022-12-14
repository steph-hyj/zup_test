//React
import React, { useEffect, useState } from "react";

//Axios call API
import axios from 'axios';

// @mui icons
// import DashboardIcon from '@mui/icons-material/Dashboard';
//Pages
// import InvoicePage from "./Pages/QuotePage";
import RolePermission from "./layouts/AdminCRM/rolesPermissions";
import CRMPage from "./layouts/CRMPage";
import AdminCRM from "./layouts/AdminCRM";
import UserList from "./layouts/Users/UserList";
import UserCreate from "./layouts/Users/CreateUser";
import ProfilePage from "./layouts/CRMPage/ProfilePage";
import BooksPage from "./layouts/BooksPage";
import AdminDashboardPage from "./layouts/DashboardAdminCRM";
import ConnectionPage from "./layouts/AdminCRM/connections";

// Version dev
const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function ModuleRoutes() {

  const [modules, setModules] = useState({});
  const [modulesDetails, setModulesDetails] = useState({});
  const [moduleScope, setModuleScope] = useState([]);
  const [userEmail, setUserEmail] = useState({});
  const [appRole, setAppRole] = useState({});
  const [userRole, setUserRole] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    //Call API to get all modules
    axios.get(baseUrl+"module").then((response) => {
      setModules(response.data.modules);
    }).catch((err) => {
        console.log(err);
    });

    //Call API to get user Details
    axios.get(baseUrl+"getUserDetails").then((response) => {
        setUserEmail(response.data.user.email_id);
        setAppRole(response.data.userRole);
        setUserRole(response.data.role);
      }).catch((err) => {
        console.log(err);
    }).finally(() => {
      setLoading(false);
    });
  },[]);

  useEffect(() => {
    if(!loading) {
      if(appRole === "App Administrator") {
        //Call API to get module where scope == Read
        axios.get(baseUrl+"module/checkModule").then((response) => {
          var module = [];
          response.data.Module.forEach((moduleDetails) => {
            // console.log(moduleDetails);
            if(modules.length > 0) {
              modules.forEach(mod => {
                if(mod.api_name === moduleDetails[0].Module.Module_api && !moduleDetails[0].Module.Connection) {
                  module.push(mod);
                }
              });
            }
           });
          setModulesDetails(module);
          }).catch((err) => {
              console.log(err);
        });
      } else {
        if(userRole.length > 0) {
          console.log(userRole);
          //Call API to get modules with scope = "Read"
          axios.get(baseUrl+"module/getPermissions/"+userRole[0].User_role.id_role)
          .then((response) => {
            var module = [];
            var moduleArray = [];
            response.data.Module.forEach((moduleDetails) => {
              if(moduleDetails.Scope === "Read") {
                modules.forEach(mod => {
                  if(mod.api_name === moduleDetails.Module[0].Module.Module_api) {
                    module.push(mod);
                    // console.log("Module",mod.plural_label,moduleDetails.Module[0].Module.Module_name);
                  }
                });
              } else {
                modules.forEach(mod => {
                  if(mod.api_name === moduleDetails.Module[0].Module.Module_api) {
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
            // console.log(module)
            setModulesDetails(module);
            setModuleScope(moduleArray);
          }).catch((err) => {
            console.log("Get Permissions",err)
          });
        }
      }
    }
  },[modules, userRole ,appRole, loading]);

  var moduleRoute = [];
  if(!loading) {
    /**Route for admin */
    if(appRole === "App Administrator") {
      moduleRoute = [
        {
          name: "CRM Dashboard",
          key: "CRM",
          route:"/CRM/dashboard",
          component: <AdminDashboardPage />
        }
      ];
      if(modulesDetails.length > 0)
      {
        modulesDetails.forEach((module) => {
          var routeObj = {
            name: String,
            key: String,
            route: String,
            component: String
          }

          routeObj.name = module.plural_label;
          routeObj.key = module.plural_label;
          routeObj.route = "/CRM/"+module.plural_label;
          routeObj.component = <AdminCRM module={module.api_name}/>
          moduleRoute.push(routeObj);
        });
      }
    } else {
      /**Route for user */
      if(modulesDetails.length >= 0 && appRole.length >= 0 && moduleScope.length > 0) {
        modulesDetails.forEach((module) => {
          var routeObj = {
            type: String,
            name: String,
            key: String,
            route: String,
            path: String,
            component: String
          }

          const mod = moduleScope.filter(m=> m.scope === "Update" && m.module_name === module.plural_label);
          routeObj.type = "component";
          routeObj.name = module.plural_label;
          routeObj.key = module.plural_label;
          routeObj.route = "/CRM/"+module.plural_label;
          if(module.api_name === "Contacts" || module.api_name === "Accounts") {
            routeObj.component = <ProfilePage module={module.api_name} userEmail={userEmail} scope={mod[0] ? mod[0].scope : null}/>;
          } else {
            routeObj.component = <CRMPage module={module.api_name} userEmail={userEmail} scope={mod[0] ? mod[0].scope : null}/>;
          }
          moduleRoute.push(routeObj);
        });
      }
    }

    if(appRole === "App Administrator") {
      const routes = [
        {
          type: "collapse",
          name: "Utilisateurs",
          key: "Users",
          collapse: [
            {
              name: "Liste utilisateurs",
              key: "listeUsers",
              route: "/userList",
              component: <UserList/>
            },
            {
              name: "Creation utilisateur",
              key: "createUser",
              route: "/createUser",
              component: <UserCreate/>
            }
          ]
        },
        {
          type: "collapse",
          name: "Gestion r??le",
          key: "roles&permissions",
          style: [{ height: 5 }],
          collapse: [
            {
              name: "Roles & Permissions",
              key: "roles",
              route: "/gestions/rolesPermissions",
              component: <RolePermission />,
              style: [{ height: 5 }]
            },
            {
              name: "Connexions",
              key: "connections",
              route: "/gestions/connection",
              component: <ConnectionPage />,
            },
          ],
        },
        { type: "divider", key: "divider-0" },
        { type: "title", title: "Applications", key: "title-pages" },
        {
          type: "collapse",
          name: "Zoho CRM",
          key: "CRM",
          collapse: moduleRoute.length > 0 ? moduleRoute : null
        },
        { type: "divider", key: "divider-1" },
        {
          type: "component",
          name: "D??connexion",
          key: "logout",
          href: "http://localhost:3000/app/logout.html",
        },
      ];

      return routes;
    } else {
      
      let routes;
      const routesModule = moduleRoute.length > 0 ? moduleRoute : null;

      const routesArray = [
        {
          type: "component",
          name: "Factures",
          key: "invoices",
          route: "/books/invoice",
          component: <BooksPage module="Invoices" userEmail={userEmail} />,
        },
        {
          type: "component",
          name: "Devis",
          key: "quotes",
          route: "/books/quote",
          component: <BooksPage module="Quotes" />,
        },
        { type: "divider", key: "divider-1" },
      ];
      
      if(routesModule) {
        routes = routesModule.concat(routesArray);
      }

      return routes;
    }
  }
}