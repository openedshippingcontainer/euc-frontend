import React from "react";
import { useQuery } from "react-query";

import { Grid, BEHAVIOR } from "baseui/layout-grid";

import { UserTag } from "../components/UserTag";
import { PageTitle } from "../components/PageTitle";
import { PageLoading } from "../components/PageLoading";
import { ContentWrapper } from "../components/ContentWrapper";

import * as Api from "../api";
import * as Helpers from "../helpers";

const PreviousDayVisitorsPage = () => {
  const { data } = useQuery(
    "previous_day_visitors",
    () => (
      Api.GetUsersActiveInLastDay()
        .then((response) => {
          Helpers.FillFakeUser(response);
          return response;
        })
    )
  );

  if (!data)
    return (<PageLoading />);

  return (
    <Grid behavior={BEHAVIOR.fluid}>
      <ContentWrapper>
        <PageTitle>Korisnici prisutni u poslednjih 24h ({data.length})</PageTitle>
        {data.map((user) => (
          <UserTag key={user.id} user={user} />
        ))}
      </ContentWrapper>
    </Grid>
  );
}

export default PreviousDayVisitorsPage;