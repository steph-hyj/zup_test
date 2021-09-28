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
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Button, CardMedia } from "@material-ui/core";
import axios from 'axios';

import App from "../App";
import NavbarCRM from "./NavbarCRM";

var baseUrl = "http://localhost:3000/server/crm_crud/";

const drawerWidth = 180;

/**Navbar Design */
const styles = theme => ({

  root: {
    display: "flex",
    height: "100%",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
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
              {this.state.role === "App Administrator" ? 
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
                :
                <div>
                </div>
              }
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
              {this.props.app === "crm" ? <NavbarCRM userEmail={this.state.userEmail} userRole={this.state.role}/> : <App />}
            </main>
        </div>
      );
    }
    else
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
              {this.state.role === "App Administrator" ? 
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
                :
                <div>
                </div>
              }
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
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Navbar);
