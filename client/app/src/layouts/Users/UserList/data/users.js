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

  const [usersData, setUsersData] = useState({});

  useEffect(() => {
    axios.get(baseUrl+"/getAllUser").then((response)=>{
      setUsersData(response.data.allUser);
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
    {Header: "Nom", accessor: "Nom", width:"10%"},
    {Header: "Prénom", accessor: "Prenom",width:"10%"},
    {Header: "Email", accessor: "Email", width: "10%"},
    {Header: "Module", accessor: "Module", width: "10%"},
    {Header: "Role", accessor: "Role", width: "10%"},
    {Header: "Statut", accessor : "Statut", width:"10%"},
    {Header: "Modifier", accessor:"Update", width:"5%"},
    {Header: "Supprimer", accessor:"Delete", width:"5%"}
  ]

  var UserList = [];
  if(usersData.length > 0) {
    usersData.forEach(user => {
      //console.log(user);
      var userInfo = {
        Nom: String,
        Prenom: String,
        Email : String,
        Statut : String,
        Update: String,
        Delete: String
      };

      userInfo.Nom = user.last_name;
      userInfo.Prenom = user.first_name;
      userInfo.Email = user.email;
      userInfo.Statut = user.status;
      userInfo.Update = <MDButton><EditIcon /></MDButton>
      userInfo.Delete = <MDButton><DeleteIcon  /></MDButton>
      UserList.push(userInfo);
    });
    //console.log(roleModule);
  }

  const data = {
    columns: columnsData,
    rows: UserList
  }

  return data;
}