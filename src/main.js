import "./styles/global.css";
import "./components/app-shell/app-shell.js";

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

window.addEventListener("error", (event) => {
  console.error("Uncaught error:", event.error);
});
