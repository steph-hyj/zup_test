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

    const [records, setRecords] = useState([]);
    const [organization, setOrganization] = useState({});
    const [userDetails,setUserDetails] = useState({});
    const [customers,setCustomers] = useState({});

    useEffect(() => {
        getUserDetails();
        getOrganizationDetails();
    },[]);

    useEffect(() => {
        async function getUserBooksDetails(){
            if(Object.entries(organization).length > 0 && Object.entries(userDetails).length > 0) {
                await axios.get(baseUrl+"books/customers/getAllCustomers/"+organization?.organization_id+"/"+userDetails?.email_id).then((response) => {
                    const allCustomer = response.data.contacts;
                    setCustomers(allCustomer);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
        getUserBooksDetails();
    },[organization, userDetails]);

    useEffect(() => {
        getUserBooksData(organization, customers, module);
    },[organization, customers, module]);

    /**Call API to get current user details */
    async function getUserDetails(){
        await axios.get(baseUrl+"getUserDetails")
        .then((response) => {
            setUserDetails(response.data.user);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    /**Call API to get Organization ID to use Books API */
    async function getOrganizationDetails(){
        await axios.get(baseUrl+"books/getOrganizationID").then((response) => {
            let i = null;
            response.data.organizations.forEach((org , index) => {
                if(org.AppList.includes("books")) {
                    i = index;
                }
            });
            setOrganization(response.data.organizations[i]);
        }).catch((err) => {
            console.log(err);
        });
    };
    
    async function getUserBooksData(organization, customers, module) {
        if(Object.entries(organization).length && Object.entries(customers).length) {
            if(module === "Quotes") {
                setRecords([]);
                /**Call API to get current user quotes */
                let estimatesData = await axios.get(
                    baseUrl+"books/quotes/getAllQuotes/"+organization.organization_id+"/"+customers[0].contact_id
                    )
                    .then((response) => {
                        return response.data.estimates;
                    }).catch((err) => {
                        console.log(err);
                    });
                    estimatesData.forEach((estimate) => {
                        axios.get(baseUrl+"books/quotes/getQuote/"+organization.organization_id+"/"+estimate.estimate_id)
                        .then((response) => {
                            setRecords(records => [...records, response.data.estimate]);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    });
            } else if (module === "Invoices") {
                /**Call API to get current user invoices */
                await axios.get(
                    baseUrl+"books/invoices/getAllInvoices/"+organization.organization_id+"/"+customers[0].contact_id
                )
                .then((response) => {
                    const allInvoice = response.data.invoices;
                    setRecords(allInvoice);
                    // console.log("API getAllInvoices",allInvoice);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    }
    
    const columnData = [
        module === "Invoices" ? {Header: "Invoice", accessor: "invoice_number"} : {Header: "Quote", accessor: "estimate_number"},
        {Header: "Customer", accessor: "customer_name"},
        {Header: "Date", accessor: "date"},
        {Header: "Statut", accessor: "status"},
        {Header: "Total", accessor: "total"},
        module === "Invoices" ? {Header: "Link", accessor: "invoice_url"} : {Header: "Link", accessor: "estimate_url"},
    ];

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

  return [data, getUserBooksData];
}