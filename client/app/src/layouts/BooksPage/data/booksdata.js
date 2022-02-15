// import { useState, useEffect } from "react";

// import axios from "axios";

// import MDButton from "../../../components/MDButton";

// /**Icons button*/
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// const baseUrl = "http://localhost:3000/server/crm_crud/";

// // Version deployment
// // const baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

// export default function GetData(module, userEmail, userID, scope) {

// const [invoices,setInvoices] = useState();
// const [userInfo,setUser] = useState();
// const [customers,setCustomers] = useState();
// const myinvoices = [];
// const customerInfo = [];

//   useEffect(() => {
//     let user = axios.get(baseUrl+"getUserDetails").then((response) => {
//         console.log(response.data.user.email_id);
//         return response.data.user;
//     }).catch((err) => {
//         console.log(err);
//     });

//     let org = axios.get(baseUrl+"books/getOrganizationID").then((response) => {
//         return response.data.organizations[0];
//     }).catch((err) => {
//         console.log(err);
//     });

//     user.then((user) => {
//         console.log(user);
//         axios.get(baseUrl+"module/Contacts/Email/"+user.email_id).then((response) => {
//             console.log(response);
//             const user = response.data.data[0];
//             setUser(user);
//         }).catch((err) => {
//             console.log(err);
//         });
//     })

//     org.then((org) => {
//         console.log(org);
//         axios.get(baseUrl+"books/customers/getAllCustomers/"+org.organization_id).then((response) => {
//             console.log(response);
//             const allcustomer = response.data.contacts;
//             setCustomers(allcustomer);
//         }).catch((err) => {
//             console.log(err);
//         });
//         axios.get(baseUrl+"books/invoices/getAllInvoices/"+org.organization_id).then((response) => {
//             console.log(response);
//             const allinvoice = response.data.invoices;
//             setInvoices(allinvoice);
//         }).catch((err) => {
//             console.log(err);
//         });
//     })

//     },[])

//   var columnData = [];
//   if(columns.length > 0) {
//     columns.forEach(column => {
//       var columnObj = {
//         Header: String,
//         accessor: String,
//         update: String,
//       };

//       columnObj.Header = column.Field.Field_name;
//       columnObj.accessor = column.Field.Field_name;
//       columnData.push(columnObj);
//     });
//     if(scope) {
//       var columnObj = {
//         Header: String,
//         accessor: String,
//         update: String,
//       };
//       columnObj.scope = <EditIcon />
//       columnObj.Header = "Update";
//       columnObj.accessor = "Update";
//       columnData.push(columnObj);
//     }
//   }

//   console.log(columnData);

//   var recordData = [];
//   var recordArray = [];
//   if(records.length > 0) {
//     records.forEach(record => {
//       columnData.forEach(data => {
//         const fieldAPI = data.accessor;
//          var recordObj = {
//           [fieldAPI] : String,
//           Update: String
//         };
//         console.log(fieldAPI,record[fieldAPI],typeof record[fieldAPI]);
//         if(typeof record[fieldAPI] == 'object' && record[fieldAPI] != null) {
//             recordObj[fieldAPI] = record[fieldAPI].name;
//         } else {
//             recordObj[fieldAPI] = record[fieldAPI];
//         }
//         if(scope) {
//           recordObj.Update = <EditIcon />
//         }
//         recordArray.push(recordObj);
//       });
//       //Merge object to get new one
//       recordData.push(Object.assign({},...recordArray));
//     });
//   }

//   const data = {
//     columns: columnData,
//     rows: recordData
//   }

//   return data;  
// }