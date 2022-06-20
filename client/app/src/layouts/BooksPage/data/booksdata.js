import { useState, useEffect } from "react";

import axios from "axios";

import MDButton from "../../../components/MDButton";

// /**Icons button*/
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Button from '@mui/material/Button';

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData(module) {

    const [records, setRecords] = useState({});
    const [organization, setOrganization] = useState({});
    const [userInfo,setUser] = useState({});
    const [customers,setCustomers] = useState({});

    var columnData = [];

    useEffect(() => {
        let user = axios.get(baseUrl+"getUserDetails").then((response) => {
            return response.data.user;
        }).catch((err) => {
            console.log(err);
        });
        /**Call API to get Organization ID to use Books API */
        axios.get(baseUrl+"books/getOrganizationID").then((response) => {
            setOrganization(response.data.organizations[0]);
        }).catch((err) => {
            console.log(err);
        });
        /**Call API to get Contact's email */
        user.then((user) => {
            axios.get(baseUrl+"module/Contacts/Email/"+user.email_id).then((response) => {
                const user = response.data.data[0];
                setUser(user);
            }).catch((err) => {
                console.log(err);
            });
        });
    },[module]);

    useEffect(() => {
        if(Object.entries(organization).length && Object.entries(userInfo).length) {
            console.log("Organization",organization);
            console.log("user Info",userInfo);
            axios.get(baseUrl+"books/customers/getAllCustomers/"+organization.organization_id+"/"+userInfo.id).then((response) => {
                console.log(response.data);
                const allCustomer = response.data.contacts;
                setCustomers(allCustomer);
            }).catch((err) => {
                console.log(err);
            });
        }
    },[organization, userInfo, module]);

    useEffect(() => {
        if(Object.entries(organization).length && Object.entries(customers).length) {
            if(module === "Quotes") {
                /**To get quote of specific user */
                axios.get(baseUrl+"books/quotes/getAllQuotes/"+organization.organization_id+"/"+customers[0].contact_id).then((response) => {
                    const quote = response.data.estimates;
                    console.log("API getAllQuotes",quote);
                    setRecords(quote);
                }).catch((err) => {
                    console.log(err);
                });
            } else if (module === "Invoices") {
                axios.get(baseUrl+"books/invoices/getAllInvoices/"+organization.organization_id+"/"+customers[0].contact_id).then((response) => {
                    const allInvoice = response.data.invoices;
                    setRecords(allInvoice);
                    console.log("API getAllInvoices",allInvoice);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    },[customers, module, organization])

    if(module === "Invoices") {
        columnData = [
            {Header: "Invoice", accessor: "invoice_number"},
            {Header: "Customer", accessor: "customer_name"},
            {Header: "Date", accessor: "date"},
            {Header: "Statut", accessor: "status"},
            {Header: "Total", accessor: "total"},
            {Header: "Link", accessor: "invoice_url"},
        ];
    } else if (module === "Quotes") {
        columnData = [
            {Header: "Quote", accessor: "estimate_number"},
            {Header: "Customer", accessor: "customer_name"},
            {Header: "Date", accessor: "date"},
            {Header: "Statut", accessor: "status"},
            {Header: "Total", accessor: "total"},
            {Header: "Link", accessor: "estimate_url"},
        ];
    }

    // if(scope) {
    //   var columnObj = {
    //     Header: String,
    //     accessor: String,
    //     update: String,
    //   };
    //   columnObj.scope = <EditIcon />
    //   columnObj.Header = "Update";
    //   columnObj.accessor = "Update";
    //   columnData.push(columnObj);
    // }

  var recordData = [];
  var recordArray = [];
  if(Object.entries(records).length > 0) {
    records.forEach(record => {
      columnData.forEach(data => {
        const fieldAPI = data.accessor;
         var recordObj = {
          [fieldAPI] : String,
          Update: String
        };

        if(typeof record[fieldAPI] == 'object' && record[fieldAPI] != null) {
            recordObj[fieldAPI] = record[fieldAPI].name;
        } else if(fieldAPI === "invoice_url" || fieldAPI === "estimate_url") {
            const url = record[fieldAPI];
            if(url) {
                recordObj[fieldAPI] = <MDButton href={url} >VISUALIZE</MDButton>;
            } else {
                recordObj[fieldAPI] = <MDButton disabled href={url} >VISUALIZE</MDButton>;
            }
        } else {
            recordObj[fieldAPI] = record[fieldAPI];
        }
        // if(scope) {
        //   recordObj.Update = <EditIcon />
        // }
        recordArray.push(recordObj);
      });
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