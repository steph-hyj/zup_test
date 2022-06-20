import { useState, useEffect } from "react";

import axios from "axios";

import MDButton from "../../../../components/MDButton";

/**Icons button*/
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData() {

  const [roleData, setRoleData] = useState({});

  /**Get role detail*/
  useEffect(() => {
    axios.get(baseUrl+"getRoles").then((response)=> {
      console.log(response.data);
      setRoleData(response.data);
    }).catch((err) => {
      console.log(err);
    });
  },[]);

  /**Delete role function */
  function deleteRole(roleID) {
    // console.log(roleID);
    axios.delete(baseUrl+"/deleteConnection/"+roleID)
    .then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log(err);
    })
  }

  const columnsData = [
    {Header: "Role", accessor: "Role", width:"30%"},
    {Header: "Module", accessor: "Module", width:"30%"},
    {Header: "Lire", accessor:"Read", width:"5%"},
    {Header: "Supprimer", accessor:"Update", width:"5%"},
    {Header: "Modifier", accessor:"Delete", width:"5%"}
  ]

  var roleModule = [];

  if(roleData.length > 0) {
    roleData.forEach(role => {
      var roleObj = {
        Role: String,
        Module: String,
        Read: String,
        Update: String,
        Delete: String
      };

      roleObj.Role = role.Role_name;
      roleObj.Module = role.Module_name;
      roleObj.Read = <MDButton><VisibilityIcon /></MDButton>;
      roleObj.Update = <MDButton><EditIcon /></MDButton>;
      roleObj.Delete = <MDButton><DeleteIcon onClick ={() => deleteRole(role.ROWID)}/></MDButton>;
      roleModule.push(roleObj);
    });
  }

  const data = {
    columns: columnsData,
    rows: roleModule
  }

  return data;
}