import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";

import { styled } from "baseui";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { DeleteAlt } from "baseui/icon";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import {
  Table,
  TableRoot,
  TableBody,
  TableCell,
  TableRow
} from "../../components/Table";
import {
  CommentComponent,
  CommentInputComponent
} from "../../components/comment";
import {
  TorrentCategoryBreadcrumbs
} from "../torrents/TorrentCategoryBreadcrumbs";
import { ResetIcon } from "../../components/icons";
import { UserTag } from "../../components/UserTag";
import { PageTitle } from "../../components/PageTitle";
import { PageError } from "../../components/PageError";
import { LinkAnchor } from "../../components/LinkAnchor";
import { PageLoading } from "../../components/PageLoading";
import { ElevatedPanel } from "../../components/ElevatedPanel";
import { HorizontalRule } from "../../components/HorizontalRule";
import { ContentWrapper } from "../../components/ContentWrapper";
import { ConfirmActionModal } from "../../components/ConfirmActionModal";
import { RawDescriptionContainer } from "../../components/RawDescriptionContainer";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { RootStateType } from "../../reducers";

const Bold = styled("span", {
  fontWeight: "bold"
});

const Heading = styled("h2", ({ $theme }) => ({
  marginTop: $theme.sizing.scale900,
  marginBottom: $theme.sizing.scale100
}));

const ButtonWrapper = styled("div", ({ $theme }) => ({
  marginTop: $theme.sizing.scale300
}));

interface ParamsType {
  id: string;
}

const RequestDetailsPage = () => {
  const history = useHistory();
  const params = useParams<ParamsType>();
  const auth = useSelector((state: RootStateType) => state.auth);

  const [request, setRequest] = useState<RequestDTO | null>(null);
  const [action_remove, setActionRemove] = useState(false);
  const [action_reset, setActionReset] = useState(false);
  const [error, setError] = useState(false);

  const LoadRequest = () => {
    const id = +params.id;
    if (isNaN(id))
      return setError(true);

    setRequest(null);

    Api.FetchRequest(id)
      .then((response) => {
        // Make sure there are no nulls
        Helpers.FillFakeUser(response, "requester");
        Helpers.FillFakeUser(response.commentList);

        if (response.filled !== undefined)
          Helpers.FillFakeUser(response, "filler");

        setRequest(response);
      })
      .catch(() => {
        setError(true);
        toaster.negative("Greška se dogodila prilikom učitavanja vaših poruka", {});
      });
  }

  const DeleteRequest = () => {
    if (!request || isNaN(request.id))
      return setError(true);

    Api.DeleteRequest(request.id)
      .then(() => {
        toaster.positive(`Uspešno obrisan zahtev "${request.request}" (${request.id})`, {});
        history.push("/requests");
      })
      .catch(() => {
        setError(true);
        toaster.negative("Greška se dogodila prilikom brisanja zahteva", {});
      });
  }

  const ResetRequest = () => {
    if (!request || isNaN(request.id))
      return setError(true);

    Api.ResetRequest(request.id)
      .then(() => {
        toaster.positive(`Uspešno resetovan zahtev "${request.request}" (${request.id})`, {});
        history.push("/requests");
      })
      .catch(() => {
        setError(true);
        toaster.negative("Greška se dogodila prilikom resetovanja zahteva", {});
      });
  }

  const OnClose = () => {
    setActionRemove(false);
    setActionReset(false);
  }

  useEffect(LoadRequest, [params.id]);

  if (auth.user === undefined)
    return null;

  if (error)
    return (<PageError />);

  const is_staff = Helpers.IsUserStaff(auth.user);
  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>{request ? request.request : `Zahtev br. ${params.id}`}</PageTitle>
        </Cell>
        <Cell span={12}>
          <ElevatedPanel>
            {!request ? (
              <PageLoading />
            ) : (
              <>
                <TableRoot>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell><Bold>Naziv</Bold></TableCell>
                        <TableCell>{request.request}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Bold>Kategorija</Bold></TableCell>
                        <TableCell><TorrentCategoryBreadcrumbs category={request.category} /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Bold>Opis</Bold></TableCell>
                        <TableCell>
                          <RawDescriptionContainer>
                            {request.description}
                          </RawDescriptionContainer>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Bold>Dodato</Bold></TableCell>
                        <TableCell>
                          {Helpers.GetFormattedDate(request.added)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Bold>Dodao</Bold></TableCell>
                        <TableCell><UserTag user={request.requester} /></TableCell>
                      </TableRow>
                      {request.filled !== undefined ? (
                        <>
                          <TableRow>
                            <TableCell><Bold>Ispunjen</Bold></TableCell>
                            <TableCell><Bold $style={{ color: "#56922c" }}>Da</Bold></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><Bold>Ispunio</Bold></TableCell>
                            <TableCell><UserTag user={request.filler} /></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><Bold>Link</Bold></TableCell>
                            <TableCell>
                              <Link
                                to={`/torrent/${request.filled}`}
                                component={LinkAnchor}
                              >
                                Torent #{request.filled}
                              </Link>
                            </TableCell>
                          </TableRow>
                        </>
                      ) : null}
                    </TableBody>
                  </Table>
                </TableRoot>
                {(is_staff || auth.user.id === request.requester.id) ? (
                  <ButtonWrapper>
                    <Button
                      size="compact"
                      onClick={() => setActionRemove(true)}
                      startEnhancer={() => <DeleteAlt />}
                      overrides={{
                        Root: { style: { width: "50%" } }
                      }}
                    >
                      Obriši zahtev
                    </Button>
                    <Button
                      kind="secondary"
                      size="compact"
                      disabled={request.filled === undefined}
                      onClick={() => setActionReset(true)}
                      startEnhancer={() => <ResetIcon />}
                      overrides={{
                        Root: { style: { width: "50%" } }
                      }}
                    >
                      Resetuj
                    </Button>
                    <ConfirmActionModal
                      title={action_remove ? "Obriši zahtev" : "Resetuj zahtev"}
                      isOpen={action_remove || action_reset}
                      onConfirm={action_remove ? DeleteRequest : ResetRequest}
                      onClose={OnClose}
                    />
                  </ButtonWrapper>
                ) : null}
              </>
            )}
          </ElevatedPanel>
          {request ? (
            <>
              <Heading>Komentari ({request.comments})</Heading>
              <HorizontalRule />
              {request.commentList.map((comment) => (
                <CommentComponent
                  key={comment.id}
                  type="request"
                  post={comment}
                  isStaff={is_staff}
                  canEdit={comment.user.id === auth.user?.id}
                  onRefresh={LoadRequest}
                />
              ))}
              <CommentInputComponent
                type="request"
                id={+params.id}
                onSubmit={LoadRequest}
              />
            </>
          ) : null}
        </Cell>
      </Grid>
    </ContentWrapper>
  );
};

export default RequestDetailsPage;