import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

import { styled } from "baseui";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { DeleteAlt } from "baseui/icon";
import { Pagination } from "baseui/pagination";
import { LabelLarge } from "baseui/typography";
import { StyledSpinnerNext } from "baseui/spinner";
import { Accordion, Panel } from "baseui/accordion";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import {
  PeerIcon,
  PencilIcon,
  DownloadIcon
} from "../../components/icons";
import {
  CommentComponent,
  CommentInputComponent
} from "../../components/comment";
import {
  EditablePageTitle,
  H1 as PageTitleHeading
} from "../../components/PageTitle";
import {
  ContentWrapper,
  CenteredLayout
} from "../../components/ContentWrapper";
import {
  TorrentDownloadHistoryComponent
} from "../../components/TorrentDownloadHistory";
import { PageError } from "../../components/PageError";
import { EditableText } from "../../components/EditableText";
import { ZoomableImage } from "../../components/ZoomableImage";
import { YouTubePlayer } from "../../components/YouTubePlayer";
import { HorizontalRule } from "../../components/HorizontalRule";
import { PaginationWrapper } from "../../components/PaginationWrapper";
import { RawDescriptionContainer } from "../../components/RawDescriptionContainer";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { RootStateType } from "../../reducers";

import { TorrentCast } from "./TorrentCast";
import { TorrentPeerInfo } from "./TorrentPeerInfo";
import { TorrentMediaInfo } from "./TorrentMediaInfo";
import { TorrentDeleteModal } from "./TorrentDeleteModal";
import { TorrentDetailsTable } from "./TorrentDetailsTable";
import { TorrentFileTreeView } from "./TorrentFileTreeView";

const CoverImage = styled("img", ({ $theme }) => ({
  width: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  marginBottom: $theme.sizing.scale300
}));

const Heading = styled("h2", ({ $theme }) => ({
  marginBottom: $theme.sizing.scale100
}));

const PanelHeading = styled("h2", {
  marginTop: 0,
  marginBottom: 0
});

const ButtonWrapper = styled("div", {
  textAlign: "center"
});

const MediaInfoWrapper = styled("div", ({ $theme }) => ({
  marginTop: $theme.sizing.scale200
}));

interface EditTorrentMutationType {
  id: number;
  fields: EditTorrentRequest;
}

interface DeleteTorrentMutationType {
  id: number;
  reason: string;
}

interface ParamsType {
  id: string;
  page?: string;
}

const TorrentDetailsPage = () => {
  const auth = useSelector((state: RootStateType) => state.auth);

  const history = useHistory();
  const params = useParams<ParamsType>();

  const [is_editing, setIsEditing] = useState(false);
  const [show_download_history, setShowDownloadHistory] = useState(false);
  const [is_peer_info_modal_open, setIsPeerInfoModalOpen] = useState(false);
  const [is_delete_torrent_modal_open, setIsDeleteTorrentModalOpen] = useState(false);

  const {
    data: torrent,
    isError: isTorrentError
  } = useQuery(
    ["torrent_details", params.id],
    () => (
      Api.FetchTorrentDetails(+params.id)
        .then((response) => {
          Helpers.FillFakeUser(response, "uploaderInfo");
          return response;
        })
    ),
    { suspense: true }
  );

  const {
    data: files,
    isError: isFileError
  } = useQuery(
    ["torrent_details_files", params.id],
    () => Api.FetchTorrentFiles(+params.id)
  );

  const current_page = +(params.page || 1);

  const {
    data: comments,
    isError: isCommentError,
    refetch: refetchComments
  } = useQuery(
    ["torrent_details_comments", params.id, current_page],
    () => (
      Api.FetchTorrentComments(+params.id, current_page - 1)
        .then((response) => {
          Helpers.FillFakeUser(response.content);
          return response;
        })
    ),
    { suspense: true }
  );

  const GetTrailerVideoID = () => {
    if (!torrent)
      return "null";
    return Helpers.GetTrailer(torrent.mediaInfo.info.asset.trailers).key
  }

  const OnPageChange = (args: { nextPage: number }) => {
    history.push(`/torrent/${params.id}/${args.nextPage}`);
  }

  const query_client = useQueryClient();

  const delete_mutation = useMutation(
    (mutation: DeleteTorrentMutationType) => (
      Api.DeleteTorrent(mutation.id, mutation.reason)
    ),
    {
      onSuccess: () => {
        query_client.invalidateQueries(["torrent_details", params.id]);
        toaster.positive(`Torrent #${params.id} uspešno obrisan`, {});
        history.push("/torrents");
      },
      onError: () => {
        toaster.negative("Greška se dogodila prilikom brisanja ovog torenta.", {});
      }
    }
  );

  const edit_mutation = useMutation(
    (mutation: EditTorrentMutationType) => (
      Api.EditTorrent(mutation.id, mutation.fields)
    ),
    {
      onSuccess: () => {
        query_client.invalidateQueries(["torrent_details", params.id]);
        toaster.positive("Polje izmenjeno uspešno.", {});
      },
      onError: () => {
        toaster.negative("Greška se dogodila prilikom izmene ovog polja.", {});
      }
    }
  );

  if (auth.user === undefined)
    return null;

  if (isTorrentError)
      return (<PageError />);

  if (!torrent)
    return null;

  const is_staff = Helpers.IsUserStaff(auth.user);
  const has_moderation_rights = is_staff || (auth.user.id === torrent.uploaderInfo.id);
  const can_edit = has_moderation_rights && is_editing;
  return (
    <ContentWrapper width={8}>
      <Grid
        behavior={BEHAVIOR.fluid}
        gridGutters={16}
        gridMargins={[0, 0, 64]}
      >
        <Cell span={12}>
          <EditablePageTitle>
            <EditableText
              canEdit={can_edit}
              initialValue={torrent.name}
              onSet={(new_value: string) => {
                edit_mutation.mutate({
                  id: torrent.id,
                  fields: {
                    "name": new_value,
                    "categoryId": torrent.category.id
                  } as EditTorrentRequest
                });
              }}
            >
              <PageTitleHeading>{torrent.name}</PageTitleHeading>
            </EditableText>
          </EditablePageTitle>
        </Cell>
        {Helpers.HasPoster(torrent) ? (
          <Cell
            span={[4, 3, 4]}
            overrides={{
              Cell: {
                style: ({ $theme }) => ({
                  marginTop: 0,
                  marginRight: 0,
                  marginBottom: 0,
                  marginLeft: $theme.sizing.scale500,
                  paddingRight: "0",
                  paddingLeft: "0"
                })
              }
            }}
          >
            <CoverImage
              src={torrent.mediaInfo.info.asset.poster_medium}
            />
          </Cell>
        ) : null}
        <Cell span={[4, Helpers.HasPoster(torrent) ? 5 : 8, Helpers.HasPoster(torrent) ? 8 : 12]}>
          <TorrentDetailsTable torrent={torrent} />
          <ButtonWrapper>
            <Button
              kind="primary"
              startEnhancer={() => <DownloadIcon inverse />}
              onClick={() => Api.DownloadTorrent(torrent.id, torrent.filename)}
              $style={{ marginTop: "8px" }}
            >
              Preuzmi
            </Button>
            <Button
              kind="secondary"
              startEnhancer={() => <PeerIcon />}
              onClick={() => setIsPeerInfoModalOpen(true)}
              $style={{ marginTop: "8px", marginLeft: "8px" }}
            >
              Peer lista
            </Button>
          </ButtonWrapper>
        </Cell>
      </Grid>
      <Grid behavior={BEHAVIOR.fluid}>
        {is_peer_info_modal_open ? (
          <TorrentPeerInfo
            torrent={torrent}
            isOpen={is_peer_info_modal_open}
            onClose={() => setIsPeerInfoModalOpen(false)}
          />
        ) : null}
        {torrent.mediaTorrent ? (
          <Cell span={12}>
            <MediaInfoWrapper>
              <TorrentMediaInfo torrent={torrent} />
            </MediaInfoWrapper>
          </Cell>
        ) : null}
        {(torrent.mediaTorrent &&
        torrent.mediaInfo.info.asset.trailers &&
        (torrent.mediaInfo.info.asset.trailers.length !== 0)) ? (
          <Cell span={12}>
            <Heading>Trailer</Heading>
            <HorizontalRule />
            <YouTubePlayer
              width="100%"
              height="480px"
              video_id={GetTrailerVideoID()}
            />
          </Cell>
        ) : null}
        {torrent.mediaTorrent ? (
          <Cell span={12}>
            <TorrentCast torrent={torrent} />
          </Cell>
        ) : null}
        <Cell span={12}>
          <Heading>Opis</Heading>
          <HorizontalRule />
          <EditableText
            multiLine
            canEdit={can_edit}
            initialValue={torrent.rawDescr}
            onSet={(new_value: string) => {
              edit_mutation.mutate({
                id: torrent.id,
                fields: {
                  "description": new_value,
                  "categoryId": torrent.category.id
                } as EditTorrentRequest
              });
            }}
          >
            {torrent.descr ? (
              <RawDescriptionContainer>{torrent.descr}</RawDescriptionContainer>
            ) : (
              <LabelLarge>Ovaj torent ne sadrži opis {`:'(`}</LabelLarge>
            )}
          </EditableText>
        </Cell>
        <Cell span={12}>
          {isFileError ? (
            <Cell span={12}>
              <CenteredLayout>
                <LabelLarge>Greška se dogodila prilikom učitavanja fajlova {`:'(`}</LabelLarge>
              </CenteredLayout>
            </Cell>
          ) : (
            <>
              {!files ? (
                <CenteredLayout>
                  <StyledSpinnerNext />
                </CenteredLayout>
              ) : (
                <>
                  <Heading>Fajlovi ({files.length})</Heading>
                  <HorizontalRule />
                  <TorrentFileTreeView files={files} />
                </>
              )}
            </>
          )}
        </Cell>
        <Cell span={12}>
          <ContentWrapper width={0} height={2}>
            <Accordion>
              <Panel
                title={<PanelHeading>Kvalitet</PanelHeading>}
                overrides={{
                  Header: {
                    style: ({ $theme }) => ({
                      paddingLeft: 0,
                      backgroundColor: "unset",
                      borderBottomColor: $theme.colors.borderOpaque
                    })
                  },
                  Content: {
                    style: {
                      fontWeight: "unset",
                      paddingTop: 0,
                      paddingBottom: 0
                    }
                  },
                  PanelContainer: {
                    style: ({ $theme }) => ({
                      marginTop: $theme.sizing.scale300
                    })
                  }
                }}
              >
                <EditableText
                  multiLine
                  canEdit={can_edit}
                  initialValue={torrent.quality}
                  onSet={(new_value: string) => {
                    edit_mutation.mutate({
                      id: torrent.id,
                      fields: {
                        "quality": new_value,
                        "categoryId": torrent.category.id
                      } as EditTorrentRequest
                    });
                  }}
                >
                  <RawDescriptionContainer
                    $noSpace
                    $style={{ fontFamily: "monospace" }}
                  >
                    {torrent.quality}
                  </RawDescriptionContainer>
                </EditableText>
              </Panel>
              <Panel
                title={<PanelHeading>Slike ({torrent.images.length})</PanelHeading>}
                overrides={{
                  Content: {
                    style: ({ $theme, $expanded }) => ({
                      ...($expanded ? {
                        paddingTop: $theme.sizing.scale300,
                        paddingRight: $theme.sizing.scale300,
                        paddingBottom: $theme.sizing.scale300,
                        paddingLeft: $theme.sizing.scale300
                      } : {})
                    })
                  },
                  Header: {
                    style: ({ $theme }) => ({
                      paddingLeft: 0,
                      backgroundColor: "unset",
                      borderBottomColor: $theme.colors.borderOpaque
                    })
                  },
                  PanelContainer: {
                    style: ({ $theme }) => ({
                      marginTop: $theme.sizing.scale300
                    })
                  }
                }}
              >
                <Grid
                  behavior={BEHAVIOR.fluid}
                  gridMargins={0}
                  gridGaps={16}
                >
                  {(torrent.images &&
                  (torrent.images.length !== 0)) ? (
                    torrent.images.map((image, index) => (
                      <Cell key={image + index} span={4}>
                        <ZoomableImage image={image} />
                      </Cell>
                    ))
                  ) : null}
                </Grid>
              </Panel>
              {has_moderation_rights ? (
                <Panel
                  title={<PanelHeading>Istorijat preuzimanja</PanelHeading>}
                  onChange={({ expanded }) => {
                    if (expanded)
                      setShowDownloadHistory(true);
                  }}
                  overrides={{
                    Content: {
                      style: ({ $theme, $expanded }) => ({
                        ...($expanded ? {
                          paddingTop: $theme.sizing.scale300,
                          paddingRight: $theme.sizing.scale300,
                          paddingBottom: $theme.sizing.scale300,
                          paddingLeft: $theme.sizing.scale300
                        } : {})
                      })
                    },
                    Header: {
                      style: ({ $theme }) => ({
                        paddingLeft: 0,
                        backgroundColor: "unset",
                        borderBottomColor: $theme.colors.borderOpaque
                      })
                    },
                    PanelContainer: {
                      style: ({ $theme }) => ({
                        marginTop: $theme.sizing.scale300
                      })
                    }
                  }}
                >
                  <TorrentDownloadHistoryComponent
                    torrentId={torrent.id}
                    isEnabled={show_download_history}
                  />
                </Panel>
              ) : null}
            </Accordion>
          </ContentWrapper>
        </Cell>
        {isCommentError ? (
          <Cell span={12}>
            <CenteredLayout>
              <LabelLarge>Greška se dogodila prilikom učitavanja komentara {`:'(`}</LabelLarge>
            </CenteredLayout>
          </Cell>
        ) : (
          <Cell span={12}>
            {!comments ? (
              <CenteredLayout>
                <StyledSpinnerNext />
              </CenteredLayout>
            ) : (
              <>
                <ContentWrapper width={0} height={2}>
                  <Heading>Komentari ({comments.totalElements})</Heading>
                  <HorizontalRule />
                  {comments.content.map((comment) => (
                    <CommentComponent
                      key={comment.id}
                      type="torrent"
                      post={comment}
                      isStaff={is_staff}
                      canEdit={comment.user.id === auth.user?.id}
                      onRefresh={() => refetchComments()}
                    />
                  ))}
                </ContentWrapper>
                {comments.totalElements > 0 ? (
                  <PaginationWrapper>
                    <Pagination
                      size="mini"
                      numPages={comments.totalPages}
                      currentPage={current_page}
                      onPageChange={OnPageChange}
                    />
                  </PaginationWrapper>
                ) : null}
              </>
            )}
            <br />
            <CommentInputComponent
              type="torrent"
              id={+params.id}
              onSubmit={() => refetchComments()}
            />
          </Cell>
        )}
        {has_moderation_rights ? (
          <Cell span={12}>
            <ContentWrapper width={0} height={2}>
              <Heading>Moderacija</Heading>
              <HorizontalRule />
              <Button
                kind="secondary"
                size="compact"
                startEnhancer={() => <PencilIcon />}
                onClick={() => setIsEditing((state) => !state)}
                overrides={{ BaseButton: { style: { width: "50%" } } }}
              >
                {!is_editing ? "Uđi u režim izmene" : "Izađi iz režima izmene"}
              </Button>
              <Button
                kind="secondary"
                size="compact"
                startEnhancer={() => <DeleteAlt />}
                onClick={() => setIsDeleteTorrentModalOpen(true)}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      width: "50%",
                      color: $theme.colors.white,
                      backgroundColor: $theme.colors.negative600,
                      ":hover": { backgroundColor: $theme.colors.negative400 }
                    })
                  }
                }}
              >
                Obriši
              </Button>
            </ContentWrapper>
            <TorrentDeleteModal
              torrent={torrent}
              isOpen={is_delete_torrent_modal_open}
              onClose={() => setIsDeleteTorrentModalOpen(false)}
              onConfirm={(reason: string) => {
                delete_mutation.mutate({ id: torrent.id, reason: reason });
              }}
            />
          </Cell>
        ) : null}
      </Grid>
    </ContentWrapper>
  );
}

export default TorrentDetailsPage;