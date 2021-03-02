import React, { useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useQuery } from "react-query";
import moment from "moment";

import { styled } from "baseui";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from "baseui/modal";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Pagination } from "baseui/pagination";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import {
  CommentTextWrapper,
  CommentInputComponent
} from "../../components/comment";
import {
  ContentWrapper,
  CenterHorizontally
} from "../../components/ContentWrapper";
import { UserTag } from "../../components/UserTag";
import { PageTitle } from "../../components/PageTitle";
import { LinkAnchor } from "../../components/LinkAnchor";
import { ElevatedPanel } from "../../components/ElevatedPanel";
import { PaginationWrapper } from "../../components/PaginationWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

interface ParamsType {
  page?: string;
}

const Time = styled("span", {
  whiteSpace: "nowrap"
});

const BBCodeWrapper = styled("div", ({ $theme }) => ({
  marginBottom: $theme.sizing.scale700
}));

const SupportPage = () => {
  const history = useHistory();
  const params = useParams<ParamsType>();

  const [selected_question, setSelectedQuestion] = useState<StaffQuestionDTO | null>(null);

  const current_page = +(params.page || 1);
  const {
    data,
    refetch
  } = useQuery(
    ["staff_support_page", current_page],
    () => (
      Api.FetchStaffQuestions(current_page - 1)
        .then((response) => {
          response.content.forEach((question) => {
            Helpers.FillFakeUser(question);

            // Only fill staff field if the question has been answered
            if (question.answered === "YES")
              Helpers.FillFakeUser(question, "staff");
          });

          return response;
        })
    ),
    { suspense: true }
  );

  const OnModalClose = () => setSelectedQuestion(null);

  const OnPageChange = (args: { nextPage: number }) => {
    history.push(`/support/${args.nextPage}`);
  }

  if (!data)
    return null;

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <Block display="flex">
            <PageTitle>STAFF Podrška</PageTitle>
            <Block
              display="inline-block"
              marginTop="auto"
              marginRight="0"
              marginBottom="auto"
              marginLeft="auto"
            >
              <Link
                to="/reset/email"
                component={LinkAnchor}
              >
                Email reset
              </Link>
            </Block>
          </Block>
        </Cell>
        <Cell span={12}>
          <ElevatedPanel>
            <TableBuilder
              data={data.content}
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
              <TableBuilderColumn header="Vreme">
                {(question) => (
                  <Time>{moment(question.added).fromNow()}</Time>
                )}
              </TableBuilderColumn>
              <TableBuilderColumn header="Korisnik">
                {(question) => (
                  <CenterHorizontally>
                    <UserTag user={question.user} />
                  </CenterHorizontally>
                )}
              </TableBuilderColumn>
              <TableBuilderColumn header="Pitanje">
                {(question) => (
                  <Block minWidth="200px">
                    <CommentTextWrapper>
                      {Helpers.FormatBBcode(question.question)}
                    </CommentTextWrapper>
                  </Block>
                )}
              </TableBuilderColumn>
              <TableBuilderColumn header="Odgovorio">
                {(question) => (
                  <>
                    {question.answered === "YES" ? (
                      <CenterHorizontally>
                        <UserTag user={question.staff} />
                      </CenterHorizontally>
                    ) : (
                      <Button
                        kind="primary"
                        size="compact"
                        onClick={() => setSelectedQuestion(question)}
                      >
                        Odgovori
                      </Button>
                    )}
                  </>
                )}
              </TableBuilderColumn>
            </TableBuilder>
          </ElevatedPanel>
        </Cell>
        <Cell span={12}>
          <PaginationWrapper>
            <Pagination
              size="mini"
              numPages={data.totalPages}
              currentPage={current_page}
              onPageChange={OnPageChange}
            />
          </PaginationWrapper>
        </Cell>
        <Modal
          animate
          autoFocus
          closeable
          unstable_ModalBackdropScroll
          size="auto"
          role="dialog"
          onClose={OnModalClose}
          isOpen={selected_question !== null}
        >
          {selected_question ? (
            <>
              <ModalHeader>{selected_question.user.username}</ModalHeader>
              <ModalBody $style={{ marginBottom: 0 }}>
                <BBCodeWrapper>
                  {Helpers.FormatBBcode(selected_question.question)}
                </BBCodeWrapper>
                <CommentInputComponent
                  id={selected_question.id}
                  type="support-staff"
                  onSubmit={() => {
                    OnModalClose();
                    refetch();
                  }}
                />
              </ModalBody>
              <ModalFooter $style={{ marginTop: 0 }}>
                <ModalButton kind="tertiary" onClick={OnModalClose}>
                  Poništi
                </ModalButton>
              </ModalFooter>
            </>
          ) : null}
        </Modal>
      </Grid>
    </ContentWrapper>
  );
}

export default SupportPage;