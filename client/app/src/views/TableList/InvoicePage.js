import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import BooksTable from "../../components/Table/BooksTable.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Select, InputLabel } from "@material-ui/core";
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import axios from "axios";


var baseUrl = "http://localhost:3000/server/crm_crud/";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  box: {
    minWidth: "95%",
    margin: "40px",
    textAlign: "right"
  },
};

const useStyles = makeStyles(styles);

export default function InvoicePage() {
  const classes = useStyles();
  const [invoices,setInvoices] = React.useState();
  const [userInfo,setUser] = React.useState();
  const [customers,setCustomers] = React.useState();
  const myinvoices = [];
  const customerInfo = [];

  useEffect(() => {
    let user = axios.get(baseUrl+"getUserDetails").then((response) => {
        console.log(response.data.user.email_id);
        return response.data.user;
    }).catch((err) => {
        console.log(err);
    });

    let org = axios.get(baseUrl+"books/getOrganizationID").then((response) => {
        return response.data.organizations[0];
    }).catch((err) => {
        console.log(err);
    });

    user.then((user) => {
        console.log(user);
        axios.get(baseUrl+"module/Contacts/Email/"+user.email_id).then((response) => {
            console.log(response);
            const user = response.data.data[0];
            setUser(user);
        }).catch((err) => {
            console.log(err);
        });
    })

    org.then((org) => {
        console.log(org);
        axios.get(baseUrl+"books/customers/getAllCustomers/"+org.organization_id+"/stephane.ung@tranzition.fr").then((response) => {
            console.log(response);
            const allcustomer = response.data.contacts;
            setCustomers(allcustomer);
        }).catch((err) => {
            console.log(err);
        });
        axios.get(baseUrl+"books/invoices/getAllInvoices/"+org.organization_id+"/stephane.ung@tranzition.fr").then((response) => {
            console.log(response);
            const allinvoice = response.data.invoices;
            setInvoices(allinvoice);
        }).catch((err) => {
            console.log(err);
        });
    })

    },[])

  return (
    <>
    {customers && userInfo ? 
    customers.forEach(customer => {
      // console.log(customer.email);
      if (customer.email == userInfo.Email) {
        customerInfo.push(customer);
      }
    })
    : <div></div>}
    {/* {console.log(customerInfo)} */}
    {invoices && customerInfo.length > 0 ?
    invoices.forEach(invoice => {
      // console.log(invoice.customer_id);
      // console.log(customerInfo[0].contact_id);
      if (invoice.customer_id == customerInfo[0].contact_id) {
        myinvoices.push(invoice);
        console.log(invoice);
      }
    })
    : <div></div>}
    {myinvoices ?
    myinvoices.forEach(invoice => {
      var total = invoice.total + " " + invoice.currency_symbol;
      invoice.total = total;
      var url = invoice.invoice_url;
      console.log(url);
      invoice.invoice_url = <Button variant="outlined" href = {url} target = "_blank">VISUALIZE</Button>
    })
    : <div></div>}
    {/* {console.log(invoices)}
    {console.log(myinvoices)} */}
    <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        <Card>
            <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Invoices</h4>
            </CardHeader>
            <CardBody>
                {myinvoices ? 
                <BooksTable
                tableHeaderColor="info"
                tableHead={["Customer","Date","Invoice","Link","Statut","Total"]}
                tableData={myinvoices}
                tableApi={["customer_name","date","invoice_number","invoice_url","status","total"]}
            />
            : 
            <div></div>} 
            </CardBody>
        </Card>
        </GridItem>
    </GridContainer>
    </>
  )
}
