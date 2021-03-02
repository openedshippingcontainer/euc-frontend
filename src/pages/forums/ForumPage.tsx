import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import moment from "moment";

import { styled } from "baseui";
import { ListItem, ListItemLabel } from "baseui/list";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
import { LabelSmall, LabelXSmall } from "baseui/typography";

import { UserTag } from "../../components/UserTag";
import { PageTitle } from "../../components/PageTitle";
import { LinkAnchor } from "../../components/LinkAnchor";
import { PageLoading } from "../../components/PageLoading";
import { ContentWrapper, CenterVertically } from "../../components/ContentWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { GetIcon } from "./Icons";
import { ForumList, ForumListItem } from "./ForumList";

const CategoryName = styled("h3", {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  fontWeight: "bold"
});

const CategoryDescription = styled("div", {
  display: "block",
  width: "324px",
  "@media screen and (max-width: 768px)": {
    display: "none"
  },
  "@media screen and (min-width: 1440px)": {
    width: "auto"
  }
});

const TopicInfoWrapperLeft = styled("div", {
  display: "none",
  whiteSpace: "nowrap",
  "@media screen and (max-width: 425px)": {
    maxWidth: "128px",
    overflowX: "auto"
  },
  "@media screen and (max-width: 600px)": {
    maxWidth: "225px",
    overflowX: "auto"
  },
  "@media screen and (max-width: 768px)": {
    display: "block",
    overflowX: "auto",
    maxWidth: "441px",
  }
});

const TopicInfoWrapperRight = styled("div", ({ $theme }) => ({
  display: "inline",
  marginLeft: $theme.sizing.scale0,
  "@media screen and (max-width: 768px)": {
    display: "none"
  },
  ...$theme.typography.LabelSmall
}));

const StopPropagation = (event: React.MouseEvent<HTMLElement>) => {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
}

const CategoryEndEnhancer = (category: ForumDTO) => (
  <>
    {(category.lastForumPost &&
    category.lastForumPost.user &&
    category.lastForumPost.topic) ? (
      <CenterVertically
        $style={{ textAlign: "center" }}
      >
        <div>
          <LabelXSmall>
            {moment(category.lastForumPost.added).fromNow()}
          </LabelXSmall>
          <div>
            <UserTag user={category.lastForumPost.user} />
            <TopicInfoWrapperRight>
              {"u "}
              <Link
                to={
                  `/forum/topic/${category.lastForumPost.topic.id}/${
                    Helpers.GetLastTopicPage(category.lastForumPost.topic.postCount)
                  }?last`
                }
                component={LinkAnchor}
                onClick={StopPropagation}
              >
                {category.lastForumPost.topic.subject}
              </Link>
            </TopicInfoWrapperRight>
          </div>
        </div>
      </CenterVertically>
    ) : null}
  </>
);

interface SectionType {
  name: string;
  content: Array<ForumDTO>;
}

// TODO: Highlight new topics
const ForumPage = () => {
  const { data: sections } = useQuery(
    "forum_primary_page",
    () => {
      window.scrollTo(0, 0);
      return Api.FetchForum()
        .then((response) => {
          const forum_sections: Array<SectionType> = [];
          for (let i = 0; i < response.length; ++i) {
            const content = response[i];

            Helpers.FillFakeUser(content.lastForumPost);
            Helpers.FillFakeUser(content.lastForumPost.topic, "author");

            // Check if given category exists and create it
            const id = content.category.id;
            if (forum_sections[id] === undefined) {
              forum_sections[id] = {
                name: content.category.name,
                content: [content]
              };
              continue;
            }

            // Push back to existing array
            forum_sections[id].content.push(content);
          }

          return forum_sections;
        });
    },
    { suspense: true }
  );

  const RenderSection = (section: SectionType) => (
    <React.Fragment key={section.name}>
      <ListItem
        overrides={{ Content: { style: { height: "36px" } } }}
      >
        <ListItemLabel>{section.name}</ListItemLabel>
      </ListItem>
      {section.content.map((category) => (
        <Link
          key={category.name}
          to={`/forum/category/${category.id}`}
          component={(props: LinkProps) => (
            <ForumListItem
              artwork={GetIcon(false, category.unread === "YES")}
              endEnhancer={() => CategoryEndEnhancer(category)}
              onClick={() => props.navigate()}
              onAuxClick={(event) => {
                if (event.button === 1) {
                  event.preventDefault();
                  window.open(props.href, "_blank");
                }
              }}
            >
              <CategoryName>{category.name}</CategoryName>
              <TopicInfoWrapperLeft>
                <Link
                  to={
                    `/forum/topic/${category.lastForumPost.topic.id}/${
                      Helpers.GetLastTopicPage(category.lastForumPost.topic.postCount)
                    }?last`
                  }
                  component={LinkAnchor}
                  onClick={StopPropagation}
                >
                  {category.lastForumPost.topic.subject}
                </Link>
              </TopicInfoWrapperLeft>
              <CategoryDescription>
                <LabelSmall>{category.description}</LabelSmall>
              </CategoryDescription>
            </ForumListItem>
          )}
        />
      ))}
    </React.Fragment>
  );

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>Forum</PageTitle>
        </Cell>
        <Cell span={12}>
          {!sections ? (
            <PageLoading />
          ) : (
            <ForumList>
              {sections.map((section) => RenderSection(section))}
            </ForumList>
          )}
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default ForumPage;
