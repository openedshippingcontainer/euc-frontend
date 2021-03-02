import React from "react";
import { RenderBBCode } from "./render";
import { OptionsType } from "../core";

const content = (children: any, plugins: any, options: any) => (
  React.Children.map(children, (child) => (
    typeof child === "string" ? RenderBBCode(child, plugins, options) : child
  ))
);

interface Props {
  container?: any;
  children: React.ReactNode;
  plugins: Array<any>;
  componentProps?: React.ComponentProps<any>;
  options: OptionsType;
}

export const Component = ({
  container = "span",
  componentProps = {},
  children,
  plugins = [],
  options = {}
}: Props) => React.createElement(
  container,
  componentProps,
  content(children, plugins, options),
);