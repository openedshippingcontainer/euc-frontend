import { store } from "../store";
import * as Actions from "./actions";

export const QuoteForumPost = (content: string) => (
  store.dispatch(Actions.ActionQuoteForumPost(content))
);