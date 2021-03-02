import React from "react";

import { styled } from "baseui";
import { LabelMedium } from "baseui/typography";

import { HorizontalRule } from "../../components/HorizontalRule";
import { CenterVertically } from "../../components/ContentWrapper";

import * as Helpers from "../../helpers";

import UnitedKingdomFlagSvg from "./en-uk.svg";

interface Props {
  torrent: TorrentDTO;
}

const Bold = styled("span", {
  fontWeight: "bold"
});

const Title = styled("h2", ({ $theme }) => ({
  marginTop: "auto",
  marginRight: 0,
  marginBottom: "auto",
  marginLeft: 0,
  paddingLeft: $theme.sizing.scale200
}));

const TitleContainer = styled("div", {
  display: "flex",
  flexDirection: "row"
});

const Image = styled("img", ({ $theme }) => ({
  height: $theme.sizing.scale400,
  marginRight: $theme.sizing.scale100
}));

const Link = styled("span", ({ $theme }) => ({
  cursor: "pointer",
  fontWeight: "bold",
  userSelect: "none",
  textDecorationLine: "underline",
  color: $theme.colors.linkText,
  ":hover": {
    color: $theme.colors.linkHover
  }
}));

export const TorrentMediaInfo = ({ torrent }: Props) => {
  const tmdb = torrent.mediaInfo.info;
  const imdb = torrent.mediaInfo.imdbData;

  const OnLinkClick = () => {
    window.open(
      `/torrents/1/added/DESC/imdb-${torrent.mediaInfo.imdbData.imdbid}`,
      "_blank"
    );
  }

  return (
    <>
      <TitleContainer>
        <CenterVertically>
          <Image
            src={UnitedKingdomFlagSvg}
            alt="Zastava Ujedinjenog Kraljevstva"
          />
        </CenterVertically>
        <Title>
          Sinopsis za
          {' '}
          <Link
            onClick={OnLinkClick}
            onAuxClick={(event) => {
              if (event.button === 1) {
                event.preventDefault();
                OnLinkClick();
              }
            }}
          >
            {Helpers.GetMediaTorrentName(torrent)}
          </Link>
        </Title>
      </TitleContainer>
      <HorizontalRule />
      <LabelMedium>{tmdb.asset.overview}</LabelMedium>
      <br />
      {imdb.runtime ? (
        <LabelMedium><Bold>Dužina trajanja:</Bold> {imdb.runtime} min.</LabelMedium>
      ) : null}
      {tmdb.asset.release_date ? (
        <LabelMedium><Bold>Datum premijere:</Bold> {Helpers.GetFormattedDate(tmdb.asset.release_date)}</LabelMedium>
      ) : null}
      {(imdb.languages && imdb.languages.length !== 0) ? (
        <LabelMedium><Bold>Jezici:</Bold> {imdb.languages.join(", ")}</LabelMedium>
      ) : null}
      {tmdb.asset.movieGenres ? (
        <LabelMedium><Bold>Žanr:</Bold> {tmdb.asset.movieGenres}</LabelMedium>
      ) : null}
    </>
  );
};