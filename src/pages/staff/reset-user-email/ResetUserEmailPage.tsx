import React, { useState } from "react";
import { useQuery } from "react-query";
import moment from "moment";

import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { StyledLink } from "baseui/link";
import { Check, DeleteAlt } from "baseui/icon";
import { StatefulTooltip } from "baseui/tooltip";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
import { LabelMedium, LabelSmall } from "baseui/typography";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import {
  ContentWrapper
} from "../../../components/ContentWrapper";
import { UserTag } from "../../../components/UserTag";
import { PageTitle } from "../../../components/PageTitle";
import { PageError } from "../../../components/PageError";
import { ElevatedPanel } from "../../../components/ElevatedPanel";
import { CommentTextWrapper } from "../../../components/comment";

import * as Api from "../../../api";
import * as Helpers from "../../../helpers";

import { DenyResetModal } from "./DenyResetModal";
import { ApproveResetModal } from "./ApproveResetModal";

const RenderCreatedAt = (request: ResetEmailRequestDTO) => (
  <StatefulTooltip
    content={moment(request.created).format("LLLL")}
  >
    <LabelSmall
      overrides={{ Block: { style: { whiteSpace: "nowrap" } } }}
    >
      {moment(request.created).fromNow()}
    </LabelSmall>
  </StatefulTooltip>
);

const RenderEmail = (request: ResetEmailRequestDTO) => (
  <LabelSmall>{request.email}</LabelSmall>
);

const RenderUsername = (request: ResetEmailRequestDTO) => (
  <StyledLink
    rel="noopener noreferrer"
    href={`https://eliteunitedcrew.org/usersearch.php?n=${request.username}`}
    target="_blank"
  >
    {request.username}
  </StyledLink>
);

const RenderText = (request: ResetEmailRequestDTO) => (
  <Block minWidth="200px">
    <CommentTextWrapper>{request.text}</CommentTextWrapper>
  </Block>
);

const RenderIsValid = (request: ResetEmailRequestDTO) => (
  <StatefulTooltip
    content={Helpers.GetFormattedTime(request.lastModified)}
  >
    <span>
      {request.valid === "YES" ? (
        <LabelSmall
          color="#56922c"
          overrides={{
            Block: { style: { fontWeight: "bold" } }
          }}
        >
          Odobren
        </LabelSmall>
      ) : (
        <>
          {request.valid === "NO" ? (
            <LabelSmall color="#d00210">PONIŠTEN</LabelSmall>
          ) : (
            <LabelSmall>Neodređen</LabelSmall>
          )}
        </>
      )}
    </span>
  </StatefulTooltip>
);

const ResetUserEmailPage = () => {
  const [approved_request, setApprovedRequest] = useState<ResetEmailRequestDTO | null>(null);
  const [denied_request, setDeniedRequest] = useState<ResetEmailRequestDTO | null>(null);

  const {
    data,
    isError,
    refetch
  } = useQuery(
    "reset_email_requests",
    Api.FetchResetEmailRequests,
    { suspense: true }
  );

  const RenderIsDone = (request: ResetEmailRequestDTO) => (
    <>
      {(request.done && request.moderator !== undefined) ? (
        <UserTag user={request.moderator} />
      ) : (
        <Block display="flex" flexDirection="column">
          <Button
            kind="primary"
            size="mini"
            startEnhancer={() => <Check />}
            onClick={() => setApprovedRequest(request)}
            overrides={{
              Root: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale100
                })
              }
            }}
          >
            Odobri
          </Button>
          <Button
            kind="secondary"
            size="mini"
            startEnhancer={() => <DeleteAlt />}
            onClick={() => setDeniedRequest(request)}
          >
            Poništi
          </Button>
        </Block>
      )}
    </>
  );

  if (isError)
    return (<PageError />);

  if (!data)
    return null;

  return (
    <ContentWrapper width={4}>
      <Grid
        behavior={BEHAVIOR.fluid}
        gridMargins={0}
      >
        <Cell span={12}>
          <PageTitle>STAFF Email reset</PageTitle>
        </Cell>
        <LabelMedium
          marginTop="scale300"
          marginRight="scale700"
          marginBottom="scale700"
          marginLeft="scale700"
        >
          Da vidite kada je neki zahtev poslednji put menjan, pređite mišem preko statusa.
        </LabelMedium>
        <Cell span={12}>
          <ElevatedPanel>
            <TableBuilder
              data={data}
              overrides={{
                TableBodyCell: {
                  style: {
                    verticalAlign: "middle",
                    textAlign: "center"
                  }
                },
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
              <TableBuilderColumn header="Pre">
                {RenderCreatedAt}
              </TableBuilderColumn>
              <TableBuilderColumn header="Ime">
                {RenderUsername}
              </TableBuilderColumn>
              <TableBuilderColumn header="Poruka">
                {RenderText}
              </TableBuilderColumn>
              <TableBuilderColumn header="Nov Email">
                {RenderEmail}
              </TableBuilderColumn>
              <TableBuilderColumn header="Status">
                {RenderIsValid}
              </TableBuilderColumn>
              <TableBuilderColumn header="Izmenio">
                {RenderIsDone}
              </TableBuilderColumn>
            </TableBuilder>
          </ElevatedPanel>
        </Cell>
        <ApproveResetModal
          refetch={refetch}
          approvedRequest={approved_request}
          onModalClose={() => setApprovedRequest(null)}
        />
        <DenyResetModal
          refetch={refetch}
          deniedRequest={denied_request}
          onModalClose={() => setDeniedRequest(null)}
        />
      </Grid>
    </ContentWrapper>
  );
}

export default ResetUserEmailPage;