import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import moment from "moment";

import { styled } from "baseui";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { LabelLarge } from "baseui/typography";
import { StatefulTooltip } from "baseui/tooltip";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import { UserTag } from "../../components/UserTag";
import { PencilIcon } from "../../components/icons";
import { PageTitle } from "../../components/PageTitle";
import { LinkAnchor } from "../../components/LinkAnchor";
import { ElevatedPanel } from "../../components/ElevatedPanel";
import { ContentWrapper, CenteredLayout } from "../../components/ContentWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

const Bold = styled("span", {
  fontWeight: "bold"
});

const NameWrapper = styled("div", {
  minWidth: "196px"
});

const RequestsPage = () => {
  const history = useHistory();

  const { data: requests } = useQuery(
    "requests",
    () => (
      Api.FetchRequests()
        .then((response) => {
          // Sort by last added
          response.sort((a: RequestDTO, b: RequestDTO) => (
            moment(b.added).diff(a.added)
          ));

          // Make sure there are no nulls
          response.forEach((entry) => {
            Helpers.FillFakeUser(entry, "requester");

            if (entry.filled !== undefined)
              Helpers.FillFakeUser(entry, "filler");
          });

          return response;
        })
    ),
    { suspense: true }
  );

  if (!requests)
    return null;

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <Block display="flex">
            <PageTitle>Zahtevi</PageTitle>
            <Block
              display="inline-block"
              marginTop="auto"
              marginRight="0"
              marginBottom="auto"
              marginLeft="auto"
            >
              <Button
                size="compact"
                startEnhancer={() => <PencilIcon inverse />}
                onClick={() => history.push("/requests/new")}
              >
                Nov zahtev
              </Button>
            </Block>
          </Block>
        </Cell>
        <Cell span={12}>
          <ElevatedPanel>
            {requests.length === 0 ? (
              <CenteredLayout>
                <LabelLarge>Trenutno nema zahteva!! :)</LabelLarge>
              </CenteredLayout>
            ) : (
              <TableBuilder
                data={requests}
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
                  TableBodyCell: {
                    style: {
                      verticalAlign: "middle",
                      textAlign: "center"
                    }
                  }
                }}
              >
                <TableBuilderColumn header="ID">
                  {(request: RequestDTO) => (
                    <>{request.id}</>
                  )}
                </TableBuilderColumn>
                <TableBuilderColumn
                  header="Naziv"
                  overrides={{
                    TableBodyCell: { style: { verticalAlign: "middle" } }
                  }}
                >
                  {(request: RequestDTO) => (
                    <NameWrapper>
                      <Link
                        to={`/request/${request.id}`}
                        component={LinkAnchor}
                        // @ts-ignore
                        $style={{
                          fontWeight: "bold",
                          textDecoration: "unset"
                        }}
                      >
                        {request.request}
                      </Link>
                    </NameWrapper>
                  )}
                </TableBuilderColumn>
                <TableBuilderColumn header="Kom.">
                  {(request: RequestDTO) => (
                    <>
                      {request.comments > 0 ? (
                        <Bold>{request.comments}</Bold>
                      ) : (
                        <>{request.comments}</>
                      )}
                    </>
                  )}
                </TableBuilderColumn>
                <TableBuilderColumn header="Kategorija">
                  {(request: RequestDTO) => (
                    <>{request.category.name}</>
                  )}
                </TableBuilderColumn>
                <TableBuilderColumn header="Dodato">
                  {(request: RequestDTO) => (
                    <StatefulTooltip
                      content={moment(request.added).format("LLLL")}
                    >
                      {moment(request.added).fromNow()}
                    </StatefulTooltip>
                  )}
                </TableBuilderColumn>
                <TableBuilderColumn header="Dodao">
                  {(request: RequestDTO) => (
                    <UserTag user={request.requester} />
                  )}
                </TableBuilderColumn>
                <TableBuilderColumn header="Ispunjen?">
                  {(request: RequestDTO) => (
                    <>
                      {request.filled !== undefined ? (
                        <Bold $style={{ color: "#56922c" }}>Da</Bold>
                      ) : (
                        <span style={{ color: "#d00210" }}>Ne</span>
                      )}
                    </>
                  )}
                </TableBuilderColumn>
                <TableBuilderColumn header="Ispunio">
                  {(request: RequestDTO) => (
                    <>
                      {request.filled !== undefined ? (
                        <UserTag user={request.filler} />
                      ) : (
                        <>--</>
                      )}
                    </>
                  )}
                </TableBuilderColumn>
              </TableBuilder>
            )}
          </ElevatedPanel>
        </Cell>
      </Grid>
    </ContentWrapper>
  );
};

export default RequestsPage;