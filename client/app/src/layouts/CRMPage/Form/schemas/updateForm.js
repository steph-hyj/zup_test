import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import axios from "axios";

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function FormFields(module, deal_id) {
    
    const [fields, setFields] = useState({});
    const [userId, setUserId] = useState(null);
    const [data, setData] = useState({});
    // let { module } = useParams();

    useEffect(() => {
        axios.get(baseUrl+'module/getFields/'+module).then((response) => {
        setFields(response.data.fields);
        }).catch((err) => {
            console.log(err)
        });

        axios.get(baseUrl+"getUserDetails").then((response) => {
            axios.get(baseUrl+"getUserZohoID/"+response.data.user.email_id).then((response) => {
                    setUserId(response.data.data[0]);
                }).catch((err) => {
                    console.log(err);
                });
          }).catch((err) => {
            console.log(err);
        });

        axios.get(baseUrl+"module/"+module+"/id/"+deal_id)
        .then((response) => {
            setData(response.data.data[0]);
        }).catch((err) => {
          console.log(err);
        });
    },[module, deal_id]);

    var formField = {
        name: String,
        label: String,
        type: String,
        errorMsg: String
    };

    const FieldTab = [];

    if(fields.length > 0 && userId !== null){
        fields.forEach(field => {
            if(field.system_mandatory) {
                formField.name = field.api_name;
                formField.label = field.display_label;
                formField.type = "text";
                formField.value = data[field.api_name];
                formField.errorMsg = field.display_label+" is required.";
                FieldTab.push(Object.assign({}, formField));
            }
        });
        const form = {
            formId: "Module Form",
            formField: FieldTab ? FieldTab : null,
            userId: userId
        };
        
        return form
    }
}; 