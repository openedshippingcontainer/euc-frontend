import React from "react";
import { useHistory } from "react-router-dom";

import { Button } from "baseui/button";
import { ArrowLeft } from "baseui/icon";

import { PageTitle } from "./PageTitle";
import { ContentWrapper } from "./ContentWrapper";

export const PageError = () => {
  const history = useHistory();
  return (
    <ContentWrapper>
      <PageTitle>Greška se dogodila</PageTitle>
      <Button
        kind="tertiary"
        startEnhancer={() => <ArrowLeft size={24} />}
        // @ts-ignore
        onClick={() => history.goBack()}
      >
        Vratite se na prethodnu stranicu
      </Button>
    </ContentWrapper>
  );
};