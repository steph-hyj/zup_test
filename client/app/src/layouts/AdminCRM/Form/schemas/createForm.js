import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function FormFields() {

    const [modulesTab, setModulesTab] = useState([]);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const modules = axios.get(baseUrl+"module").then((response)=>{
            return response.data.modules;
        }).catch((err) => {
          console.log(err)
        });
        const moduleOptions = {
            name: String,
            value: String,
        }
        const moduleTab = [];
        modules.then(modules => {
            modules.forEach(module => {
                axios.get(baseUrl+"module/getFields/"+module.api_name).then((response) => {
                    var status = response.data.status;
                    if(!status) {
                        response.data.fields.forEach((field)=>{
                            if(field.api_name === "Email") {
                                // console.log(module);
                                moduleOptions.name = module.api_name;
                                moduleOptions.value = module.api_name;
                                moduleTab.push(Object.assign({}, moduleOptions));
                            }
                        });
                    }
                    setModulesTab(moduleTab);
                }).catch((err)=> {
                    console.log(err);
                });
            });
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setTimeout(() => {
                setDone(true);
            }, 3000);
        });
    },[]);

    console.log("GET MODULES TAB",modulesTab);

    const formField = {
        name: String,
        label: String,
        type: String,
        options: Array,
        errorMsg: String
    };

    const FieldTab = [];

    const options = [
        { name: "Zoho CRM", value: "Zoho CRM"},
        { name: "Zoho Books", value: "Zoho Books", },
      ];

    if(done){
        formField.name = "Applications";
        formField.label = "Applications";
        formField.type = "select";
        formField.options = options;
        formField.errorMsg = "Please choose an application.";
        FieldTab.push(Object.assign({}, formField));
        formField.name = "Modules";
        formField.label = "Modules";
        formField.type = "select";
        formField.options = modulesTab;
        formField.errorMsg = "Please choose one module.";
        FieldTab.push(Object.assign({}, formField));
        // formField.name = "Connections";
        // formField.label = "Connections";
        // formField.type = "checkbox";
        // formField.errorMsg = "Connection";
        // FieldTab.push(Object.assign({}, formField));
        const form = {
            formId: "Connection Form",
            formField: FieldTab ? FieldTab : null,
        };

        return form
    }
};