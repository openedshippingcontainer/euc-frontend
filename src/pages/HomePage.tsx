import React from "react";
import { useSelector } from "react-redux";

import { styled } from "baseui";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { Shoutbox } from "../components/Shoutbox";
import { PollComponent } from "../components/PollComponent";
import { HotTorrentsTable } from "../components/HotTorrentsTable";
import { NeededSeedersTable } from "../components/NeededSeedersTable";
import { LastActiveUsersComponent } from "../components/LastActiveUsersComponent";
import { LatestForumPostsComponent } from "../components/LatestForumPostsComponent";

import * as Helpers from "../helpers";
import { RootStateType } from "../reducers";

const Wrapper = styled("div", ({ $theme }) => ({
  marginTop: $theme.sizing.scale800,
  marginBottom: $theme.sizing.scale600
}));

const HomePage = () => {
  const auth = useSelector((state: RootStateType) => state.auth);

  const is_staff = Helpers.IsUserStaff(auth.user);
  return (
    <Wrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={[4, 8, 8]}>
          <Shoutbox />
          <br />
          <LastActiveUsersComponent />
          <br />
          <NeededSeedersTable />
          <br />
          <LatestForumPostsComponent />
        </Cell>
        <Cell span={[4, 8, 4]}>
          <HotTorrentsTable />
          <br />
          <PollComponent staff={false} onHomepage />
          {is_staff ? (
            <>
              <br />
              <PollComponent staff onHomepage />
            </>
          ) : null}
        </Cell>
      </Grid>
    </Wrapper>
  );
};

export default HomePage;