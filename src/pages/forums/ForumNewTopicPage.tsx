import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { Input } from "baseui/input";
import { toaster } from "baseui/toast";
import { FormControl } from "baseui/form-control";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { PageTitle } from "../../components/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper";
import { CommentInputComponent } from "../../components/comment";

interface ParamsType {
  id: string;
}

const ForumNewTopicPage = () => {
  const history = useHistory();
  const params = useParams<ParamsType>();

  const [topic_name, setTopicName] = useState("");

  const OnRefresh = () => {
    toaster.positive("Tema uspešno napravljena!", {});
    history.push(`/forum/category/${params.id}`);
  }

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>Nova tema</PageTitle>
        </Cell>
        <Cell span={12}>
          <FormControl label={() => "Naziv"}>
            <Input
              clearable
              value={topic_name}
              onChange={(event) => setTopicName(event.currentTarget.value)}
            />
          </FormControl>
        </Cell>
        <Cell span={12}>
          <FormControl label={() => "Sadržaj"}>
            <CommentInputComponent
              type="new-topic"
              id={+params.id}
              additionalField={topic_name}
              onSubmit={OnRefresh}
            />
          </FormControl>
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default ForumNewTopicPage;