import { useState, useEffect } from "react";

import axios from "axios";

import MDButton from "../../../components/MDButton";

/**Icons button*/
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData(module) {

  const [columns, setColumns] = useState({});

  useEffect(() => {
    axios.get(baseUrl+"record/checkColumn/"+module).then((response) => {
      setColumns(response.data.Field);
    }).catch((err) => {
        console.log(err);
    });
  },[module]);

  console.log(columns);
  var columnData = [];
  if(columns.length > 0) {
    columns.forEach(column => {
      var columnObj = {
        Header: String,
        accessor: String
      };

      columnObj.Header = column.Field.Field_name;
      columnObj.accessor = column.Field.Field_name;
      columnData.push(columnObj);
    });
  }

//   const columnsData = [
//     {Header: "Role", accessor: "Role", width:"30%"},
//     {Header: "Module", accessor: "Module",width:"30%"},
//     {Header: "Supprimer", accessor:"Update", width:"5%"},
//     {Header: "Modifier", accessor:"Delete", width:"5%"}
//   ]

//   var roleModule = [];

//   if(roleData.length > 0) {
    // roleData.forEach(role => {
//       var roleObj = {
//         Role: String,
//         Module: String,
//         Update: String,
//         Delete: String
//       };

//      roleObj.Role = role.Role_name;
//      roleObj.Module = role.Module_name;
//      roleModule.push(roleObj);
//     });
//     console.log(roleModule);
//   }

  const data = {
    columns: columnData,
    rows: null
  }

  return data;  
}