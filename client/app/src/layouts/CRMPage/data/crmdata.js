import { useState, useEffect } from "react";

import axios from "axios";

/**Icons button*/
import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData(module, userEmail, userID, scope) {

  const [columns, setColumns] = useState({});
  const [records, setRecords] = useState({});

  useEffect(() => {
    axios.get(baseUrl+"record/checkColumn/"+module).then((response) => {
      setColumns(response.data.Field);
    }).catch((err) => {
        console.log(err);
    });
  },[module]);

  useEffect(() => {
    let fields = axios.get(baseUrl+'module/getFields/'+module).then((response) => {
      console.log(response.data.fields);
      return response.data.fields;
    }).catch((err) => {
        console.log(err)
    });

    if(module === "Accounts") {
      if(userID.Account_Name !== undefined) {
        axios.get(baseUrl+"module/"+module+"/id/"+userID.Account_Name.id)
        .then((response) => {
          // console.log(response.data.data)
          setRecords(response.data.data);
        }).catch((err) => {
          console.log(err);
        });
      }
    } else {
      fields.then((fields) => {
        var fieldTab = [];
        fields.forEach((field) => {
          if(field.api_name === "Email" || field.api_name === "Contact_Name") {
            fieldTab.push(field.api_name);
          }
        });
        // console.log(fieldTab);
        if(fieldTab.length === 0) {
            /**Get All records data of specific module */
            axios.get(baseUrl+"module/getRecords/"+module).then((response) => {
              setRecords(response.data.data);
            }).catch((err) => {
              console.log(err);
            });
        } else {
            if(fieldTab[0] === "Email" && userEmail) {
                /**Get user's records data of specific module*/ 
                axios.get(baseUrl+"module/"+module+"/"+fieldTab[0]+"/"+userEmail).then((response) => {
                  setRecords(response.data.data);
                }).catch((err) => {
                  console.log(err);
                });
            } else if(fieldTab[0] === "Contact_Name" && userID.id) {
              /**Get user's records data of specific module */
              axios.get(baseUrl+"module/"+module+"/"+fieldTab[0]+"/"+userID.id).then((response) => {
                setRecords(response.data.data);
              }).catch((err) => {
                console.log(err);
              });
            }
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  },[module,userEmail,userID]);

  var columnData = [];
  if(columns.length > 0) {
    columns.forEach(column => {
      var columnObj = {
        Header: String,
        accessor: String,
        update: String,
      };

      columnObj.Header = column.Field.Field_name;
      columnObj.accessor = column.Field.Field_name;
      columnData.push(columnObj);
    });
    if(scope) {
      var columnObj = {
        Header: String,
        accessor: String,
        update: String,
      };
      columnObj.scope = <EditIcon />
      columnObj.Header = "Update";
      columnObj.accessor = "Update";
      columnData.push(columnObj);
    }
  }

  var recordData = [];
  var recordArray = [];
  if(records.length > 0) {
    records.forEach(record => {
      columnData.forEach(data => {
        const fieldAPI = data.accessor;
         var recordObj = {
          [fieldAPI] : String,
          Update: String
        };
        // console.log(fieldAPI,record[fieldAPI],typeof record[fieldAPI]);
        if(typeof record[fieldAPI] == 'object' && record[fieldAPI] != null) {
            recordObj[fieldAPI] = record[fieldAPI].name;
        } else {
            recordObj[fieldAPI] = record[fieldAPI];
        }
        if(scope) {
          recordObj.Update = <EditIcon />
        }
        recordArray.push(recordObj);
      });
      // console.log(recordArray);
      //Merge object to get new one
      recordData.push(Object.assign({},...recordArray));
    });
  }

  const data = {
    columns: columnData,
    rows: recordData
  }

  return data;  
}