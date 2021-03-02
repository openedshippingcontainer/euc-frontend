import { createReducer } from "typesafe-actions";

import * as Constants from "../actions/constants";

interface StateType {
  shouts: Array<ShoutboxDTO>;
  is_updating: boolean;
  last_update: number;
  last_update_id: number;
  last_send_time: number;
  error: boolean;
}

const InitialState: StateType = {
  shouts: [],
  is_updating: false,
  last_update: 0,
  last_update_id: 0,
  last_send_time: 0,
  error: false
};

const ShoutboxFetchRequest = (): StateType => ({
  ...InitialState,
  last_update: new Date().getTime()
});

const ShoutboxFetchSuccess = (
  state: StateType,
  response: Array<ShoutboxDTO>
): StateType => ({
  ...state,
  shouts: response,
  last_update_id: (
    response.length !== 0 ? response[0].id : state.last_update_id
  )
});

const ShoutboxFetchFailure = (state: StateType): StateType => ({
  ...state,
  shouts: [],
  error: true
});

const ShoutboxFetchDeltaRequest = (state: StateType): StateType => ({
  ...state,
  is_updating: true,
  last_update: new Date().getTime()
});

const ShoutboxFetchDeltaSuccess = (
  state: StateType,
  response: Array<ShoutboxDTO>
): StateType => ({
  ...state,
  shouts: [...response, ...state.shouts],
  last_update_id: (
    response.length !== 0 ? response[0].id : state.last_update_id
  ),
  is_updating: false
});

const ShoutboxSendShout = (
  state: StateType
): StateType => ({
  ...state,
  last_send_time: new Date().getTime()
});

const ShoutboxRemoveShout = (
  state: StateType,
  id: number
): StateType => ({
  ...state,
  shouts: state.shouts.filter((shout) => shout.id !== id)
});

export const Shoutbox = createReducer(InitialState)
  .handleType(
    Constants.SHOUTBOX_FETCH_REQUEST,
    () => ShoutboxFetchRequest()
  )
  .handleType(
    Constants.SHOUTBOX_FETCH_SUCCESS,
    (state, action) => ShoutboxFetchSuccess(state, action.payload)
  )
  .handleType(
    Constants.SHOUTBOX_FETCH_FAILURE,
    (state) => ShoutboxFetchFailure(state)
  )
  .handleType(
    Constants.SHOUTBOX_FETCH_DELTA_REQUEST,
    (state) => ShoutboxFetchDeltaRequest(state)
  )
  .handleType(
    Constants.SHOUTBOX_FETCH_DELTA_SUCCESS,
    (state, action) => ShoutboxFetchDeltaSuccess(state, action.payload)
  )
  .handleType(
    Constants.SHOUTBOX_SEND_SHOUT,
    (state) => ShoutboxSendShout(state)
  )
  .handleType(
    Constants.SHOUTBOX_REMOVE_SHOUT,
    (state, action) => ShoutboxRemoveShout(state, action.payload)
  );