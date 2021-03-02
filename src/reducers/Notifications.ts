import { createReducer } from "typesafe-actions";

import * as Constants from "../actions/constants";

interface StateType {
  response: NotificationDTO;
  last_update_time?: number;
}

const EmptyResponse: NotificationDTO = {
  creationDate: "",
  newPM: false,
  newPost: false,
  newSQ: false,
  newTorrent: false,
  newCommentOnMyTorrent: []
};

const InitialState: StateType = {
  response: EmptyResponse,
  last_update_time: undefined
};

const OnRequest = (state: StateType): StateType => ({
  response: state.response,
  last_update_time: new Date().getTime()
});

const OnSuccess = (
  state: StateType,
  response: NotificationDTO
): StateType => ({
  response: response,
  last_update_time: state.last_update_time
});

export const Notifications = createReducer(InitialState)
  .handleType(
    Constants.NOTIFICATIONS_CHECK_REQUEST,
    (state) => OnRequest(state)
  )
  .handleType(
    Constants.NOTIFICATIONS_CHECK_SUCCESS,
    (state, action) => OnSuccess(state, action.payload)
  );