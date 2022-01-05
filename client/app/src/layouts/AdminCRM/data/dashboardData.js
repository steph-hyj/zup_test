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
  console.log(role); 
  useEffect(() => {
    axios.get(baseUrl+"module").then((response) => {
        setModules(response.data.modules);
    }).catch((err) => {
        console.log(err);
    });
  },[]);

  useEffect(() => {
    axios.get(baseUrl+"module/checkModule").then((response) => {
        response.data.Module.forEach((moduleDetails) => {
            if(moduleDetails.Module.Scope === "Read") {
                setModulesDetail(response.data.Module);
            }
        })
    }).catch((err) => {
        console.log(err);
    })
  },[]);

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
  function moduleUpdate(checked,permission,role,module,moduleID) {
    if(checked.target.checked)
    {
      addModule(permission,role,module);
    }
    else
    {
      deleteModule(moduleID);
    }
  }

  const handleChange = (event,name,scope) => {
      setState({
        ...state,
        [name + scope] : event.target.checked
      });
  };

  const columnsData = [
    {Header: "Module", accessor: "Module", width:"30%"},
    {Header: "Créer", accessor: "Create",width:"5%"},
    {Header: "Lire", accessor: "Read",width:"5%"},
    {Header: "Supprimer", accessor:"Update", width:"5%"},
    {Header: "Modifier", accessor:"Delete", width:"5%"}
  ]

   var modulesData = [];

  if(modules.length > 0) {
    modules.forEach(module => {
      var moduleObj = {
        Module: String,
        Create: String,
        Read: String,
        Update: String,
        Delete: String
      };

     moduleObj.Module = module.plural_label;
     moduleObj.Create = <Switch id={module.plural_label+"Create"} checked={state[module.plural_label+"Create"]} color="success" 
                                onChange={(event) => {
                                    handleChange(event,module.plural_label,"Create")
                                    moduleUpdate(event,"Create",role,module.plural_label,module.plural_label+"CreateID")
                            }}/>;
     moduleObj.Read = <Switch />;
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