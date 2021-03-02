import React, { useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";

import { Pagination } from "baseui/pagination";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import {
  CommentComponent,
  CommentInputComponent
} from "../../components/comment";
import { PageTitle } from "../../components/PageTitle";
import { ImageLoader } from "../../components/ImageLoader";
import { ContentWrapper } from "../../components/ContentWrapper";
import { PaginationWrapper } from "../../components/PaginationWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { RootStateType } from "../../reducers";

interface ParamsType {
  id: string;
  page?: string;
}

const ForumTopicPage = () => {
  const auth = useSelector((state: RootStateType) => state.auth);
  const dummy_ref = useRef<HTMLDivElement | null>(null);

  const history = useHistory();
  const params = useParams<ParamsType>();

  const current_page = +(params.page || 1);

  const { data: posts, refetch } = useQuery(
    ["forum_topic", params.id, current_page],
    () => {
      window.scrollTo(0, 0);

      return Api.FetchForumTopic(+params.id, current_page - 1)
        .then((response) => {
          Helpers.FillFakeUser(response.content);
          return response;
        });
    },
    { suspense: true }
  );

  const OnFinishedLoadingImages = () => {
    const parameters = new URLSearchParams(location.search);
    if (!parameters.has("last"))
      return;

    if (!dummy_ref || !dummy_ref.current)
      return;

    dummy_ref.current.scrollIntoView({ behavior: "smooth", block: "end" });

    // Remove ?last query
    history.replace(history.location.pathname);
  }

  const OnPageChange = (args: { nextPage: number }) => {
    history.push(`/forum/topic/${params.id}/${args.nextPage}`);
  }

  if (!posts)
    return null;

  const is_staff = Helpers.IsUserStaff(auth.user);
  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>{posts.content[0].topicName}</PageTitle>
        </Cell>
        <Cell span={12}>
          <ImageLoader
            onFinishedLoading={OnFinishedLoadingImages}
          >
            {posts.content.map((post) => (
              <CommentComponent
                key={post.id}
                type="forum"
                post={post}
                isStaff={is_staff}
                canEdit={post.user.id === auth.user?.id}
                onRefresh={refetch}
              />
            ))}
          </ImageLoader>
        </Cell>
        <Cell span={12}>
          <PaginationWrapper>
            <Pagination
              size="mini"
              numPages={posts.totalPages}
              currentPage={current_page}
              onPageChange={OnPageChange}
            />
          </PaginationWrapper>
        </Cell>
        <div ref={dummy_ref} />
        <Cell span={12}>
          <br />
          <CommentInputComponent
            type="forum"
            id={+params.id}
            onSubmit={refetch}
          />
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default ForumTopicPage;