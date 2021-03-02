import React from "react";
import { useSelector } from "react-redux";
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
import { StatefulTooltip } from "baseui/tooltip";
import { StyledSpinnerNext } from "baseui/spinner";
import { ProgressBar, SIZE } from "baseui/progress-bar";
import { LabelLarge, LabelSmall } from "baseui/typography";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import { UserTag } from "../../components/UserTag";
import { CenteredLayout } from "../../components/ContentWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { RootStateType } from "../../reducers";

interface Props {
  torrent: TorrentDTO;
  isOpen: boolean;
  onClose: () => void;
}

const Bold = styled("span", {
  fontWeight: "bold"
});

export const TorrentPeerInfo = ({ torrent, isOpen, onClose }: Props) => {
  const auth = useSelector((state: RootStateType) => state.auth);

  const { data, error } = useQuery(
    ["peer_info", torrent.id],
    () => (
      Api.FetchTorrentPeers(torrent.id)
        .then((response) => {
          Helpers.FillFakeUser(response);
          return response
            // Sort according to the amount uploaded
            .sort((a: PeerDTO, b: PeerDTO) => (b.uploaded - a.uploaded))
            // Sort according to seed state
            .sort((a: PeerDTO, b: PeerDTO) => (b.seeder.localeCompare(a.seeder, "sr")))
            // Sort according to connectable state
            .sort((a: PeerDTO, b: PeerDTO) => (b.connectable.localeCompare(a.connectable, "sr")));
        })
    ),
    { staleTime: 5 * 1000 }
  );

  return (
    <Modal
      animate
      autoFocus
      closeable
      unstable_ModalBackdropScroll
      size="auto"
      role="dialog"
      isOpen={isOpen}
      onClose={onClose}
    >
      {error ? (
        <ModalHeader>
          Greška se dogodila prilikom učitavanja peer informacija.
        </ModalHeader>
      ) : (
        <>
          {!data ? (
            <CenteredLayout
              $style={{ minWidth: "min(90vw, 256px)", minHeight: "128px" }}
            >
              <StyledSpinnerNext />
            </CenteredLayout>
          ) : (
            <>
              <ModalHeader>Peer informacije</ModalHeader>
              <ModalBody $style={{ marginBottom: 0 }}>
                {data.length === 0 ? (
                  <LabelLarge marginTop="scale200">
                    Trenutno nema korisnika na ovom torentu {":'("}
                  </LabelLarge>
                ) : (
                  <TableBuilder
                    data={data}
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
                      TableBodyCell: { style: { verticalAlign: "middle" } }
                    }}
                  >
                    <TableBuilderColumn header="Korisnik">
                      {(peer: PeerDTO) => (
                        <UserTag user={peer.user} />
                      )}
                    </TableBuilderColumn>
                    {Helpers.IsUserStaff(auth.user) ? (
                      <TableBuilderColumn header="IP">
                        {(peer: PeerDTO) => (<>{peer.ip}</>)}
                      </TableBuilderColumn>
                    ) : null}
                    <TableBuilderColumn header="Klijent">
                      {(peer: PeerDTO) => (<>{peer.agent}</>)}
                    </TableBuilderColumn>
                    <TableBuilderColumn
                      header="Progres"
                      overrides={{
                        TableBodyCell: {
                          // @ts-ignore
                          style: ({ $theme }) => ({
                            paddingTop: $theme.sizing.scale200,
                            paddingRight: $theme.sizing.scale100,
                            paddingBottom: $theme.sizing.scale200,
                            paddingLeft: $theme.sizing.scale100,
                            verticalAlign: "middle"
                          })
                        }
                      }}
                    >
                      {(peer: PeerDTO) => (
                        <Block minWidth="scale3200">
                          <ProgressBar
                            showLabel
                            size={SIZE.large}
                            value={
                              peer.seeder === "YES" ?
                              100 :
                              Math.ceil((100 * peer.downloaded) / torrent.size)
                            }
                            successValue={100}
                            getProgressLabel={(value: number) => (
                              <LabelSmall>{value}%</LabelSmall>
                            )}
                            overrides={{
                              BarContainer: {
                                style: ({ $theme }) => ({
                                  marginTop: $theme.sizing.scale100,
                                  marginRight: $theme.sizing.scale100,
                                  marginBottom: $theme.sizing.scale200,
                                  marginLeft: $theme.sizing.scale100
                                })
                              }
                            }}
                          />
                        </Block>
                      )}
                    </TableBuilderColumn>
                    <TableBuilderColumn header="UL">
                      {(peer: PeerDTO) => (<>{Helpers.GetSizeFromBytes(peer.uploaded)}</>)}
                    </TableBuilderColumn>
                    <TableBuilderColumn header="DL">
                      {(peer: PeerDTO) => (<>{Helpers.GetSizeFromBytes(peer.downloaded)}</>)}
                    </TableBuilderColumn>
                    <TableBuilderColumn header="Announce">
                      {(peer: PeerDTO) => (
                        <StatefulTooltip
                          content={moment(peer.lastAction).subtract(2, "hours").format("LLLL")}
                        >
                          {moment(peer.lastAction).subtract(2, "hours").fromNow()}
                        </StatefulTooltip>
                      )}
                    </TableBuilderColumn>
                    <TableBuilderColumn header="Seeder">
                      {(peer: PeerDTO) => (
                        <>
                          {peer.seeder === "YES" ? (
                            <Bold $style={{ color: "#56922c" }}>Da</Bold>
                          ) : (
                            <span style={{ color: "#d00210" }}>Ne</span>
                          )}
                        </>
                      )}
                    </TableBuilderColumn>
                    <TableBuilderColumn header="Connectable">
                      {(peer: PeerDTO) => (
                        <>
                          {peer.connectable === "YES" ? (
                            <Bold $style={{ color: "#56922c" }}>Da</Bold>
                          ) : (
                            <span style={{ color: "#d00210" }}>Ne</span>
                          )}
                        </>
                      )}
                    </TableBuilderColumn>
                  </TableBuilder>
                )}
              </ModalBody>
              <ModalFooter $style={{ marginTop: 0 }}>
                <ModalButton
                  kind="tertiary"
                  onClick={onClose}
                >
                  Zatvori
                </ModalButton>
              </ModalFooter>
            </>
          )}
        </>
      )}
    </Modal>
  );
};