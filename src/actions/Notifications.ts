import { store } from "../store";
import { RootStateType } from "../reducers";

import * as Api from "../api";
import * as Actions from "./actions";

// In production check for notifications every 40s
// In development check for notifications every 20min
const NOTIFICATIONS_CHECK_INTERVAL = (
  (process.env.NODE_ENV === "production") ? 40000 : (1000 * 20 * 60)
);

const ShouldCheck = (last_update_time?: number): boolean => {
  if (!last_update_time)
    return true;

  return (new Date().getTime() > (last_update_time + NOTIFICATIONS_CHECK_INTERVAL));
}

const ConditionalNotificationCheck = () => (
  (dispatch: (_: unknown) => void, getState: () => RootStateType) => {
    const { notifications } = getState();

    if (ShouldCheck(notifications.last_update_time)) {
      dispatch(Actions.ActionNotificationsCheckRequest());

      Api.GetNotifications()
        .then((response) => {
          dispatch(Actions.ActionNotificationsCheckSuccess(response));
        });
    }
  }
);

export const CheckNotifications = () => {
  // @ts-ignore
  store.dispatch(ConditionalNotificationCheck());
}