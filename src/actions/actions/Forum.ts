import { action } from "typesafe-actions";

import * as Constants from "../constants";

export const ActionQuoteForumPost = (content: string) => action(
  Constants.FORUM_QUOTE_POST,
  content
);