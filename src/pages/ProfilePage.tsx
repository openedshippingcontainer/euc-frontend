import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";

import { styled } from "baseui";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { ParagraphSmall } from "baseui/typography";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import {
  Table,
  TableRoot,
  TableBody,
  TableCell,
  TableRow
} from "../components/Table";
import {
  ContentWrapper,
  CenterVertically
} from "../components/ContentWrapper";
import {
  UserDownloadHistoryTable
} from "../components/TorrentDownloadHistory";
import { PageError } from "../components/PageError";
import { CommentAvatar } from "../components/comment";
import { PencilIcon, PreferencesIcon } from "../components/icons";

import * as Api from "../api";
import * as Helpers from "../helpers";

import { RootStateType } from "../reducers";

const AvatarWrapper = styled("div", ({ $theme }) => ({
  float: "left",
  width: "144px",
  marginRight: $theme.sizing.scale300
}));

const Bold = styled("span", {
  fontWeight: "bold"
});

const Italic = styled("span", {
  fontStyle: "italic"
});

const Title = styled("h1", {
  marginBottom: 0
});

const HeaderWrapper = styled("div", {
  display: "flex"
});

interface ParamsType {
  id: string;
  username: string;
}

const GetValue = (value?: string) => {
  if (!value || value.length === 0)
    return (<Italic>Sakriveno</Italic>);
  return value;
}

type UserFieldRenderer = (user: UserDTO) => React.ReactNode;

const UserFields: Record<string, UserFieldRenderer> = {
  "Korisnički ID": (user) => user.id,
  "Datum registracije": (user) => Helpers.GetFormattedTime(user.added),
  "Poslednja poseta": (user) => Helpers.GetFormattedTime(user.lastAccess),
  "E-mail adresa": (user) => GetValue(user.email),
  "UL": (user) => Helpers.GetSizeFromBytes(user.uploaded),
  "Heš lozinke": (user) => GetValue(user.passhash),
  "Pristupni ključ": (user) => GetValue(user.passkey)
};

const ProfilePage = () => {
  const history = useHistory();
  const params = useParams<ParamsType>();
  const auth = useSelector((state: RootStateType) => state.auth);

  const parameter = (params.id ?? params.username);
  const is_local = auth.user === undefined ? true : (
    parameter === auth.user.id.toString() || parameter === auth.user.username
  );

  const {
    data: user,
    isError
  } = useQuery(
    ["profile", parameter],
    () => (
      (params.id ? Api.GetProfileByID : Api.GetProfileByUsername)(is_local ? null : parameter)
    ),
    { suspense: true }
  );

  if (isError)
    return (<PageError />);

  if (!user)
    return null;

  // Set page title
  document.title = (
    is_local ? "Vaš profil" : `Profil korisnika ${user.username}`
  );

  const show_downloaded_torrents = (
    !!user.id && Helpers.IsUserStaff(auth.user)
  );

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <HeaderWrapper>
            <CenterVertically $style={{ flexGrow: 1 }}>
              <AvatarWrapper>
                <CommentAvatar
                  title={`Avatar korisnika ${user.username}`}
                  src={Helpers.GetUserAvatarURL(user)}
                />
              </AvatarWrapper>
              <div>
                <Title>{user.username}</Title>
                <ParagraphSmall marginTop="0">{user.className}</ParagraphSmall>
              </div>
            </CenterVertically>
            <CenterVertically>
              {!is_local ? (
                <Button
                  kind="primary"
                  startEnhancer={() => <PencilIcon inverse />}
                  onClick={() => history.push(`/pm/out/?compose=${user.username}`)}
                >
                  Napiši privatnu poruku
                </Button>
              ) : (
                  <Button
                    kind="secondary"
                    startEnhancer={() => <PreferencesIcon />}
                    onClick={() => history.push("/preferences")}
                  >
                    Podešavanja
                  </Button>
                )}
            </CenterVertically>
          </HeaderWrapper>
        </Cell>
        <Cell span={12}>
          <Block as="h2" marginBottom="scale200">
            Korisnički detalji
          </Block>
          <TableRoot>
            <Table>
              <TableBody>
                {Object.entries(UserFields).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell><Bold>{key}</Bold></TableCell>
                    <TableCell>{value(user)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableRoot>
        </Cell>
        {show_downloaded_torrents ? (
          <Cell span={12}>
            <Block as="h2" marginBottom="scale200">
              Preuzeti torenti
            </Block>
            <UserDownloadHistoryTable
              id={user.id}
              isEnabled={show_downloaded_torrents}
            />
          </Cell>
        ) : null}
      </Grid>
    </ContentWrapper>
  );
}

export default ProfilePage;
