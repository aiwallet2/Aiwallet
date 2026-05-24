import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import {
  PrivyProvider,
} from "@privy-io/react-auth";

const root =
  ReactDOM.createRoot(
    document.getElementById("root")
  );

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmpk5bjxb006n0bkzuskn1sh7"
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
