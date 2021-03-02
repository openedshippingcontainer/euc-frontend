import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import moment from "moment";

import { styled } from "baseui";
import { Block } from "baseui/block";
import { Show, Hide } from "baseui/icon";
import { StatefulTooltip } from "baseui/tooltip";
import { StyledSpinnerNext } from "baseui/spinner";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import { UserTag } from "./UserTag";
import { LinkAnchor } from "./LinkAnchor";
import { CenteredLayout } from "./ContentWrapper";

import * as Api from "../api";
import * as Helpers from "../helpers";

const Bold = styled("span", {
  fontWeight: "bold"
});

const Title = styled("h2", ({ $theme }) => ({
  marginTop: 0,
  marginRight: 0,
  marginBottom: $theme.sizing.scale300,
  marginLeft: 0
}));

const Wrapper = styled("div", ({ $theme }) => ({
  marginTop: $theme.sizing.scale300
}));

const RenderUnread = (post: TopicDTO) => (
  <>
    {post.unread === "YES" ? (
      <Hide title="Nepročitano" />
    ) : (
      <Show title="Pročitano" />
    )}
  </>
);

const RenderAdded = (topic: TopicDTO) => (
  <StatefulTooltip content={moment(topic.lastPost.added).format("LLLL")}>
    {moment(topic.lastPost.added).fromNow()}
  </StatefulTooltip>
);

const RenderTopicName = (topic: TopicDTO) => (
  <Link
    to={`/forum/topic/${topic.id}/${Helpers.GetLastTopicPage(topic.postCount)}?last`}
    component={LinkAnchor}
  >
    {topic.unread === "YES" ? (
      <Bold>{topic.subject}</Bold>
    ) : (
      <>{topic.subject}</>
    )}
  </Link>
);

const RenderUserTag = (post: TopicDTO) => (
  <UserTag user={post.lastPost.user} />
);

const CenterColumn = {
  TableBodyCell: {
    style: {
      verticalAlign: "middle",
      textAlign: "center"
    }
  }
};

export const LatestForumPostsComponent = () => {
  const { data: posts, isError } = useQuery(
    "latest_forum_posts",
    () => (
      Api.FetchLatestForumPosts()
        .then((response) => {
          response.forEach((topic) => Helpers.FillFakeUser(topic.lastPost));
          return response;
        })
    )
  );

  if (isError)
    return (<Bold>Greška se dogodila prilikom učitavanja tabele sa torentima kojima su potrebni seed-eri.</Bold>);

  return (
    <Wrapper>
      <Title>Poslednji postovi na forumu</Title>
      {!posts ? (
        <CenteredLayout>
          <Block
            marginTop="scale600"
            marginBottom="scale600"
          >
            <StyledSpinnerNext />
          </Block>
        </CenteredLayout>
      ) : (
        <>
          <TableBuilder
            data={posts}
            overrides={{
              TableBodyRow: {
                style: ({ $theme, $rowIndex }) => ({
                  backgroundColor: (
                    $rowIndex % 2 ?
                    $theme.colors.backgroundSecondary :
                    $theme.colors.tableBackground
                  ),
                  ":hover": {
                    backgroundColor: $theme.colors.backgroundTertiary
                  }
                })
              },
              TableBodyCell: {
                style: { verticalAlign: "middle" }
              }
            }}
          >
            <TableBuilderColumn>
              {RenderUnread}
            </TableBuilderColumn>
            <TableBuilderColumn header="Kad" numeric>
              {RenderAdded}
            </TableBuilderColumn>
            <TableBuilderColumn header="Tema">
              {RenderTopicName}
            </TableBuilderColumn>
            <TableBuilderColumn
              header="Ko"
              overrides={CenterColumn as any}
            >
              {RenderUserTag}
            </TableBuilderColumn>
          </TableBuilder>
        </>
      )}
    </Wrapper>
  );
};