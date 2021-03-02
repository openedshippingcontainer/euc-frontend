import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import { styled } from "baseui";
import { Block } from "baseui/block";
import { LabelSmall } from "baseui/typography";
import { StyledSpinnerNext } from "baseui/spinner";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import { LinkAnchor } from "./LinkAnchor";
import { CenteredLayout } from "./ContentWrapper";

import * as Api from "../api";

const MAX_TORRENTS = 15;

const Bold = styled("span", {
  fontWeight: "bold"
});

const Title = styled("h2", {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0
});

export const HotTorrentsTable = () => {
  const { data: torrents, isError } = useQuery(
    "hot_torrents",
    Api.FetchHotTorrents
  );

  if (isError)
    return (<Bold>Greška se dogodila prilikom učitavanja tabele sa popularnim torentima.</Bold>);
    
  const selection = (torrents ? torrents.slice(0, MAX_TORRENTS) : null);
  if (selection && selection.length === 0)
    return (<Bold>{`Trenutno nema popularnih torenata :'(`}</Bold>);

  return (
    <>
      <Title>Popularni torenti</Title>
      {!selection ? (
        <CenteredLayout>
          <Block
            marginTop="scale600"
            marginBottom="scale600"
          >
            <StyledSpinnerNext />
          </Block>
        </CenteredLayout>
      ) : (
        <>
          <LabelSmall>
            Prikazano {selection.length} od
            <Bold> {torrents!.length}</Bold> dostupnih torenata
          </LabelSmall>
          <br />
          <TableBuilder
            data={selection}
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
              }
            }}
          >
            <TableBuilderColumn header="Naziv">
              {(torrent) => (
                <Link
                  to={`/torrent/${torrent.id}`}
                  component={LinkAnchor}
                >
                  {torrent.name}
                </Link>
              )}
            </TableBuilderColumn>
          </TableBuilder>
        </>
      )}
    </>
  );
};