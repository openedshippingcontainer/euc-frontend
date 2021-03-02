import React from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import moment from "moment";

import { styled } from "baseui";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Pagination } from "baseui/pagination";
import { Show, ArrowRight } from "baseui/icon";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
import { LabelSmall, LabelXSmall } from "baseui/typography";

import {
  PinIcon,
  NoteIcon,
  PencilIcon
} from "../../components/icons";
import { UserTag } from "../../components/UserTag";
import { PageTitle } from "../../components/PageTitle";
import { PageLoading } from "../../components/PageLoading";
import { ContentWrapper } from "../../components/ContentWrapper";
import { PaginationWrapper } from "../../components/PaginationWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { GetIcon } from "./Icons";
import { ForumList, ForumListItem } from "./ForumList";

const TopicName = styled("h3", {
  display: "inline",
  marginTop: "auto",
  marginRight: 0,
  marginBottom: "auto",
  marginLeft: 0,
  fontWeight: "bold"
});

const TopicNameWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  "@media screen and (max-width: 425px)": {
    maxWidth: "169px"
  },
  "@media screen and (max-width: 564px)": {
    maxWidth: "225px"
  },
  "@media screen and (max-width: 768px)": {
    maxWidth: "441px",
    overflowX: "auto"
  }
});

const InfoWrapper = styled("div", {
  display: "inline-flex"
});

const IconWrapper = styled("div", ({ $theme }) => ({
  display: "inline-flex",
  marginLeft: $theme.sizing.scale200
}));

const PinIconWrapper = styled("div", ({ $theme }) => ({
  display: "inline-flex",
  marginRight: $theme.sizing.scale100
}));

const GoToWrapper = styled("div", ({ $theme }) => ({
  display: "flex",
  flexFlow: "column wrap",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  minWidth: $theme.sizing.scale1600,
  cursor: "pointer",
  userSelect: "none",
  paddingLeft: $theme.sizing.scale200,
  paddingRight: $theme.sizing.scale200,
  transitionProperty: "background-color",
  transitionDuration: "0.1s",
  transitionTimingFunction: $theme.animation.easeInOutCurve,
  ":hover": { backgroundColor: $theme.colors.backgroundTertiary }
}))

const CategoryEndEnhancer = (topic: TopicDTO) => (
  <Link
    to={`/forum/topic/${topic.id}/${Helpers.GetLastTopicPage(topic.postCount)}?last`}
    component={(props: LinkProps) => (
      <GoToWrapper
        onClick={(event) => {
          event.preventDefault();
          props.navigate();
        }}
        onAuxClick={(event) => {
          if (event.button === 1) {
            event.preventDefault();
            window.open(props.href, "_blank");
          }
        }}
      >
        <ArrowRight color="primary" size={32} />
        <LabelXSmall
          overrides={{
            Block: {
              style: {
                "@media screen and (max-width: 564px)": { display: "none" }
              }
            }
          }}
        >
          <InfoWrapper>
            {topic.postCount}
            <IconWrapper>
              <NoteIcon />
            </IconWrapper>
          </InfoWrapper>
          <Block
            display="inline-flex"
            marginLeft="scale200"
            marginRight="scale100"
          >
            {'·'}
          </Block>
          <InfoWrapper>
            {topic.views}
            <IconWrapper>
              <Show color="primary" size={16} />
            </IconWrapper>
          </InfoWrapper>
        </LabelXSmall>
      </GoToWrapper>
    )}
  />
);

interface ParamsType {
  id: string;
  page?: string;
}

// TODO: Highlight new topics
// TODO: Improve clicking functionality on the left side to
// take the user to the first page of the topic
const ForumCategoryPage = () => {
  const history = useHistory();
  const params = useParams<ParamsType>();

  const current_page = +(params.page || 1);

  const { data: topics } = useQuery(
    ["forum_category", params.id, current_page],
    () => {
      window.scrollTo(0, 0);

      return Api.FetchForumCategory(+params.id, current_page - 1)
        .then((response) => {
          response.content.forEach((topic) => {
            Helpers.FillFakeUser(topic, "author");
            Helpers.FillFakeUser(topic.lastPost);
          });

          return response;
        });
    },
    { suspense: true }
  );

  const OnPageChange = (args: { nextPage: number }) => {
    history.push(`/forum/category/${params.id}/${args.nextPage}`);
  }

  const RenderTopic = (topic: TopicDTO) => (
    <Link
      key={topic.id}
      to={`/forum/topic/${topic.id}`}
      component={(props: LinkProps) => (
        <ForumListItem
          noPaddingRight
          artwork={GetIcon(topic.locked === "YES", topic.unread === "YES")}
          onClick={(event) => {
            event.preventDefault();
            props.navigate();
          }}
          onAuxClick={(event) => {
            if (event.button === 1) {
              event.preventDefault();
              window.open(props.href, "_blank");
            }
          }}
          endEnhancer={() => CategoryEndEnhancer(topic)}
        >
          <TopicNameWrapper>
            {topic.sticky === "YES" ? (
              <PinIconWrapper>
                <PinIcon />
              </PinIconWrapper>
            ) : null}
            <TopicName>{topic.subject}</TopicName>
          </TopicNameWrapper>
          <LabelSmall>
            <UserTag user={topic.lastPost.user} />
            {' '}
            {moment(topic.lastPost.added).fromNow()}
          </LabelSmall>
        </ForumListItem>
      )}
    />
  );

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        {!topics ? (
          <Cell span={12}>
            <PageLoading />
          </Cell>
        ) : (
          <>
            <Cell span={12}>
              <Block display="flex" flexWrap>
                <PageTitle>{topics.content[0].forumName}</PageTitle>
                <Block
                  display="inline-block"
                  marginTop="auto"
                  marginRight="0"
                  marginBottom="auto"
                  marginLeft="auto"
                >
                  <Button
                    size="compact"
                    kind="secondary"
                    onClick={() => history.push(`/forum/new/topic/${params.id}`)}
                    startEnhancer={() => <PencilIcon />}
                  >
                    Nova tema
                  </Button>
                </Block>
              </Block>
            </Cell>
            <Cell span={12}>
              <ForumList>
                {topics.content.map((topic) => RenderTopic(topic))}
              </ForumList>
            </Cell>
            <Cell span={12}>
              <PaginationWrapper>
                <Pagination
                  size="mini"
                  numPages={topics.totalPages}
                  currentPage={current_page}
                  onPageChange={OnPageChange}
                />
              </PaginationWrapper>
            </Cell>
          </>
        )}
      </Grid>
    </ContentWrapper>
  );
}

export default ForumCategoryPage;