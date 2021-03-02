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

const MAX_TORRENTS = 5;

const Bold = styled("span", {
  fontWeight: "bold"
});

const Title = styled("h2", {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0
});

const Wrapper = styled("div", ({ $theme }) => ({
  marginTop: $theme.sizing.scale300
}));

export const NeededSeedersTable = () => {
  const { data: torrents, isError } = useQuery(
    "needed_seeders",
    Api.FetchNeededSeeders
  );

  if (isError)
    return (<Bold>Greška se dogodila prilikom učitavanja tabele sa torentima kojima su potrebni seed-eri.</Bold>);

  const selection = (torrents ? torrents.slice(0, MAX_TORRENTS) : null);
  if (selection && selection.length === 0)
    return (<Bold>{`Trenutno nema torenata kojima su seed-eri potrebni!! :))`}</Bold>);

  return (
    <Wrapper>
      <Title>Torenti kojima su potrebni seed-eri</Title>
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
            <TableBuilderColumn header="S" numeric>
              {(torrent) => (<Bold>{torrent.seeders}</Bold>)}
            </TableBuilderColumn>
            <TableBuilderColumn header="L" numeric>
              {(torrent) => (<Bold $style={{ color: "#d00210" }}>{torrent.leechers}</Bold>)}
            </TableBuilderColumn>
          </TableBuilder>
        </>
      )}
    </Wrapper>
  );
};