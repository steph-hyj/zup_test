import { useState, useEffect } from "react";

import axios from "axios";

/**Icons button*/
import { Switch } from '@mui/material';

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData(module) {

  const [fields, setFields] = useState({});
  const [columns, setColumns] = useState({});
  const [state, setState] = useState([]);

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
    } 
  },[fields,columns]);

  /**Table column data*/
  const columnData = [
    {Header: "Champs", accessor: "Fields", width:"10%"},
    {Header: "Afficher", accessor: "Read",width:"5%"}
  ]

  /**Table row data */
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

     fieldObj.Read = <RowSwitch field={field.api_name} 
                                fieldChecked={state}
                                module={module}
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

const RowSwitch = (props) => {

  const [boolean, setBoolean] = useState([]);

  useEffect(() => {
    /**Check if it's ticked */
    function getCheck() {
        var boolean = false;
        props.fieldChecked.forEach((column) => {
            if(column.api_name === props.field) {
                boolean = true;
            }
        })
        return boolean
    }
    setBoolean({[props.field] : getCheck()});  

  },[props.field,props.fieldChecked]);

  /**Execute a function according to the action of switch */
  function userUpdate(event, col, fieldID, module) {
    if(event.target.checked !== true)
    {
      deleteField(fieldID);
    }
    else
    {
      addField(col,module);
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
    let fieldsCol = axios.get(baseUrl+"record/checkColumn/"+props.module).then((response) => {
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
    setBoolean({ [name]: event.target.checked });
  }

  return <Switch checked={boolean[props.field]}
          onChange={(event) => {
              handleChange(event, props.field)
              userUpdate(event, props.field,getIDField(props.field),props.module)
          }}
          color="success" 
  />
}