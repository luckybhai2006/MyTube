import NProgress from "nprogress";
import "../styles/nprogress.css";

NProgress.configure({
  showSpinner: false, // hide spinner
  speed: 1500, // progress bar speed
  trickleSpeed: 400, // trickle speed
});

export default NProgress;
