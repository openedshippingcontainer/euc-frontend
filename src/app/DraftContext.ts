import { newRidgeState } from "react-ridge-state";

export type DraftType = Record<number, string>;

export const DraftContext = newRidgeState<DraftType>(
  {},
  {
    onSet: (new_state) => {
      try {
        localStorage.setItem("forum_drafts", JSON.stringify(new_state));
      } catch (e) {
        console.log("Greška se dogodila prilikom čuvanja novog lokalnog stanja za nacrte.");
      }
    },
  }
);