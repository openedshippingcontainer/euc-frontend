import { newRidgeState } from "react-ridge-state";

type Theme = "dark" | "light";

export const ThemeContext = newRidgeState<Theme>(
  "dark",
  {
    onSet: (new_state) => {
      try {
        const body = document.body;
        if (body)
          body.className = new_state;

        localStorage.setItem("theme", new_state);
      } catch (e) {
        console.log("Greška se dogodila prilikom čuvanja novog lokalnog stanja za temu.");
      }
    },
  }
);