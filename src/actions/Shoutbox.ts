import { store } from "../store";
import { RootStateType } from "../reducers";

import { toaster } from "baseui/toast";

import * as Api from "../api";
import * as Actions from "./actions";

// Allow a message to be sent every 5s
const SEND_SHOUT_INTERVAL = 5000;

// Allow a delta interval to be fetched only after 1s passed since last fetch
const FETCH_DELTA_INTERVAL = 1000;

export const FetchShouts = () => {
  store.dispatch(Actions.ActionFetchShoutsRequest());

  Api.FetchShouts()
    .then((response) => {
      store.dispatch(Actions.ActionFetchShoutsSuccess(response));
    })
    .catch(() => {
      store.dispatch(Actions.ActionFetchShoutsFailure());
    });
}

const CanFetchDelta = (last_update: number) => (
  new Date().getTime() > (last_update + FETCH_DELTA_INTERVAL)
);

const ConditionalFetchShoutsDelta = () => (
  (dispatch: (_: unknown) => void, getState: () => RootStateType) => {
    const { shoutbox } = getState();

    // Don't fetch unless 1s has passed since last fetch
    if (!CanFetchDelta(shoutbox.last_update))
      return;

    dispatch(Actions.ActionFetchShoutsDeltaRequest());

    Api.FetchShoutsDelta(shoutbox.last_update_id)
      .then((response) => {
        store.dispatch(Actions.ActionFetchShoutsDeltaSuccess(response));
      });
  }
);

export const FetchShoutsDelta = () => {
  // @ts-ignore
  store.dispatch(ConditionalFetchShoutsDelta());
}

const CanSendShout = (last_send_time: number) => (
  new Date().getTime() > (last_send_time + SEND_SHOUT_INTERVAL)
);

const ConditionalSendShout = (text: string, reset_callback: () => void) => (
  (dispatch: (_: unknown) => void, getState: () => RootStateType) => {
    const { shoutbox } = getState();

    if (!CanSendShout(shoutbox.last_send_time)) {
      toaster.warning("Ne tako brzo, kauboju! Strpi se!", {});
      return;
    }

    dispatch(Actions.ActionSendShout());

    Api.SendShout(text)
      .then(() => {
        reset_callback();
        FetchShoutsDelta();
      })
      .catch(() => {
        toaster.negative(`Greška se dogodila prilikom slanja poruke`, {});
      });
  }
);

export const SendShout = (text: string, reset_callback: () => void) => {
  // @ts-ignore
  store.dispatch(ConditionalSendShout(text, reset_callback));
}

export const RemoveShout = (id: number) => {
  Api.RemoveShout(id)
    .then(() => {
      store.dispatch(Actions.ActionRemoveShout(id));
      toaster.positive("Uspešno obrisana poruka!", {});
    })
    .catch(() => {
      toaster.negative(`Greška se dogodila prilikom brisanja poruke`, {});
    });
}