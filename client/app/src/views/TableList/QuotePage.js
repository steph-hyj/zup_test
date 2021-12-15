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

export default function QuotePage() {
  const classes = useStyles();
  const [quotes,setQuotes] = React.useState();
  const [userInfo,setUser] = React.useState();
  const [customers,setCustomers] = React.useState();
  const myquotes = [];
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
        axios.get(baseUrl+"books/customers/getAllCustomers/"+org.organization_id).then((response) => {
          console.log(response);
          const allcustomer = response.data.contacts;
          setCustomers(allcustomer);
      }).catch((err) => {
          console.log(err);
      });
        axios.get(baseUrl+"books/quotes/getAllQuotes/"+org.organization_id).then((response) => {
            console.log(response);
            const allquote = response.data.estimates;
            setQuotes(allquote);
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
    {quotes && customerInfo.length > 0 ?
    quotes.forEach(quote => {
      var total = quote.currency_code + " " + quote.total;
      quote.total = total;
      // console.log(invoice.customer_id);
      // console.log(customerInfo[0].contact_id);
      if (quote.customer_id == customerInfo[0].contact_id) {
        myquotes.push(quote);
      }
    })
    : <div></div>}
    {/* {myquotes ?
    myquotes.forEach(quote => {
      var url = quote.invoice_url;
      quote.invoice_url = <Button variant="outlined" href = {url} target = "_blank">VISUALIZE</Button>
    })
    : <div></div>}} */}
    {/* {console.log(quotes)}
    {console.log(myquotes)} */}
    <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        <Card>
            <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Quotes</h4>
            </CardHeader>
            <CardBody>
                {myquotes ? 
                <BooksTable
                tableHeaderColor="info"
                tableHead={["Customer","Date","Quote","Company","Statut","Total"]}
                tableData={myquotes}
                tableApi={["customer_name","date","estimate_number","company_name","status","total"]}
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
