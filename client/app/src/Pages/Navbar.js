import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
//import Divider from "@material-ui/core/Divider";
import Divider from '@mui/material/Divider';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Button, CardMedia } from "@material-ui/core";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import axios from 'axios';

import App from "../App";
import NavbarCRM from "./NavbarCRM";
import RolePermission from '../views/TableList/RolePermissionPage';
import ConnectionPage from '../views/TableList/ConnectionPage';

//Version dev
var baseUrl = "http://localhost:3000/server/crm_crud/";

//Version deployment
//var baseUrl = "https://zup-20078233842.development.catalystserverless.eu/server/crm_crud/";

const drawerWidth = 250;

/**Navbar Design */
const styles = theme => ({

  root: {
    display: "flex",
    height: "100%",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "white",
    color: "black"
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 6,
    marginRight: 6
  },
  menuButtonIconClosed: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(0deg)"
  },
  menuButtonIconOpen: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(180deg)"
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9 + 1
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar 
  },
  content: {
    flexGrow: 1,
  },
  page: {
    maxWidth: 1000
  },
  grow: {
    flexGrow: 1,
    marginLeft: 5
  }
});

class Navbar extends React.Component {
  state = {
    open: false,
    anchorEl: null,
    role : null,
    userEmail : null,
    user : []
  };

  handleDrawerOpen = () => {
    this.setState({ open: !this.state.open });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  /**Execute the function when the component is called */
  componentDidMount() {
    axios.get(baseUrl+"getUserDetails").then((response) => {
      this.setState({ role : response.data.userRole, userEmail : response.data.user.email_id});
      }).catch((err) => {
          console.log(err);
    });
  }

  navbarView = (app, userEmail, role) => {
    if(app === "crm") {
      return <NavbarCRM userEmail={userEmail} userRole={role} />
    } else if(app === "role") {
      return <RolePermission />
    } else if(app === "roleConnection") { 
      return <ConnectionPage title="Connexion"/>
    } else {
      return <App />
    }
  }

  render() {
    const { classes, theme } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    if(this.state.role === "App Administrator") {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classes.appBar}
            fooJon={classNames(classes.appBar, {
              [classes.appBarShift]: this.state.open
            })}
          >
            <Toolbar disableGutters={true}>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  className={classes.menuButton}
                >
                  <MenuIcon
                    classes={{
                      root: this.state.open
                        ? classes.menuButtonIconOpen
                        : classes.menuButtonIconClosed
                    }}
                  />
                </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                className={classes.grow}
                noWrap
              >
                Zoho Unified Portal
              </Typography>
              <div>
                <IconButton
                  aria-owns={open ? "menu-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={() => {window.location.href = "logout.html";}}>Logout</MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
            <Drawer
              variant="permanent"
              className={classNames(classes.drawer, {
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open
              })}
              classes={{
                paper: classNames({
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open
                  })
              }}
              open={this.state.open}
            >
              <div className={classes.toolbar} />
              <List>
                {["Users", "Roles & Permissions"].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>
                      {index % 2 === 0 ?
                        <Button href="index.html#/" startIcon={<GroupIcon />}/>
                      :
                        <Button href="index.html#/role_permissions" startIcon={<AdminPanelSettingsIcon />}/>
                      }
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
                {this.state.open ? 
                  <Divider textAlign="left">
                    <h2>Applications</h2>
                  </Divider>
                : 
                  <Divider textAlign="left">
                  </Divider>
                }
                {["Zoho CRM", "Zoho Books"].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? 
                    <Button href="index.html#/crm" startIcon={<CardMedia component="img" height="40" image='https://www.zohowebstatic.com/sites/default/files/styles/product-home-page/public/icon-crm_blue.png' />}/> : 
                    <Button startIcon={<CardMedia component="img" height="40" image='https://www.zoho.com/books/blue-logo.svg' />}/>}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
                ))}
              </List>
              <Divider />
            </Drawer>
            <main className={classes.content}>
              <div className={classes.toolbar} />
              {this.navbarView(this.props.app, this.state.userEmail, this.state.role)}
            </main>
        </div>
      );
    }
    else if (this.state.role !== "App Administrator" && this.state.role !== null)
    {
        return(
          <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classes.appBar}
            fooJon={classNames(classes.appBar, {
              [classes.appBarShift]: this.state.open
            })}
          >
            <Toolbar disableGutters={true}>
              <Typography
                variant="h6"
                color="inherit"
                className={classes.grow}
                noWrap
              >
                Zoho Unified Portal
              </Typography>
              <div>
                <IconButton
                  aria-owns={open ? "menu-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={() => {window.location.href = "logout.html";}}>Logout</MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <NavbarCRM userEmail={this.state.userEmail} userRole={this.state.role}/>
          </main> 
          </div>
        )
    }
    else
    {
      return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
      )
    }
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Navbar);
