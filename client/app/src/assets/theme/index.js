// @mui material components
import { createTheme } from "@mui/material/styles";
// import Fade from "@mui/material/Fade";

// Material Dashboard 2 PRO React base styles
import colors from "../theme/base/colors";
import breakpoints from "../theme/base/breakpoints";
import typography from "../theme/base/typography";
import boxShadows from "../theme/base/boxShadows";
import borders from "../theme/base/borders";
import globals from "../theme/base/globals";

// Material Dashboard 2 PRO React helper functions
import boxShadow from "../theme/functions/boxShadow";
import hexToRgb from "../theme/functions/hexToRgb";
import linearGradient from "../theme/functions/linearGradient";
import pxToRem from "../theme/functions/pxToRem";
import rgba from "../theme/functions/rgba";

// Material Dashboard 2 PRO React components base styles for @mui material components
import sidenav from "../theme/components/sidenav";
import card from "../theme/components/card";
import cardMedia from "../theme/components/card/cardMedia";
import cardContent from "../theme/components/card/cardContent";
import button from "../theme/components/button";
import iconButton from "../theme/components/iconButton";
import divider from "../theme/components/divider";
import tableContainer from "../theme/components/table/tableContainer";
import tableHead from "../theme/components/table/tableHead";
import tableCell from "../theme/components/table/tableCell";
import linearProgress from "../theme/components/linearProgress";
import breadcrumbs from "../theme/components/breadcrumbs";
import slider from "../theme/components/slider";
import avatar from "../theme/components/avatar";
import tooltip from "../theme/components/tooltip";
import appBar from "../theme/components/appBar";
import tabs from "../theme/components/tabs";
import tab from "../theme/components/tabs/tab";
import flatpickr from "../theme/components/flatpickr";
import container from "../theme/components/container";
import popover from "../theme/components/popover";
import buttonBase from "../theme/components/buttonBase";
import icon from "../theme/components/icon";
import svgIcon from "../theme/components/svgIcon";
import link from "../theme/components/link";
import dialog from "../theme/components/dialog";
import dialogTitle from "../theme/components/dialog/dialogTitle";
import dialogContent from "../theme/components/dialog/dialogContent";
import dialogContentText from "../theme/components/dialog/dialogContentText";
import dialogActions from "../theme/components/dialog/dialogActions";

export default createTheme({
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    pxToRem,
    rgba,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...globals,
        ...flatpickr,
        ...container,
      },
    },
    MuiDrawer: { ...sidenav },
    MuiCard: { ...card },
    MuiCardMedia: { ...cardMedia },
    MuiCardContent: { ...cardContent },
    MuiButton: { ...button },
    MuiIconButton: { ...iconButton },
    MuiDivider: { ...divider },
    MuiTableContainer: { ...tableContainer },
    MuiTableHead: { ...tableHead },
    MuiTableCell: { ...tableCell },
    MuiLinearProgress: { ...linearProgress },
    MuiBreadcrumbs: { ...breadcrumbs },
    MuiSlider: { ...slider },
    MuiAvatar: { ...avatar },
    MuiTooltip: { ...tooltip },
    MuiAppBar: { ...appBar },
    MuiTabs: { ...tabs },
    MuiTab: { ...tab },
    MuiPopover: { ...popover },
    MuiButtonBase: { ...buttonBase },
    MuiIcon: { ...icon },
    MuiSvgIcon: { ...svgIcon },
    MuiLink: { ...link },
    MuiDialog: { ...dialog },
    MuiDialogTitle: { ...dialogTitle },
    MuiDialogContent: { ...dialogContent },
    MuiDialogContentText: { ...dialogContentText },
    MuiDialogActions: { ...dialogActions },
  },
});
