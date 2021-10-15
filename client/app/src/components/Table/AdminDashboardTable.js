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

export default function CustomTable(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({});
  const [role, setRole] = React.useState("");
  const { tableHead, tableData, tableHeaderColor, tableApi, tableState } = props;
  var baseUrl = "http://localhost:3000/server/crm_crud/";

  useEffect(() => {
    if(tableState.roles){
      setRole(tableState.roles)
    }

    for(const [key, value] of Object.entries(tableState)) {
      if(value === true || value === false) {
        setState(state => ({
          ...state,
          [key] : value
        }))
      }
    }
  },[tableState])

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

  /**Execute a function according to the action of switch */
  function moduleUpdate(checked,permission,role,module,moduleID) {
      if(checked.target.checked)
      {
        addModule(permission,role,module);
      }
      else
      {
        deleteModule(moduleID);
      }
    }

    const handleChange = (event,name,scope) => {
        setState({
          ...state,
          [name + scope] : event.target.checked
        });
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
                  return (
                      <TableCell className={classes.tableCell} key={api}>
                          {api === "plural_label" ? 
                            prop[api] 
                          : 
                            <Switch id={prop["plural_label"]+api}
                                    checked={state[prop["plural_label"]+api]}
                                    onChange={(event) => {
                                                handleChange(event,prop["plural_label"],api)
                                                moduleUpdate(event,api,role,prop["plural_label"],tableState[prop["plural_label"]+api+"ID"])
                                              }}
                                    color="success"
                            /> 
                          }
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
