import { useState, useEffect } from "react";

import axios from "axios";

import MDButton from "../../../../components/MDButton";

/**Icons button*/
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData() {

  const [connectionData, setConnectionData] = useState({});

  useEffect(() => {
    axios.get(baseUrl+"getConnection").then((response)=> {
        setConnectionData(response.data.module);
        console.log("Connection",response.data);
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
    {Header: "Module", accessor: "Module", width:"30%"},
    {Header: "Application", accessor: "Application",width:"10%"},
    {Header: "Connection", accessor: "Connection",width:"10%"},
    {Header: "Modifier", accessor:"Update", width:"10%"},
    {Header: "Supprimer", accessor:"Delete", width:"10%"}
  ]

  var connection = [];

  if(connectionData.length > 0) {
    connectionData.forEach(connect => {
      var connectionObj = {
        Module: String,
        Application: String,
        Connection: Boolean,
        Update: String,
        Delete: String
      };

     connectionObj.Module = connect.Module.Module_name;
     connectionObj.Application = connect.Module.Application;
     connectionObj.Connection = connect.Module.Connection;
     connectionObj.Update = <MDButton href={"http://localhost:3000/app/index.html#/updateConnection/"+connect.Module.ROWID}><EditIcon /></MDButton>
     connectionObj.Delete = <MDButton><DeleteIcon onClick ={() => deleteConnection(connect.Module.ROWID)}/></MDButton>
     connection.push(connectionObj);
    });
  }

  const data = {
    columns: columnsData,
    rows: connection
  }

  return data;
}