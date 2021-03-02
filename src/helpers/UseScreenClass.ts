import { useState, useEffect } from "react";

const GetViewPort = () => {
  if (window !== undefined && window.innerWidth) {
    return window.innerWidth;
  }
  return null;
};

const Configurations = {
  breakpoints: [576, 768, 992, 1200, 1600],
  containerWidths: [540, 750, 960, 1140, 1540],
  gutterWidth: 30,
  gridColumns: 12,
  defaultScreenClass: "xxl",
  maxScreenClass: "xxl",
};

const ScreenClasses = ["xs", "sm", "md", "lg", "xl", "xxl"];

export const useScreenClass = () => {
  const getScreenClass = () => {
    const { breakpoints, defaultScreenClass, maxScreenClass } = Configurations;

    let newScreenClass = defaultScreenClass;

    const viewport = GetViewPort();
    if (viewport) {
      newScreenClass = "xs";
      if (breakpoints[0] && viewport >= breakpoints[0]) newScreenClass = "sm";
      if (breakpoints[1] && viewport >= breakpoints[1]) newScreenClass = "md";
      if (breakpoints[2] && viewport >= breakpoints[2]) newScreenClass = "lg";
      if (breakpoints[3] && viewport >= breakpoints[3]) newScreenClass = "xl";
      if (breakpoints[4] && viewport >= breakpoints[4]) newScreenClass = "xxl";
    } else {
      newScreenClass = "lg";
    }

    const newScreenClassIndex = ScreenClasses.indexOf(newScreenClass);
    const maxScreenClassIndex = ScreenClasses.indexOf(maxScreenClass);
    if (
      maxScreenClassIndex >= 0 &&
      newScreenClassIndex > maxScreenClassIndex
    ) {
      newScreenClass = ScreenClasses[maxScreenClassIndex];
    }

    return newScreenClass;
  };

  const [screenClass, setScreenClass] = useState(getScreenClass());

  useEffect(() => {
    const handleWindowResized = () => setScreenClass(getScreenClass());
    window.addEventListener("resize", handleWindowResized, false);

    return () => {
      window.removeEventListener("resize", handleWindowResized, false);
    };
  }, []);

  return screenClass;
};