import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import { styled } from "baseui";
import { Pagination } from "baseui/pagination";
import { LabelMedium } from "baseui/typography";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import {
  CenteredLayout,
  CenterVertically,
  CenterHorizontally
} from "../../components/ContentWrapper";
import { UserTag } from "../../components/UserTag";
import { DownloadIcon } from "../../components/icons";
import { PageError } from "../../components/PageError";
import { PageLoading } from "../../components/PageLoading";
import { LinkAnchor } from "../../components/LinkAnchor";
import { PaginationWrapper } from "../../components/PaginationWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { TorrentTag } from "./TorrentTag";

const H2 = styled("h2", {
  marginTop: 0
});

const NameWrapperContainer = styled("span", {
  display: "flex",
  minWidth: "256px"
});

const NameWrapper = styled("span", ({ $theme }) => ({
  flexGrow: 1,
  color: $theme.colors.linkText,
  cursor: "pointer",
  fontWeight: "bold",
  textDecoration: "unset",
  wordBreak: "break-all",
  ":hover": { color: $theme.colors.linkHover },
  ":visited": { color: $theme.colors.linkVisited },
  ":active": { color: $theme.colors.linkActive }
}));

const ImageWrapper = styled("img", {
  display: "block",
  minHeight: "42px",
  maxHeight: "100%"
});

const Bold = styled("span", {
  fontWeight: "bold"
});

const DontBreak = styled("div", {
  whiteSpace: "nowrap"
});

// NOTE: Fix someday?
// @ts-ignore
const HeadCellStyle = ({ $theme }) => ({
  ...$theme.typography.LabelSmall,
  paddingLeft: $theme.sizing.scale300,
  paddingRight: $theme.sizing.scale800
});

const TableStyleOverrides = {
  TableBodyCell: {
    // @ts-ignore
    style: ({ $theme }) => ({
      paddingTop: $theme.sizing.scale100,
      paddingRight: $theme.sizing.scale300,
      paddingBottom: $theme.sizing.scale100,
      paddingLeft: $theme.sizing.scale300,
      verticalAlign: "middle"
    })
  },
  TableHeadCell: { style: HeadCellStyle },
  TableBodyRow: {
    // @ts-ignore
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
  }
};

const CategoryColumnOverrides = {
  TableBodyCell: {
    style: {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    }
  }
};

const SortableColumnOverrides = {
  TableHeadCellSortable: { style: HeadCellStyle }
};

interface Props {
  torrents?: PagedResult<TorrentDTO>;
  is_loading: boolean;
  error: boolean;
  sort_order: "ASC" | "DESC";
  sort_column: string;
  on_sort: (column_id: string) => void;
  page: number;
  on_page_change: (args: { nextPage: number }) => void;
}

const RenderCategory = (torrent: TorrentDTO) => (
  <ImageWrapper
    src={`https://eliteunitedcrew.org/pic/${torrent.category.image}`}
  />
);

const RenderName = (torrent: TorrentDTO) => (
  <NameWrapperContainer>
    <CenterVertically $style={{ flexGrow: 2 }}>
      <Link
        to={`/torrent/${torrent.id}`}
        component={LinkAnchor}
        // @ts-ignore
        $style={{ textDecoration: "unset" }}
      >
        <NameWrapper>{torrent.name}</NameWrapper>
      </Link>
    </CenterVertically>
    <CenterVertically $style={{ float: "right" }}>
    {torrent.newTorrent === "YES" ? (
      <TorrentTag kind="accent" text="Novo" />
    ) : null}
    {(torrent.tags.length !== 0 &&
    torrent.tags[0].name === "ex-yu") ? (
      <TorrentTag kind="warning" text="Ex-YU" />
    ) : null}
    </CenterVertically>
  </NameWrapperContainer>
);

const RenderUploader = (torrent: TorrentDTO) => (
  <CenterHorizontally>
    <UserTag user={torrent.uploaderInfo} />
  </CenterHorizontally>
);

const RenderAdded = (torrent: TorrentDTO) => (
  <DontBreak>{moment(torrent.added).fromNow(true)}</DontBreak>
);

const RenderComments = (torrent: TorrentDTO) => (
  <>
    {torrent.comments !== 0 ? (
      <Bold>{torrent.comments}</Bold>
    ) : (
      torrent.comments
    )}
  </>
);

const RenderSize = (torrent: TorrentDTO) => (
  <DontBreak>{Helpers.GetSizeFromBytes(torrent.size)}</DontBreak>
);

const RenderSeeders = (torrent: TorrentDTO) => (
  <Bold $style={{ color: "#56922c" }}>{torrent.seeders}</Bold>
);

const RenderLeechers = (torrent: TorrentDTO) => (
  <Bold $style={{ color: "#d00210" }}>{torrent.leechers}</Bold>
);

const RenderTimesCompleted = (torrent: TorrentDTO) => (
  <Bold>{torrent.timesCompleted}</Bold>
);

const RenderDownloadButton = (torrent: TorrentDTO) => (
  <CenteredLayout
    $style={{ cursor: "pointer" }}
    onClick={() => Api.DownloadTorrent(torrent.id, torrent.filename)}
  >
    <DownloadIcon />
  </CenteredLayout>
);

const _TorrentTable = ({
  torrents,
  is_loading,
  error,
  sort_order,
  sort_column,
  on_sort,
  page,
  on_page_change
}: Props) => {
  if (error)
    return (<PageError />);

  if (is_loading || !torrents)
    return (<PageLoading />);

  return (
    <>
      {torrents.content.length !== 0 ? (
        <TableBuilder
          data={torrents.content}
          sortColumn={sort_column}
          sortOrder={sort_order}
          onSort={on_sort}
          overrides={TableStyleOverrides}
        >
          <TableBuilderColumn
            overrides={CategoryColumnOverrides}
          >
            {RenderCategory}
          </TableBuilderColumn>
          <TableBuilderColumn
            sortable
            id="name"
            header="Naziv"
            overrides={SortableColumnOverrides}
          >
            {RenderName}
          </TableBuilderColumn>
          <TableBuilderColumn
            header="Postavio"
          >
            {RenderUploader}
          </TableBuilderColumn>
          <TableBuilderColumn
            numeric
            sortable
            id="added"
            header="Pre"
            overrides={SortableColumnOverrides}
          >
            {RenderAdded}
          </TableBuilderColumn>
          <TableBuilderColumn
            numeric
            sortable
            id="comments"
            header="Kom."
            overrides={SortableColumnOverrides}
          >
            {RenderComments}
          </TableBuilderColumn>
          <TableBuilderColumn
            numeric
            sortable
            id="size"
            header="Veličina"
            overrides={SortableColumnOverrides}
          >
            {RenderSize}
          </TableBuilderColumn>
          <TableBuilderColumn
            numeric
            sortable
            id="seeders"
            header="S"
            overrides={SortableColumnOverrides}
          >
            {RenderSeeders}
          </TableBuilderColumn>
          <TableBuilderColumn
            numeric
            sortable
            id="leechers"
            header="L"
            overrides={SortableColumnOverrides}
          >
            {RenderLeechers}
          </TableBuilderColumn>
          <TableBuilderColumn
            numeric
            sortable
            id="timesCompleted"
            header="P"
            overrides={SortableColumnOverrides}
          >
            {RenderTimesCompleted}
          </TableBuilderColumn>
          <TableBuilderColumn>
            {RenderDownloadButton}
          </TableBuilderColumn>
        </TableBuilder>
      ) : (
        <CenteredLayout>
          <H2>Nije pronađen nijedan torent!</H2>
          <LabelMedium>Pokušajte ponovo sa drugačijim parametrima pretrage.</LabelMedium>
        </CenteredLayout>
      )}
      {torrents.content.length !== 0 ? (
        <PaginationWrapper>
          <Pagination
            size="mini"
            numPages={torrents.totalPages}
            currentPage={page}
            onPageChange={on_page_change}
          />
        </PaginationWrapper>
      ) : null}
    </>
  );
};

export const TorrentTable = React.memo(_TorrentTable);