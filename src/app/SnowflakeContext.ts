import { newRidgeState } from "react-ridge-state";

interface SnowflakeConfig {
  enabled: boolean;
  color: string;
  count: number;
}

export const SnowflakeContext = newRidgeState<SnowflakeConfig>(
  {
    enabled: false,
    color: "#dee4fd",
    count: 100
  },
  {
    onSet: (new_state) => {
      try {
        localStorage.setItem("snowflakes", JSON.stringify(new_state));
      } catch (e) {
        console.log("Greška se dogodila prilikom čuvanja novog lokalnog stanja za pahuljice.");
      }
    },
  }
);