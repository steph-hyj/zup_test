'use strict';
const express = require('express');
const app = express();
app.use(express.json());

/** Route to generate token, get user details and get user's id in ZCrm */
app.use("/",require('./routes/user.js'));

/** Route for related list*/
app.use("/list",require("./routes/CRM/list.js"));
/** Route for module*/
app.use("/module",require("./routes/CRM/module.js"));
/** Route for record */
app.use("/record",require('./routes/CRM/records.js'));

/** Route for ZBooks */
app.use("/books",require('./routes/Books/organization.js'));
app.use("/books/invoices",require('./routes/Books/invoice.js'));
app.use("/books/quotes",require('./routes/Books/quote.js'));
app.use("/books/customers",require('./routes/Books/customer.js'));

module.exports = app;