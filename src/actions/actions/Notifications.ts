import { action } from "typesafe-actions";

import * as Constants from "../constants";

export const ActionNotificationsCheckRequest = () => action(
  Constants.NOTIFICATIONS_CHECK_REQUEST
);

export const ActionNotificationsCheckSuccess = (
  response: NotificationDTO
) => action(
  Constants.NOTIFICATIONS_CHECK_SUCCESS,
  response
);