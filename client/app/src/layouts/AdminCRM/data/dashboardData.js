import { useState, useEffect } from "react";

import axios from "axios";

import MDButton from "../../../components/MDButton";

/**Icons button*/
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete, Switch } from '@mui/material';
import MDInput from "../../../components/MDInput";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData(role) {

  const [modules, setModules] = useState({});
  const [modulesDetail, setModulesDetail] = useState({});
  const [state, setState] = useState({});

  useEffect(() => {
    axios.get(baseUrl+"module").then((response) => {
        setModules(response.data.modules);
    }).catch((err) => {
        console.log(err);
    });
  },[]);

  useEffect(() => {
    // axios.get(baseUrl+"module/checkModule").then((response) => {
    //   console.log(response.data.Module);
    //     response.data.Module.forEach((moduleDetails) => {
    //         if(moduleDetails.Module.Scope === "Read") {
    //             setModulesDetail(response.data.Module);
    //         }
    //     })
    // }).catch((err) => {
    //     console.log(err);
    // });

    axios.get(baseUrl+"module/getPermissions/"+role).then((response) => {
        // return response.data;
        setModulesDetail(response.data.Module[0]);
    }).catch((err) => {
        console.log(err);
    })
  },[role]);

  const columnsData = [
    {Header: "Module", accessor: "Module", width:"30%"},
    {Header: "Créer", accessor: "Create",width:"5%"},
    {Header: "Lire", accessor: "Read",width:"5%"},
    {Header: "Supprimer", accessor:"Update", width:"5%"},
    {Header: "Modifier", accessor:"Delete", width:"5%"}
  ]

  var modulesData = [];

  if(modules.length > 0 && role && modulesDetail.length > 0) {
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
                                 moduleDetail={modulesDetail}
                                 scope="Read"
                                 role={role}
                      />;
     moduleObj.Update = <Switch />;
     moduleObj.Delete = <Switch />;
     modulesData.push(moduleObj);
    });
    console.log(modulesData);
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

    props.moduleDetail.forEach((module) => {
        if(module.Module.Module_name === props.module) {
            boolean = true;
            module_id = module.Module.ROWID;
        }
    });

    setModulePerm({[props.module + props.scope] : boolean, [props.module + props.scope + "ID"] : module_id});

  },[props]);

  /**Insert Into Module(Table) the module to display*/
  function addModule (permission, role,module) {
    axios.post(baseUrl+"module/"+module, {
        role,
        permission
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
  function moduleUpdate(event,permission,role,module,moduleID) {
    if(event.target.checked)
    {
      // console.log("Add",permission,role,module);
      addModule(permission,role,module);
    }
    else
    {
      // console.log("Delete",moduleID);
      deleteModule(moduleID);
    }
  }

  /**Change switch */
  function handleChange(event, name) {
    setModulePerm({ [name]: event.target.checked });
  }

  return <Switch checked={modulePerm ? modulePerm[props.module+props.scope] : null}
        onChange={(event) => {
            handleChange(event, props.module+props.scope)
            moduleUpdate(event,props.scope,props.role,props.module,modulePerm[props.module+props.scope+"ID"])
        }}
        color="success" 
  />
}