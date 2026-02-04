import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/all.scss";
//import "./assets/style.css";

import App from "./App.jsx";

import MyApp from "./MyApp.jsx";
import AppUseState from "./AppUseState.jsx";
import AppUseEffect from "./AppUseEffect.jsx";

import AppUseRef from "./AppUseRef.jsx";

//預設
import exportJs from "./assets/exportJs";
exportJs();

//具名
import { myName, fnMyName } from "./assets/exportJs";
console.log(myName);

fnMyName();

createRoot(document.getElementById("root")).render(<AppUseRef />);
