import { useState, useEffect } from "react";
// import { Routes } from "react-router-dom";
import { Routes, Route, useLocation} from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Sidenav from "./examples/Sidenav";
import theme from "./assets/theme";
import routes from "./routes";
import Form from "./layouts/CRMPage/Form";
import AdminDashboardCRM from "./layouts/DashboardAdminCRM";
// import UpdateForm from "./layouts/CRMPage/Form";

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
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const modulesRoutes = routes();
   
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

    if(modulesRoutes) {
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
            <Route exact path="/:module/createForm" element={<Form />} key="createForm"/>
            <Route exact path="/:module/updateForm/:deal_id" element={<Form />} key="updateForm"/>
          </Routes>
        </ThemeProvider>
      );
    } else {
      return (
        <h1>Wait</h1>
      )
    }
}
