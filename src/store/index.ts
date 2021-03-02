import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";

import { RootReducer } from "../reducers";

function ConfigureStoreProd() {
  return createStore(RootReducer, undefined, compose(applyMiddleware(thunk)));
}

function ConfigureStoreDev() {
  const middlewares = [
    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant(),

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/reduxjs/redux-thunk#injecting-a-custom-argument
    thunk
  ];

  const composeEnhancers = (
    typeof window === "object" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
    compose
  );

  return createStore(
    RootReducer,
    undefined,
    composeEnhancers(applyMiddleware(...middlewares))
  );
}

const ConfigureStore = (
  process.env.NODE_ENV === "production" ?
  ConfigureStoreProd :
  ConfigureStoreDev
);

export const store = ConfigureStore();