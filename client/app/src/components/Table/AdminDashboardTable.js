import React, { useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from '@mui/material/Checkbox';
import { Switch } from '@mui/material';
// core components
import styles from "../../assets/jss/style/components/tableStyle.js";
import axios from "axios";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const [moduleCreate, setModuleCreate] = React.useState();
  const [moduleRead, setModuleRead] = React.useState();
  const [moduleUpdate, setModuleUpdate] = React.useState();
  const [moduleDelete, setModuleDelete] = React.useState();
  const { tableHead, tableData, tableHeaderColor, tableApi, tableSwitch } = props;

  var baseUrl = "http://localhost:3000/server/crm_crud/";

  /**Execute a function according to the action of switch */
  function userUpdate(checked,permission,role,module,moduleID) {
        if(checked.target.checked !== true)
        {
            this.deleteModule(moduleID);
        }
        else
        {
            this.addModule(permission,role,module);
        }
    }

    /**Insert Into Module(Table) the module to display*/
    function addModule (permission, role,module) {
        axios.post(baseUrl+"module/"+module, {
            role,
            permission
        }).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Delete from Module(Table) the module to hide*/
    function deleteModule (moduleID) {
        axios.delete(baseUrl+"module/"+moduleID).then((response) => {
            console.log(response);
        }).catch((err) => {
            console.log(err);
        });
    }

    const handleChangeCreate = (event,name,scope) => {
        setModuleCreate({[name + scope] : event.target.checked})
    };

    const handleChange = (event,name,scope) => {
        setModuleRead({[name + scope] : event.target.checked})
    };

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
                    if(api === "plural_label") {
                        return (
                            <TableCell className={classes.tableCell} key={api}>
                                {prop[api]}
                            </TableCell>
                        )
                    } else if (api === "Create") {
                        return (
                            <TableCell className={classes.tableCell} key={api}>
                                <Switch id={prop["plural_label"]+api}
                                        checked={moduleCreate}
                                        onChange={(event) => {handleChangeCreate(event,prop["plural_label"],api) 
                                                                console.log(moduleCreate)}}
                                        value= {prop["plural_label"] + "Create"}
                                        color="success"
                                /> 
                            </TableCell>
                        )
                    } else if (api === "Read") {
                        return (
                            <TableCell className={classes.tableCell} key={api}>
                                <Switch id={prop["plural_label"]+api}
                                        checked={moduleRead}
                                        onChange={(event) => {handleChange(event,prop["plural_label"],api) 
                                                                console.log(moduleRead)}}
                                        value= {prop["plural_label"] + "Read"}
                                        color="success"
                                /> 
                            </TableCell>
                        )
                        
                    } else if (api === "Update") {
                        return (
                            <TableCell className={classes.tableCell} key={api}>
                                <Switch id={prop["plural_label"]+api}
                                        checked={moduleUpdate}
                                        onChange={(event) => {handleChange(event,prop["plural_label"],api) 
                                                                console.log(moduleUpdate)}}
                                        value= {prop["plural_label"] + "Update"}
                                        color="success"
                                /> 
                            </TableCell>
                        )
                        
                    } else if (api === "Delete") {
                        return (
                            <TableCell className={classes.tableCell} key={api}>
                                <Switch id={prop["plural_label"]+api}
                                        checked={moduleDelete}
                                        onChange={(event) => {handleChange(event,prop["plural_label"],api) 
                                                                console.log(moduleDelete)}}
                                        value= {prop["plural_label"] + "Delete"}
                                        color="success"
                                /> 
                            </TableCell>
                        )
                        
                    }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
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
