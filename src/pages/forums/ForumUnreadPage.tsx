import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "react-query";

import { styled } from "baseui";
import { H2 } from "baseui/typography";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { Check, ArrowRight } from "baseui/icon";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { PageTitle } from "../../components/PageTitle";
import { ContentWrapper, CenterHorizontally } from "../../components/ContentWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { GetIcon } from "./Icons";
import { ForumList, ForumListItem } from "./ForumList";

const Bold = styled("span", {
  fontWeight: "bold"
});

const Wrapper = styled("span", {
  cursor: "pointer"
});

const ForumUnreadPage = () => {
  const { data } = useQuery(
    "unread_topics",
    Api.FetchUnreadForumTopics,
    { suspense: true }
  );

  const query_client = useQueryClient();
  const edit_mutation = useMutation(
    () => Api.MarkAllAsRead(),
    {
      onSuccess: () => {
        query_client.invalidateQueries("unread_topics");
        toaster.positive(`Uspešno označene sve teme kao pročitane!`, {});
      },
      onError: () => {
        toaster.negative("Greška se dogodila prilikom komunikacije sa serverom.", {});
      }
    }
  );

  if (!data)
    return null;

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>Nepročitane teme</PageTitle>
        </Cell>
        <Cell span={12}>
          {!data.length ? (
            <CenterHorizontally>
              <H2>Nema nepročitanih tema :)</H2>
            </CenterHorizontally>
          ) : (
            <>
              <ForumList>
                {data.map((topic) => (
                  <Link
                    key={topic.id}
                    to={
                      `/forum/topic/${topic.id}/${Helpers.GetLastTopicPage(topic.postCount)}?last`
                    }
                    component={(props: LinkProps) => (
                      <Wrapper
                        onClick={() => props.navigate()}
                        onAuxClick={(event) => {
                          if (event.button === 1) {
                            event.preventDefault();
                            window.open(props.href, "_blank");
                          }
                        }}
                      >
                        <ForumListItem
                          artwork={GetIcon(false, true)}
                          endEnhancer={() => (<ArrowRight color="primary" size={36} />)}
                        >
                          <Bold>{topic.subject}</Bold>
                        </ForumListItem>
                      </Wrapper>
                    )}
                  />
                ))}
              </ForumList>
              <Button
                size="compact"
                isLoading={edit_mutation.isLoading}
                onClick={() => edit_mutation.mutate()}
                startEnhancer={() => <Check />}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      width: "100%",
                      marginTop: $theme.sizing.scale200
                    })
                  }
                }}
              >
                Obeleži sve kao pročitano
              </Button>
            </>
          )}
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default ForumUnreadPage;