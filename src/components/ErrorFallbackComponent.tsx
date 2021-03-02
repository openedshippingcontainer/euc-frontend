import React from "react";
import { FallbackProps } from "react-error-boundary";

import { Button } from "baseui/button";

import { ResetIcon } from "./icons";
import { PageTitle } from "./PageTitle";
import { ContentWrapper } from "./ContentWrapper";
import { RawDescriptionContainer } from "./RawDescriptionContainer";

export const ErrorFallbackComponent = (props: FallbackProps) => {
  return (
    <ContentWrapper>
      <PageTitle>Greška se dogodila :(</PageTitle>
      {(process.env.NODE_ENV !== "production") ? (
        <div>
          <h3>{props.error.message}</h3>
          {props.error.stack ? (
            <RawDescriptionContainer>
              {props.error.stack}
            </RawDescriptionContainer>
          ) : null}
        </div>
      ) : null}
      <Button
        kind="primary"
        startEnhancer={() => <ResetIcon inverse />}
        // @ts-ignore
        onClick={() => props.resetErrorBoundary()}
      >
        Pokušaj ponovo
      </Button>
    </ContentWrapper>
  );
};