import {
  createDarkTheme,
  createLightTheme,
  darkThemePrimitives,
  lightThemePrimitives
} from "baseui";
import { ThemePrimitives } from "baseui/theme";

const DarkThemePrimitives: ThemePrimitives = {
  ...darkThemePrimitives,
  primary: "#B3905F",
  primaryFontFamily: "Inter",
  primaryB: "#191919"
};

export const DarkTheme = createDarkTheme(
  DarkThemePrimitives,
  {
    name: "dark",
    colors: {
      linkText: "#BEA074",
      linkVisited: DarkThemePrimitives.primary,
      buttonSecondaryText: "#E2E2E2"
    },
    typography: {
      LabelXSmall: { fontWeight: "normal" },
      LabelSmall: { fontWeight: "normal" }
    }
  }
);

const LightThemePrimitives: ThemePrimitives = {
  ...lightThemePrimitives,
  primaryFontFamily: "Inter"
};

export const LightTheme = createLightTheme(
  LightThemePrimitives,
  {
    name: "light",
    colors: {
      menuFillHover: LightThemePrimitives.mono300
    },
    typography: {
      LabelXSmall: { fontWeight: "normal" },
      LabelSmall: { fontWeight: "normal" }
    }
  }
);