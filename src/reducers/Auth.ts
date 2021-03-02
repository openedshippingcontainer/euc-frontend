import { createReducer } from "typesafe-actions";

import * as Constants from "../actions/constants";

interface StateType {
  is_authenticated: boolean;
  user?: AuthUserType;
}

const InitialState: StateType = {
  is_authenticated: false,
  user: undefined
};

const ActionLogin = (response: UserType): StateType => {
  const can_login = (
    response.status === "CONFIRMED" &&
    response.enabled === "YES" &&
    response.parked === "NO"
  );

  if (can_login) {
    localStorage.setItem("access_token", response.passhash);

    const user: AuthUserType = {
      id: response.id,
      username: response.username,
      email: response.email,
      class_id: response.clazz,
      class_name: response.className,
      avatar: response.avatar,
      passkey: response.passkey
    };

    localStorage.setItem("user", JSON.stringify(user));
    return { is_authenticated: true, user: user } as StateType;
  }

  return ActionLogout();
}

const ActionCheck = (): StateType => {
  const user = localStorage.getItem("user");

  // Remove options item starting with v1.3.4
  const options = localStorage.getItem("options");
  if (options)
    localStorage.removeItem("options");

  const access_token = localStorage.getItem("access_token");
  return {
    is_authenticated: (!!user && !!access_token),
    user: user ? JSON.parse(user) : undefined
  };
}

const ActionLogout = (): StateType => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");

  return InitialState;
}

export const Auth = createReducer(InitialState)
  .handleType(
    Constants.AUTH_LOGIN,
    (_, action) => ActionLogin(action.payload)
  )
  .handleType(Constants.AUTH_CHECK, () => ActionCheck())
  .handleType(Constants.AUTH_LOGOUT, () => ActionLogout());