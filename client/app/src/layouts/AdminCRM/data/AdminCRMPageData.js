import { useState, useEffect } from "react";

import axios from "axios";

import MDButton from "../../../components/MDButton";

/**Icons button*/
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Switch } from '@mui/material';
import { bool } from "prop-types";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData(module) {

  const [fields, setFields] = useState({});
  const [columns, setColumns] = useState({});
  const [state, setState] = useState([]);
  const [column, setColumn] = useState(false);
  // const [boolean, setBoolean] = useState(false);

  useEffect(() => {
    axios.get(baseUrl+'module/getFields/'+module).then((response) => {
      setFields(response.data.fields);
    }).catch((err) => {
        console.log(err)
    });

    axios.get(baseUrl+"record/checkColumn/"+module).then((response) => {
      setColumns(response.data.Field);
    }).catch((err) => {
        console.log(err);
    });
  },[module]);

  useEffect(() => {
    if(fields.length > 0 && columns.length > 0) {
      // var oldArray = [];
      columns.forEach((column) => {
        fields.forEach((field) => {
            var object = {
              api_name: String,
              boolean: Boolean
            }
            if(column.Field.Field_name === field.api_name) {
              object.boolean = true;
              object.api_name = field.api_name;
              setState(state => [ ...state, object ]);
            }
        });
      });

      // setState([{"Full_Name" : "true"},{"Email" : "true"}]);
    } 
  },[fields,columns]);

  /**Execute a function according to the action of switch */
  function userUpdate(checked, col, fieldID, module) {
    if(checked.target.checked !== true)
    {
      console.log("Delete",fieldID);
        // deleteField(fieldID);
    }
    else
    {
      console.log("Add",col,module);
        // addField(col,module);
    }
  };

  /**Insert Into Field(Table) the col to display*/
  function addField(Column, module) {
    axios.post(baseUrl+"record/"+Column, {
        Column,
        module
    }).then((response) => {
        console.log(response);
    }).catch((err) => {
        console.log(err);
    });
  };

  /**Delete from Field(Table) the col to hide*/
  function deleteField(fieldID) {
      fieldID.then((fieldID) => {
          axios.delete(baseUrl+"record/"+fieldID).then((response) => {
              console.log(response);
          }).catch((err) => {
              console.log(err);
          });
      })
  };

  /**Get from Field(Table) the col to display */
  function getIDField(col) {
    let fieldsCol = axios.get(baseUrl+"record/checkColumn/"+module).then((response) => {
        return response.data.Field;
    }).catch((err) => {
        console.log(err);
    });
    let fieldID = fieldsCol.then((fields) => {
        var id = null;
        fields.forEach(field => {
            if(field.Field.Field_name === col) {
                id = field.Field.ROWID;
            }
        })
        return id;
    }).catch((err) => {
        console.log(err);
    })
    return fieldID;
  };

  /**Change switch */
  function handleChange(event, name) {
    setState({ [name]: event.target.checked });
    console.log(event.target);
  };

  /**Default checked */
  function defaultChecked(boolean, api_name)
  {
    setColumn({ [api_name]: boolean});
  }

  const columnData = [
    {Header: "Champs", accessor: "Fields", width:"10%"},
    {Header: "Afficher", accessor: "Read",width:"5%"}
  ]

  var fieldData = [];

  if(fields.length > 0 && state.length > 0) {
    fields.forEach(field => {

      var fieldObj = {
        Fields: String,
        Api: String,
        Read: String
      };

     fieldObj.Fields = field.field_label;
     fieldObj.Api = field.api_name;
     console.log(field);
     console.log(state.find(api => api.api_name === field.api_name) !== undefined);
     if(state.find(api => api.api_name === field.api_name) !== undefined) {
        const api_name = state.find(api => api.api_name === field.api_name).api_name;
        const boolean = state.find(api => api.api_name === field.api_name).boolean;
        defaultChecked(boolean, api_name);
        console.log(column);
     }
     fieldObj.Read = <Switch 
    //  checked={} 
                             onChange={(event) => console.log(column)}
                            //  onChange={(event) => {
                            //     handleChange(event, field.api_name)
                            //     userUpdate(event, field.field_label, getIDField(field.field_label), module)
                            //  }}
                             color="success"
                      />;
     fieldData.push(fieldObj);
    });
  }

  const data = {
    columns: columnData,
    rows: fieldData
  }

  return data;  
}