import React from "react";
import { useHistory } from "react-router-dom";

import { styled } from "baseui";
import { Button } from "baseui/button";
import { ArrowLeft } from "baseui/icon";

import { CenterVertically } from "./ContentWrapper";

export const H1 = styled("h1", ({ $theme }) => ({
  marginTop: $theme.sizing.scale500,
  marginRight: 0,
  marginBottom: $theme.sizing.scale500,
  marginLeft: 0,
  wordBreak: "break-all"
}));

interface Props {
  children: any;
  auth?: boolean;
  primary?: boolean;
  wrapper?: React.ReactNode;
}

const GetTitle = (object: any): string => {
  if (Array.isArray(object))
    return object[0] as string;
  if (React.isValidElement(object) && object.props !== undefined)
    return GetTitle((object.props as any).children);
  return object as string;
}

export const PageTitleBackButton = ({ auth }: { auth?: boolean; }) => {
  const history = useHistory();
  return (
    <Button
      size="compact"
      kind="tertiary"
      // @ts-ignore
      onClick={() => auth ? history.push("/") : history.goBack()}
    >
      <ArrowLeft size={24} />
    </Button>
  );
}

export const PageTitle = ({ auth, primary, children }: Props) => {
  document.title = GetTitle(children);
  return (
    <CenterVertically>
      {!primary ? (
        <PageTitleBackButton auth={auth} />
      ) : null}
      <H1>{children}</H1>
    </CenterVertically>
  );
}

export const EditablePageTitle = ({ children }: { children: any }) => {
  document.title = GetTitle(children);
  return (
    <CenterVertically>
      <PageTitleBackButton auth={false} />
      {children}
    </CenterVertically>
  );
}