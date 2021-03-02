import { newRidgeState } from "react-ridge-state";

interface PreferencesConfig {
  showRobotTorrents: boolean;
}

export const PreferencesContext = newRidgeState<PreferencesConfig>(
  { showRobotTorrents: true },
  {
    onSet: (new_state) => {
      try {
        localStorage.setItem("preferences", JSON.stringify(new_state));
      } catch (e) {
        console.log("Greška se dogodila prilikom čuvanja novog lokalnog stanja za korisnička podešavanja.");
      }
    },
  }
);