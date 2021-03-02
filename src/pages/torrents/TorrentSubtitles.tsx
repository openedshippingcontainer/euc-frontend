import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";

import { styled } from "baseui";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from "baseui/modal";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { StyledLink } from "baseui/link";
import { Plus, DeleteAlt } from "baseui/icon";
import { FormControl } from "baseui/form-control";
import { StyledSpinnerNext } from "baseui/spinner";

import { PencilIcon } from "../../components/icons";
import { CenterVertically } from "../../components/ContentWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { RootStateType } from "../../reducers";

interface Props {
  torrent: TorrentDTO;
}

const Bold = styled("span", {
  fontWeight: "bold"
});

const Container = styled("div", ({ $theme }) => ({
  marginBottom: $theme.sizing.scale300
}));

const Wrapper = styled("div", ({ $theme }) => ({
  marginTop: $theme.sizing.scale100,
  marginRight: 0,
  marginBottom: $theme.sizing.scale100,
  marginLeft: 0
}));

const ActionWrapper = styled("span", ({ $theme }) => ({
  cursor: "pointer",
  marginTop: "auto",
  marginBottom: "auto",
  marginLeft: $theme.sizing.scale400
}));

type ActionType = "none" | "add" | "edit" | "delete";

interface ModalDialogProps {
  action: ActionType;
  subtitle?: SubtitleDTO;
  onAdd: (language: string, link: string) => void;
  onEdit: (language: string, link: string, subtitle_id: number) => void;
  onDelete: (subtitle_id: number) => void;
  onClose: () => void;
}

const GetActionTitle = (action: ActionType) => {
  switch (action) {
    case "add": return "Dodajte";
    case "edit": return "Izmenite";
    case "delete": return "Obrišite";
    default: return "";
  }
}

const ModalDialog = ({ action, subtitle, onAdd, onEdit, onDelete, onClose }: ModalDialogProps) => {
  const [url, setURL] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(
    () => {
      if (subtitle !== undefined) {
        setURL(subtitle.url);
        setLanguage(subtitle.lang);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subtitle]
  );

  return (
    <Modal
      animate
      autoFocus
      closeable
      unstable_ModalBackdropScroll
      role="dialog"
      isOpen={(action === "add") || (subtitle !== undefined)}
      onClose={onClose}
    >
      <ModalHeader>{`${GetActionTitle(action)} titl`}</ModalHeader>
      <ModalBody $style={{ marginBottom: 0 }}>
        {action === "delete" ? (
          <>Da li ste sigurni da želite da obrišete ovaj titl?</>
        ) : (
          <>
            <FormControl
              label="Jezik"
            >
              <Input
                required
                value={language}
                onChange={(event) => setLanguage(event.currentTarget.value)}
              />
            </FormControl>
            <FormControl
              label="URL"
            >
              <Input
                required
                value={url}
                onChange={(event) => setURL(event.currentTarget.value)}
              />
            </FormControl>
          </>
        )}
      </ModalBody>
      <ModalFooter $style={{ marginTop: 0 }}>
        <ModalButton
          type="submit"
          kind="primary"
          startEnhancer={() => <Plus />}
          onClick={() => {
            switch (action) {
              case "add":
                onAdd(language, url);
                break;
              case "edit":
                if (subtitle !== undefined)
                  onEdit(language, url, subtitle.id);
                break;
              case "delete":
                if (subtitle !== undefined)
                  onDelete(subtitle.id);
                break;
              default: return;
            }
            onClose();
          }}
        >
          Dodaj
        </ModalButton>
        <ModalButton
          kind="tertiary"
          onClick={onClose}
        >
          Nazad
        </ModalButton>
      </ModalFooter>
    </Modal>
  );
}

// TODO: Add ability for owners to edit/delete their own subtitles
export const TorrentSubtitles = ({ torrent }: Props) => {
  const auth = useSelector((state: RootStateType) => state.auth);

  const [action, setAction] = useState<ActionType>("none");
  const [action_subtitle, setActionSubtitle] = useState<SubtitleDTO | undefined>(undefined);

  const { data: subtitles, isError, refetch } = useQuery(
    ["subtitles", torrent.id],
    () => Api.FetchTorrentSubs(torrent.id)
  );

  const OnClose = () => {
    setAction("none");
    setActionSubtitle(undefined);
  }

  const OnAdd = (language: string, link: string) => {
    Api.AddSubtitle(language, link, torrent.id)
      .then(() => {
        refetch();
        toaster.positive(`Uspešno dodat titl za ${language} jezik`, {});
      })
      .catch(() => {
        toaster.negative("Greška se dogodila prilikom dodavanja titla", {});
      });
  }

  const OnEdit = (language: string, link: string, subtitle_id: number) => {
    Api.EditSubtitle(language, link, subtitle_id)
      .then(() => {
        refetch();
        toaster.positive(`Uspešno izmenjen titl za ${language} jezik`, {});
      })
      .catch(() => {
        toaster.negative("Greška se dogodila prilikom izmenjivanja titla", {});
      });
  }

  const OnDelete = (subtitle_id: number) => {
    Api.DeleteSubtitle(subtitle_id)
      .then(() => {
        refetch();
        toaster.positive(`Uspešno obrisan titl br. ${subtitle_id}`, {});
      })
      .catch(() => {
        toaster.negative("Greška se dogodila prilikom brisanja titla", {});
      });
  }

  if (auth.user === undefined)
    return null;

  if (isError)
    return (<Bold>Greška se dogodila prilikom učitavanja liste titlova.</Bold>);

  if (!subtitles)
    return (<StyledSpinnerNext $size="small" />);

  const is_staff = Helpers.IsUserStaff(auth.user);
  return (
    <>
      {(subtitles && subtitles.length !== 0) ? (
        <Container>
          {subtitles.map((subtitle) => (
            <Wrapper key={`subtitle-${subtitle.id}`}>
              <CenterVertically>
                <StyledLink
                  rel="noopener noreferrer"
                  href={subtitle.url}
                  target="_blank"
                >
                  {subtitle.lang}: {subtitle.url}
                </StyledLink>
                {is_staff ? (
                  <ActionWrapper
                    onClick={() => {
                      setAction("edit");
                      setActionSubtitle(subtitle);
                    }}
                  >
                    <PencilIcon size={14} />
                  </ActionWrapper>
                ) : null}
                {is_staff ? (
                  <ActionWrapper
                    onClick={() => {
                      setAction("delete");
                      setActionSubtitle(subtitle);
                    }}
                  >
                    <DeleteAlt size={18} />
                  </ActionWrapper>
                ) : null}
              </CenterVertically>
            </Wrapper>
          ))}
        </Container>
      ) : null}
      <Button
        size="mini"
        kind="tertiary"
        onClick={() => setAction("add")}
        startEnhancer={() => <Plus />}
      >
        Dodajte titl
      </Button>
      <ModalDialog
        action={action}
        subtitle={action_subtitle}
        onAdd={OnAdd}
        onEdit={OnEdit}
        onDelete={OnDelete}
        onClose={OnClose}
      />
    </>
  );
}
