import React from "react";

import { styled } from "baseui";

import {
  Table,
  TableRoot,
  TableBody,
  TableCell,
  TableRow
} from "../../components/Table";
import { UserTag } from "../../components/UserTag";
import { StarRating } from "../../components/star-rating";

import * as Helpers from "../../helpers";

import TmdbSvg from "./tmdb.svg";
import ImdbSvg from "./imdb.svg";

import { TorrentSubtitles } from "./TorrentSubtitles";
import { TorrentCategoryBreadcrumbs } from "./TorrentCategoryBreadcrumbs";

const Bold = styled("span", {
  fontWeight: "bold"
});

const RowWrapper = styled("div", {
  display: "flex",
  flexDirection: "row"
});

const RowText = styled("p", ({ $theme }) => ({
  marginTop: "auto",
  marginRight: 0,
  marginBottom: "auto",
  marginLeft: 0,
  paddingLeft: $theme.sizing.scale200
}));

const ImageLinkWrapper = styled("a", {
  display: "flex"
});

interface Props {
  torrent: TorrentDTO;
}

const ImdbRatingRow = ({ torrent }: Props) => {
  const imdb = torrent.mediaInfo.imdbData;
  if (!imdb)
    return null;

  return (
    <TableRow>
      <TableCell>
        <ImageLinkWrapper
          rel="noopener noreferrer"
          href={torrent.infolink}
          target="_blank"
        >
          <img
            src={ImdbSvg}
            height={25}
            alt="IMDb logo"
          />
        </ImageLinkWrapper>
      </TableCell>
      <TableCell>
        <RowWrapper>
          <StarRating
            size={15}
            // Rounds vote_average to nearest 0.5
            value={+(+imdb.rating * 2).toFixed() / 2}
            count={10}
          />
          <RowText>
            Ocena <Bold>{imdb.rating}</Bold>/10 ({imdb.votes} glasova)
          </RowText>
        </RowWrapper>
      </TableCell>
    </TableRow>
  );
}

const TmdbRatingRow = ({ torrent }: Props) => {
  const tmdb = torrent.mediaInfo.info;
  if (!tmdb)
    return null;

  return (
    <TableRow>
      <TableCell>
        <ImageLinkWrapper
          rel="noopener noreferrer"
          href={Helpers.GetTMDbHref(torrent)}
          target="_blank"
        >
          <img
            src={TmdbSvg}
            alt="TMDb logo"
            width={100}
          />
        </ImageLinkWrapper>
      </TableCell>
      <TableCell>
        <RowWrapper>
          <StarRating
            size={15}
            // Rounds vote_average to nearest 0.5
            value={+(+tmdb.asset.vote_average * 2).toFixed() / 2}
            count={10}
          />
          <RowText>
            Ocena <Bold>{tmdb.asset.vote_average}</Bold>/10
          </RowText>
        </RowWrapper>
      </TableCell>
    </TableRow>
  );
}

const GetPeerInfo = (torrent: TorrentDTO) => {
  const peers = (torrent.seeders + torrent.leechers);
  const peers_noun = (peers === 1) ? "korisnik" : "korisnika";
  return (
    `Ukupno ${peers} ${peers_noun} (${torrent.seeders} u seed stanju i ${torrent.leechers} u leech stanju)`
  );
};

export const TorrentDetailsTable = ({ torrent }: Props) => (
  <TableRoot>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell><Bold>Kategorija</Bold></TableCell>
          <TableCell><TorrentCategoryBreadcrumbs category={torrent.category} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Bold>Datum postavljanja</Bold></TableCell>
          <TableCell>{Helpers.GetFormattedTime(torrent.added)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Bold>Veličina</Bold></TableCell>
          <TableCell>{Helpers.GetSizeFromBytes(torrent.size)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Bold>Peer informacije</Bold></TableCell>
          <TableCell>{GetPeerInfo(torrent)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Bold>Postavio</Bold></TableCell>
          <TableCell>
            <UserTag user={torrent.uploaderInfo} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Bold>Broj komentara</Bold></TableCell>
          <TableCell>{torrent.comments}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Bold>Broj pregleda</Bold></TableCell>
          <TableCell>{torrent.views}</TableCell>
        </TableRow>
        {torrent.mediaTorrent ? (
          <>
            <ImdbRatingRow torrent={torrent} />
            <TmdbRatingRow torrent={torrent} />
          </>
        ) : null}
        <TableRow>
          <TableCell><Bold>Titlovi</Bold></TableCell>
          <TableCell><TorrentSubtitles torrent={torrent} /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Bold>Seed</Bold></TableCell>
          <TableCell $style={{ color: "#56922c" }}><Bold>{torrent.seeders}</Bold></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Bold>Leech</Bold></TableCell>
          <TableCell $style={{ color: "#d00210" }}><Bold>{torrent.leechers}</Bold></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><Bold>Info heš</Bold></TableCell>
          <TableCell>{torrent.infoHashHex}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableRoot>
);