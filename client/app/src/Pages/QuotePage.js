import React from 'react';
import { Button, CardMedia } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

var baseUrl = "http://localhost:3000/server/crm_crud/";

/**Table Row Design */
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
}));

/**Table cell Design */
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));

class QuotePage extends React.Component {
    
    state = {
        organization : [],
        quotes : [], 
    }
    

    componentDidMount() {
        axios.get(baseUrl+"books/getOrganizationID").then((response) => {
            console.log(response.data.organizations[0].organization_id);
            const org = response.data.organizations[0];
            // state.organization orgaID;
            this.setState({organization : org})
            // const modulesData = response.data.modules;
            // this.setState({modules : modulesData});
        }).catch((err) => {
            console.log(err);
        });
    }

    quote() {
        console.log(this.state.organization.organization_id);
        // console.log(baseUrl+"books/invoices/getAllInvoices/20070351888");
        axios.get(baseUrl+"books/quotes/getAllQuotes/"+this.state.organization.organization_id).then((response) => {
            console.log(response);
            // console.log(response.data.invoices[1].invoice_url);
            const quote = response.data.estimates;
            this.setState({quotes : quote})
            // state.organization orgaID;
            // const modulesData = response.data.modules;
            // this.setState({modules : modulesData});
        }).catch((err) => {
            console.log(err);
        });
        // this.getModule();
    }

    getRows() {
        var t = []; 
        this.state.quotes.forEach(quote => {
            const id = quote.estimate_id;
            const num = quote.estimate_number; 
            const customer = quote.customer_name; 
            const statut = quote.status;
            const url = quote.branch_name; 
            console.log(id);
            console.log(num);
            console.log(customer);
            console.log(statut);
            console.log(url);
            t.push(id);
            t.push(num);
            t.push(customer);
            t.push(statut);
            t.push(url);
        }) 
        return t
    }

    // getTableau() {
    //     var rows = this.getRows();
    //     return rows.map((row) => {
    //         return <StyledTableRow>{row.invoice_id}</StyledTableRow>
    //     })
    // }

    // getRowsData = function(column){
    //     if(this.props.role !== "App Administrator") {
    //         var items = this.props.records;
    //         var keys = this.getKeys();
    //         return items.map((row)=>{
    //             return <StyledTableRow key={row.name}><RenderRow data={row} role={this.props.role} keys={keys}/></StyledTableRow>
    //         })
    //     } else {
    //         var cols = ["Nom","Afficher"];
    //         return column.map((row)=>{
    //             return <StyledTableRow key={row}><RenderRow data={row} module={this.props.module} role={this.props.role} columns={this.props.columns} keys={cols}/></StyledTableRow>
    //         })
    //     }
    // }
    // componentDidMount() {
    //     axios.get(baseUrl+"books/invoices/getAllInvoices/"+this.state.organization.organization_id).then((response) => {
    //         console.log(response);
    //         // state.organization orgaID;
    //         // const modulesData = response.data.modules;
    //         // this.setState({modules : modulesData});
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    //     // this.getModule();
    // }
    // console.log(this.state.organization);
    // const InvoicePage = () => {
    //     <ListItemIcon>
    //     {index % 2 === 0 ? 
    //     <Button href="index.html#/crm" startIcon={<CardMedia component="img" height="40" image='https://www.zohowebstatic.com/sites/default/files/styles/product-home-page/public/icon-crm_blue.png' />}/> : 
    //     <Button startIcon={<CardMedia component="img" height="40" image='https://www.zoho.com/books/blue-logo.svg' />}/>}
    //   </ListItemIcon>
    
    render() {
        console.log(this.state.organization.organization_id);
        // console.log(this.state.invoices.length);
        // var nb = this.state.invoices.length;
        return (
            <><h2>Hello World !!</h2><div>
                <h3 align="center">Devis</h3>
                <Button button onClick={() => {
                                    this.quote();
                                    // this.handleClick(false);
                                }}>
                                    Quotes
                                    {/* {this.props.userRole === "App Administrator" ? <ListItemText primary={"CRM"}/> : <ListItemText primary={"Dashboard"}/> } */}
                        </Button>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell>N° de facture</StyledTableCell>
                                <StyledTableCell>Nom du client</StyledTableCell>
                                <StyledTableCell>Email du client</StyledTableCell>
                                <StyledTableCell>Lien URL</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.getRows()}
                            {this.state.quotes.forEach(quote => {
                                <StyledTableRow>{quote.estimate_id}{quote.estimate_number}{quote.customer_name}{quote.status}{quote.branch_name}</StyledTableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <Typography>Bnjour {this.state.invoices[1].invoice_id} </Typography> */}
                {/* {this.getRows()}
                {this.state.invoices.forEach(invoice => {
                    <Typography>ID : {invoice.invoice_id} <br></br> N° de facture : {invoice.invoice_number} <br></br> Nom du client : {invoice.customer_name} <br></br> Email du client : {invoice.email}  <br></br> Lien URL : {invoice.invoice_url} <br></br><br></br><br></br></Typography>
                    })} */}
            </div></>
        );
    }
// };
}
export default QuotePage;