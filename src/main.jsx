import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/base.css";
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/xp.css";
import "./styles/welcome.css";
createRoot(document.getElementById("root")).render(<App />);
