import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import moment from "moment";

import { App } from "./app/App";
import { store } from "./store";
import * as Actions from "./actions";

import PackageJSON from "../package.json";

// Initialize Sentry only in production builds
/*if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "your-sentry-url",
    release: "frontend@" + PackageJSON.version,
    // https://stackoverflow.com/questions/55738408/javascript-typeerror-cancelled-error-when-calling-fetch-on-ios
    ignoreErrors: [
      "TypeError: Failed to fetch",
      "TypeError: NetworkError when attempting to fetch resource.",
      "TypeError: Cancelled"
    ]
  });
}*/

Actions.CheckAuth();

// Set Moment.js locale to Serbian
moment.locale("sr");

render(
  (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  ),
  document.getElementById("app")
);
