import { combineReducers } from "redux";
import { ActionType, StateType } from "typesafe-actions";

import { Auth } from "./Auth";
import { Shoutbox } from "./Shoutbox";
import { Forum } from "./Forum";
import { Notifications } from "./Notifications";

import * as ReduxActions from "../actions/actions";

type RootAction = ActionType<typeof ReduxActions>;

declare module "typesafe-actions" {
  interface Types {
    RootAction: RootAction;
  }
}

export const RootReducer = combineReducers({
  auth: Auth,
  shoutbox: Shoutbox,
  forum: Forum,
  notifications: Notifications
});

export type RootStateType = StateType<typeof RootReducer>;