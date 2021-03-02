import { store } from "../store";

import * as Actions from "./actions";

export const Login = (response: UserType) => (
  store.dispatch(Actions.AuthLogin(response))
);

export const Logout = () => (
  store.dispatch(Actions.AuthLogout())
);

export const CheckAuth = () => (
  store.dispatch(Actions.AuthCheck())
);