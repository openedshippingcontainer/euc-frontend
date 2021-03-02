import { action } from "typesafe-actions";

import * as Constants from "../constants";

export const ActionFetchShoutsRequest = () => action(
  Constants.SHOUTBOX_FETCH_REQUEST
);

export const ActionFetchShoutsSuccess = (
  response: Array<ShoutboxDTO>
) => action(
  Constants.SHOUTBOX_FETCH_SUCCESS,
  response
);

export const ActionFetchShoutsFailure = () => action(
  Constants.SHOUTBOX_FETCH_FAILURE
);

export const ActionFetchShoutsDeltaRequest = () => action(
  Constants.SHOUTBOX_FETCH_DELTA_REQUEST
);

export const ActionFetchShoutsDeltaSuccess = (
  response: Array<ShoutboxDTO>
) => action(
  Constants.SHOUTBOX_FETCH_DELTA_SUCCESS,
  response
);

export const ActionSendShout = () => action(
  Constants.SHOUTBOX_SEND_SHOUT
);

export const ActionRemoveShout = (id: number) => action(
  Constants.SHOUTBOX_REMOVE_SHOUT,
  id
);