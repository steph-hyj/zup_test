import axios from 'axios';

import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Sidenav from "./examples/Sidenav";
import theme from "./assets/theme";
import routes from "./routes";
import userRoutes from "./userRoutes";
import { useMaterialUIController, setMiniSidenav } from "./context";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const [userRole, setUserRole] = useState({});

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:3000/server/crm_crud/getUserDetails").then((response) => {
      setUserRole(response.data.userRole);
      }).catch((err) => {
          console.log(err);
    });
  },[]);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  var modulesRoutes = null;

  if(userRole.length > 0) {
    if(userRole === "App Administrator") {
      modulesRoutes = routes();
    } else {
      modulesRoutes = userRoutes();
    }
  }
  
 
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });
  if(modulesRoutes)
  {
    if(modulesRoutes.length > 1 )
    {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brandName="TranZition"
                routes={modulesRoutes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
            </>
          )}
          <Routes>
            {getRoutes(modulesRoutes)}
            <Route path="/" />
          </Routes>
        </ThemeProvider>
      );
    }
  }
}
