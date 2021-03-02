import { createReducer } from "typesafe-actions";

import * as Constants from "../actions/constants";

interface StateType {
  content: string;
}

const InitialState: StateType = { content: "" };

const ActionQuoteForumPost = (content: string): StateType => ({
  content: content
});

export const Forum = createReducer(InitialState)
  .handleType(
    Constants.FORUM_QUOTE_POST,
    (_, action) => ActionQuoteForumPost(action.payload)
  );