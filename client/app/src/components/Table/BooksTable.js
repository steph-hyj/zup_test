import React, { useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { Switch } from '@mui/material';
// core components
import styles from "../../assets/jss/style/components/tableStyle.js";
import axios from "axios";

const useStyles = makeStyles(styles);

export default function BooksTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor, tableApi } = props;
  var baseUrl = "http://localhost:3000/server/crm_crud/";

  useEffect(() => {
    
   
  },[])

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                {tableApi.map(api => {
                  return (
                      <TableCell className={classes.tableCell} key={api}>
                            {prop[api]}     
                      </TableCell>
                  )
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

BooksTable.defaultProps = {
  tableHeaderColor: "gray",
};

BooksTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
