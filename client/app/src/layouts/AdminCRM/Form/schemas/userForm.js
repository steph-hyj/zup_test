import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function FormFields() {

    const [roleDataTab, setRoleDataTab] = useState({});
    const [connectionDataTable, setConnectionDataTable] = useState([]);

    useEffect(() => {
      axios.get(baseUrl+"getConnection").then((response)=> {
          const connectionModuleTab = [];
          const connectionModuleObj = {
            name: String,
            value: String,
          };
          response.data?.module.forEach(module => {
            console.log(module);
            connectionModuleObj.name = module.Module.Module_name;
            connectionModuleObj.value = module.Module.ROWID;
            connectionModuleTab.push(connectionModuleObj);
          });
          setConnectionDataTable(connectionModuleTab);
      }).catch((err) => {
        console.log(err);
      });
      
      /**Get role detail*/
      axios.get(baseUrl+"getRoles").then((response)=> {
        const roleDataTab = [];
        const roleDataObj = {
          name: String,
          value: String,
        }
        response.data.forEach(role => {
          console.log("Role",role)
          roleDataObj.name = role.Role_name; 
          roleDataObj.value = role.Role_ID;
          roleDataTab.push(roleDataObj);
        });

        setRoleDataTab(roleDataTab);
      }).catch((err) => {
        console.log(err);
      });
    },[]);

    const formField = {
        name: String,
        label: String,
        type: String,
        options: Array,
        errorMsg: String
    };

    const FieldTab = [];

    formField.name = "First name";
    formField.label = "First name";
    formField.type = "text";
    formField.errorMsg = "Please need your name.";
    FieldTab.push(Object.assign({}, formField));
    formField.name = "Last name";
    formField.label = "Last name";
    formField.type = "text";
    formField.errorMsg = "Please your name.";
    FieldTab.push(Object.assign({}, formField));
    formField.name = "Email";
    formField.label = "Email";
    formField.type = "text";
    formField.errorMsg = "Please need your mail";
    FieldTab.push(Object.assign({}, formField));
    formField.name = "Roles";
    formField.label = "Roles";
    formField.type = "select";
    formField.options = roleDataTab;
    formField.errorMsg = "Please choose a role.";
    FieldTab.push(Object.assign({}, formField));
    formField.name = "Modules";
    formField.label = "Modules";
    formField.type = "select";
    formField.options = connectionDataTable;
    formField.errorMsg = "Please choose one module.";
    FieldTab.push(Object.assign({}, formField));
    const form = {
        formId: "User Form",
        formField: FieldTab ? FieldTab : null,
    };

    return form
};