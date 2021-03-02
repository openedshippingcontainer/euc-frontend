import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import moment from "moment";
import uniqBy from "lodash/uniqBy";

import { styled } from "baseui";
import { Show, Hide } from "baseui/icon";
import { LabelLarge } from "baseui/typography";
import { StatefulTooltip } from "baseui/tooltip";
import { StyledSpinnerNext } from "baseui/spinner";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import { UserTag } from "./UserTag";
import { PageError } from "./PageError";
import { LinkAnchor } from "./LinkAnchor";
import { CenteredLayout } from "./ContentWrapper";

import * as Api from "../api";
import * as Helpers from "../helpers";

const Bold = styled("span", {
  fontWeight: "bold"
});

interface UserDownloadHistoryTableProps {
  id: number;
  isEnabled: boolean;
}

export const UserDownloadHistoryTable = ({
  id,
  isEnabled
}: UserDownloadHistoryTableProps) => {
  const {
    data,
    isError,
    isFetching
  } = useQuery(
    ["user_download_history", id],
    () => (
      // Sort by last added
      Api.GetTorrentsDownloadedByUser(id)
        .then((response) => (
          response.sort((a, b) => moment(b.added).diff(a.added))
        ))
    ),
    { enabled: isEnabled }
  );

  if (isError)
    return (<PageError />);

  if (!data || isFetching) {
    return (
      <CenteredLayout>
        <StyledSpinnerNext />
      </CenteredLayout>
    );
  }

  if (!data.length) {
    return (
      <CenteredLayout>
        <LabelLarge>Ovaj korisnik nije preuzeo ni jedan torent.</LabelLarge>
      </CenteredLayout>
    );
  }

  return (
    <TableBuilder
      data={data}
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
        TableBodyCell: { style: { verticalAlign: "middle" } }
      }}
    >
      <TableBuilderColumn>
        {(info: TorrentDownloadDTO) => (
          <>
            {info.torrent.visible !== "YES" ? (
              <Hide title="Torent nije vidljiv" />
            ) : (
              <Show title="Torent je vidljiv" />
            )}
          </>
        )}
      </TableBuilderColumn>
      <TableBuilderColumn header="Dodato">
        {(info: TorrentDownloadDTO) => (
          <StatefulTooltip
            content={moment(info.added).format("LLLL")}
          >
            {moment(info.added).fromNow()}
          </StatefulTooltip>
        )}
      </TableBuilderColumn>
      <TableBuilderColumn header="Torent">
        {(info: TorrentDownloadDTO) => (
          <Link
            to={`/torrent/${info.torrent.id}`}
            component={LinkAnchor}
          >
            {info.torrent.name}
          </Link>
        )}
      </TableBuilderColumn>
      <TableBuilderColumn
        numeric
        header="S"
      >
        {(info: TorrentDownloadDTO) => (
          <Bold $style={{ color: "#56922c" }}>{info.torrent.seeders}</Bold>
        )}
      </TableBuilderColumn>
      <TableBuilderColumn
        numeric
        header="L"
      >
        {(info: TorrentDownloadDTO) => (
          <Bold $style={{ color: "#d00210" }}>{info.torrent.leechers}</Bold>
        )}
      </TableBuilderColumn>
      <TableBuilderColumn
        numeric
        header="P"
      >
        {(info: TorrentDownloadDTO) => (
          <Bold>{info.torrent.timesCompleted}</Bold>
        )}
      </TableBuilderColumn>
    </TableBuilder>
  );
}

interface TorrentDownloadHistoryComponentProps {
  torrentId: number;
  isEnabled: boolean;
}

export const TorrentDownloadHistoryComponent = ({
  torrentId,
  isEnabled
}: TorrentDownloadHistoryComponentProps) => {
  const {
    data,
    isError,
    isFetching
  } = useQuery(
    ["torrent_download_history", torrentId],
    () => (
      // Sort by last added
      Api.GetUsersWhoDownloadedTorrent(torrentId)
        .then((response) => {
          Helpers.FillFakeUser(response);
          return uniqBy(response, "user.username")
        })
    ),
    { enabled: isEnabled }
  );

  if (isError)
    return (<PageError />);

  if (!data || isFetching) {
    return (
      <CenteredLayout>
        <StyledSpinnerNext />
      </CenteredLayout>
    );
  }

  if (!data.length) {
    return (
      <CenteredLayout>
        <LabelLarge>Ni jedan korisnik nije preuzeo ovaj torent.</LabelLarge>
      </CenteredLayout>
    );
  }

  return (
    <span>
      {data.map((user) => (
        <UserTag key={user.id} user={user.user} />
      ))}
    </span>
  );
}