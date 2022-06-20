import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function FormFields() {

    const [connectionTab, setConnectionTab] = useState({});
    // const [roleData, setRoleData] = useState({});
    const [done, setDone] = useState(false);

    useEffect(() => {
        /**Get role detail*/
        const connectionData = axios.get(baseUrl+"getConnection").then((response)=> {
            return response.data.module;
        }).catch((err) => {
          console.log(err);
        });

        const moduleOptions = {
            name: String,
            value: String,
        }
        const moduleTab = [];
        connectionData.then(connectionData => {
            connectionData.forEach(connectionModule => {
                // console.log(module);
                moduleOptions.name = connectionModule.Module.Module_name;
                moduleOptions.value = connectionModule.Module.ROWID;
                moduleTab.push(Object.assign({}, moduleOptions));
            });
            setConnectionTab(moduleTab);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setTimeout(() => {
                setDone(true);
            }, 3000);
        });
    },[]);

    console.log("GET Module TAB",connectionTab);

    const formField = {
        name: String,
        label: String,
        type: String,
        options: Array,
        errorMsg: String
    };

    const FieldTab = [];

    const options = [
        {name: "Create",value: "Create"},
        {name: "Read",value: "Read"},
        {name: "Update",value: "Update"},
        {name: "Delete",value: "Delete"},
    ]

    if(done){
        formField.name = "Role name";
        formField.label = "Role name";
        formField.type = "text";
        formField.errorMsg = "Please a role name.";
        FieldTab.push(Object.assign({}, formField));
        formField.name = "Modules";
        formField.label = "Modules";
        formField.type = "select";
        formField.options = connectionTab;
        formField.errorMsg = "Please choose a module.";
        FieldTab.push(Object.assign({}, formField));
        formField.name = "Permissions";
        formField.label = "Permissions";
        formField.type = "multiSelect";
        formField.options = options;
        formField.errorMsg = "Please choose a scope.";
        FieldTab.push(Object.assign({}, formField));
        const form = {
            formId: "Connection Form",
            formField: FieldTab ? FieldTab : null,
        };

        return form
    }
};