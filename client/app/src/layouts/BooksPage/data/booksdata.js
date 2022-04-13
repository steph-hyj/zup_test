import { useState, useEffect } from "react";

import axios from "axios";

import MDButton from "../../../components/MDButton";

/**Icons button*/
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

const baseUrl = "http://localhost:3000/server/crm_crud/";

// Version deployment
// const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

export default function GetData(module, userEmail) {

    const [columns, setColumns] = useState({});
    const [records, setRecords] = useState({});
    const [userInfo,setUser] = useState();
    const [customers,setCustomers] = useState();
    const myinvoices = [];
    const customerInfo = [];

    useEffect(() => {
        axios.get(baseUrl+"record/checkColumn/"+module).then((response) => {
            setColumns(response.data.Field);
        }).catch((err) => {
            console.log(err);
        });
    },[module]);


    useEffect(() => {
        let user = axios.get(baseUrl+"getUserDetails").then((response) => {
            return response.data.user;
        }).catch((err) => {
            console.log(err);
        });
        /**Call API to get Organization ID to use Books API */
        let org = axios.get(baseUrl+"books/getOrganizationID").then((response) => {
            return response.data.organizations[0];
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

        if(module === "Quote") {
            org.then((org) => {
                /**To get quote of specific user */
                axios.get(baseUrl+"books/quotes/getAllQuotes/"+org.organization_id+"/"+userEmail).then((response) => {
                    const quote = response.data.estimates;
                    console.log("API getAllQuotes",quote);
                    setRecords(quote);
                }).catch((err) => {
                    console.log(err);
                });
            });
        } else if (module === "Invoice") {
            org.then((org) => {
                axios.get(baseUrl+"books/customers/getAllCustomers/"+org.organization_id+"/"+userEmail).then((response) => {
                    console.log(response);
                    const allCustomer = response.data.contacts;
                    setCustomers(allCustomer);
                }).catch((err) => {
                    console.log(err);
                });
                axios.get(baseUrl+"books/invoices/getAllInvoices/"+org.organization_id+"/"+userEmail).then((response) => {
                    const allInvoice = response.data.invoices;
                    setRecords(allInvoice);
                    console.log("API getAllInvoices",allInvoice);
                }).catch((err) => {
                    console.log(err);
                });
            });
        }
    },[module, userEmail]);

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

        if(typeof record[fieldAPI] == 'object' && record[fieldAPI] != null) {
            recordObj[fieldAPI] = record[fieldAPI].name;
        } else if(fieldAPI === "invoice_url") {
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