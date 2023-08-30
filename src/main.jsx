import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import "./GlobalStyles/index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="459909710810-bdcc4k0gf4r32cp5dvb78u7e1d8fd144.apps.googleusercontent.com" >
  <React.StrictMode>
   <BrowserRouter>
    <App />
  </BrowserRouter>,
  </React.StrictMode>
  </GoogleOAuthProvider>
);