import { useState, useEffect } from "react";

import axios from "axios";

import MDButton from "../../../components/MDButton";

/**Icons button*/
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData() {

  const [roleData, setRoleData] = useState({});

  useEffect(() => {
    axios.get(baseUrl+"getRoles").then((response)=> {
      setRoleData(response.data.ModuleRole);
    }).catch((err) => {
      console.log(err);
    });
  },[]);

  function deleteConnection(moduleID) {
    // console.log(moduleID);
    axios.delete(baseUrl+"/deleteConnection/"+moduleID)
    .then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log(err);
    })
  }

  const columnsData = [
    {Header: "Role", accessor: "Role", width:"30%"},
    {Header: "Module", accessor: "Module",width:"30%"},
    {Header: "Supprimer", accessor:"Update", width:"5%"},
    {Header: "Modifier", accessor:"Delete", width:"5%"}
  ]

  var roleModule = [];

  if(roleData.length > 0) {
    roleData.forEach(role => {
      var roleObj = {
        Role: String,
        Module: String,
        Update: String,
        Delete: String
      };

     roleObj.Role = role.Role_name;
     roleObj.Module = role.Module_name;
     roleObj.Update = <MDButton><EditIcon /></MDButton>
     roleObj.Delete = <MDButton><DeleteIcon onClick ={() => deleteConnection(role.Module_ID)}/></MDButton>
     roleModule.push(roleObj);
    });
    console.log(roleModule);
  }

  const data = {
    columns: columnsData,
    rows: roleModule
  }

  return data;  
}