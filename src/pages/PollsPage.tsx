import React from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import moment from "moment";

import { styled } from "baseui";
import { Pagination } from "baseui/pagination";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { PageTitle } from "../components/PageTitle";
import { PageError } from "../components/PageError";
import { LinkAnchor } from "../components/LinkAnchor";
import { PollComponent } from "../components/PollComponent";
import { ContentWrapper } from "../components/ContentWrapper";
import { PaginationWrapper } from "../components/PaginationWrapper";

import * as Api from "../api";
import * as Helpers from "../helpers";

import { RootStateType } from "../reducers";

interface ParamsType {
  class: string;
  page?: string;
}

const Wrapper = styled("div", ({ $theme }) => ({
  marginBottom: $theme.sizing.scale700
}));

const PollsPage = () => {
  const history = useHistory();
  const params = useParams<ParamsType>();
  const auth = useSelector((state: RootStateType) => state.auth);

  const current_page = +(params.page || 1);

  const {
    data: content,
    isError
  } = useQuery(
    ["polls", params.class, current_page],
    () => {
      window.scrollTo(0, 0);

      const callback = (
        (params.class === "staff") ? Api.FetchAllStaffPolls : Api.FetchAllUserPolls
      );
      return callback(current_page - 1)
        .then((response) => {
          response.content.sort((a: PollDTO, b: PollDTO) => (
            moment(b.added).diff(a.added)
          ));

          // Find element with no name and push it to the end
          response.content.forEach((poll) => {
            if (!poll.choices || poll.choices.length === 0)
              return;

            const blank = poll.choices.findIndex((choice) => !choice.name);
            if (blank === -1)
              return;

            poll.choices.push(poll.choices.splice(blank, 1)[0]);
          });

          return response;
        });
    },
    { suspense: true }
  );

  const OnPageChange = (args: { nextPage: number }) => {
    history.push(`/polls/${params.class}/${args.nextPage}`);
  }

  if (isError)
    return (<PageError />);

  if (!content)
    return null;

  const is_staff = Helpers.IsUserStaff(auth.user);
  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>{params.class === "staff" ? "STAFF " : ""}Ankete</PageTitle>
          {is_staff ? (
            <Wrapper>
            {params.class === "staff" ? (
              <Link
                to="/polls/user"
                component={LinkAnchor}
              >
                Pogledajte korisničke ankete
              </Link>
            ) : (
              <Link
                to="/polls/staff"
                component={LinkAnchor}
              >
                Pogledajte staff ankete
              </Link>
            )}
            </Wrapper>
          ) : null}
        </Cell>
        {content.content.map((poll) => (
          <Cell span={4} key={poll.id}>
            <Wrapper>
              <PollComponent
                staff={params.class === "staff"}
                onHomepage={false}
                defaultPoll={poll}
              />
            </Wrapper>
          </Cell>
        ))}
        <Cell span={12}>
          <PaginationWrapper>
            <Pagination
              size="mini"
              numPages={content.totalPages}
              currentPage={current_page}
              onPageChange={OnPageChange}
            />
          </PaginationWrapper>
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default PollsPage;