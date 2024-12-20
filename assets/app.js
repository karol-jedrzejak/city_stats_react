/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig). a
 */

// any CSS you import will output into a single css file (app.css in this case)
import "./styles/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

import "leaflet/dist/leaflet.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App tab="home" />);
