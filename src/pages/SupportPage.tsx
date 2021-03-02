import React from "react";

import { Block } from "baseui/block";
import { toaster } from "baseui/toast";
import { LabelMedium } from "baseui/typography";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { PageTitle } from "../components/PageTitle";
import { ContentWrapper } from "../components/ContentWrapper";
import { CommentInputComponent } from "../components/comment";

// Since this component is simple and static, there's no parent container for it.
const SupportPage = () => {
  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>Podrška</PageTitle>
        </Cell>
        <Cell span={12}>
          <LabelMedium>Imate pitanje u vezi sa sajtom koje ne želite da vide svi, a potreban vam je brz odgovor?</LabelMedium>
          <LabelMedium>Prvi član Staff-a koji vidi pitanje će vam odgovoriti putem privatne poruke.</LabelMedium>
        </Cell>
        <Cell span={12}>
          <Block marginTop="scale400">
            <CommentInputComponent
              type="support-user"
              id={-1}
              onSubmit={() => toaster.positive("Upit poslan uspešno!", {})}
            />
          </Block>
        </Cell>
      </Grid>
    </ContentWrapper>
  );
};

export default SupportPage;