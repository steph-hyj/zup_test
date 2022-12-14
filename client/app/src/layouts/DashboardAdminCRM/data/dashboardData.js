import { useState, useEffect } from "react";

import axios from "axios";

/**Icons button */
import { Switch } from '@mui/material';

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

function GetData(userRole) {

  const [modules, setModules] = useState(null);
  const [modulesDetail, setModulesDetail] = useState(null);
  // const [state, setState] = useState({});
  
  
  useEffect(() => {
    axios.get(baseUrl+"module").then((response) => {
      setModules(response.data.modules);
    }).catch((err) => {
      console.log(err);
    });
  },[]);
  
  useEffect(() => {
    if(userRole) {
      axios.get(baseUrl+"module/getPermissions/"+userRole).then((response) => {
        setModulesDetail(response.data.Module);
      }).catch((err) => {
        console.log(err);
      });
    }
  },[userRole]);
  
  const columnsData = [
    {Header: "Module", accessor: "Module", width:"30%"},
    {Header: "Créer", accessor: "Create",width:"5%"},
    {Header: "Lire", accessor: "Read",width:"5%"},
    {Header: "Supprimer", accessor:"Update", width:"5%"},
    {Header: "Modifier", accessor:"Delete", width:"5%"}
  ]

  var modulesData = [];
  
  if(modules && userRole && modulesDetail) {
    // console.log(modulesDetail);
    // if(modulesDetail[0].Field) {
    //   console.log("TEST");
    // }
    modules.forEach(module => {
      var moduleObj = {
        Module: String,
        Create: String,
        Read: String,
        Update: String,
        Delete: String
      };

     moduleObj.Module = module.plural_label;
    //  moduleObj.Create = <Switch id={module.plural_label+"Create"} checked={state[module.plural_label+"Create"]} color="success" 
    //                             onChange={(event) => {
      //                                 handleChange(event,module.plural_label,"Create")
      //                                 moduleUpdate(event,"Create",role,module.plural_label,module.plural_label+"CreateID")
      //                         }}/>;
      moduleObj.Read = <RowSwitch module={module.plural_label}
                                  api_module={module.api_name}
                                  moduleDetail={modulesDetail}
                                  scope="Read"
                                  role={userRole}
                      />;
     moduleObj.Update = <Switch />;
     moduleObj.Delete = <Switch />;
     modulesData.push(moduleObj);
    });
  }

  const data = {
    columns: columnsData,
    rows: modulesData
  }

  return data;  
}

const RowSwitch = (props) => {

  const[modulePerm, setModulePerm] = useState();

  useEffect(() => {

    var boolean = false;
    var module_id = null;

    // console.log("Module",props.moduleDetail);
    props.moduleDetail.forEach((module) => {
      if(module.Module[0].Module.Module_name === props.module) {
          boolean = true;
          module_id = module.Module[0].Module.ROWID;
      }
    });
    setModulePerm({[props.module + props.scope] : boolean, [props.module + props.scope + "ID"] : module_id});

  },[props]);

  /**Insert Into Module(Table) the module to display*/
  function addModule (permission, role,module, api_module) {
    axios.post(baseUrl+"module/"+module, {
        role,
        permission,
        api_module
    }).then((response) => {
        console.log(response);
    }).catch((err) => {
        console.log(err);
    });
  }

  /**Delete from Module(Table) the module to hide*/
  function deleteModule (moduleID) {
      axios.delete(baseUrl+"module/"+moduleID).then((response) => {
          console.log(response);
      }).catch((err) => {
          console.log(err);
      });
  }

  /**Execute a function according to the action of switch */
  function moduleUpdate(event,permission,role,module,moduleID, api_module) {
    if(event.target.checked)
    {
      // console.log("Add",permission,role,module);
      addModule(permission,role,module,api_module);
    }
    else
    {
      // console.log(modulePerm);
      // console.log("Delete",moduleID);
      deleteModule(moduleID);
    }
  }

  /**Change switch */
  function handleChange(event, name) {
    setModulePerm({ [name]: event.target.checked });
  }

//   console.log(modulePerm);
  return <Switch checked={modulePerm ? modulePerm[props.module+props.scope] : null}
          onChange={(event) => {
              handleChange(event, props.module+props.scope)
              moduleUpdate(event,props.scope,props.role,props.module,modulePerm[props.module+props.scope+"ID"], props.api_module)
          }}
          color="success" 
  />
}

export default GetData;