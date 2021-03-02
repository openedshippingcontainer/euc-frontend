import { action } from "typesafe-actions";

import * as Constants from "../constants";

export const AuthLogin = (response: UserType) => action(
  Constants.AUTH_LOGIN, response
);

export const AuthCheck = () => action(Constants.AUTH_CHECK);
export const AuthLogout = () => action(Constants.AUTH_LOGOUT);