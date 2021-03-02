import React, { useEffect, useState } from "react";

import { withStyle } from "baseui";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from "baseui/modal";
import { Show } from "baseui/icon";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { Textarea } from "baseui/textarea";
import { LabelMedium } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { StatefulTooltip } from "baseui/tooltip";

import {
  LinkIcon,
  ImageIcon,
  VideoIcon,
  CodeTagsIcon,
  TextCenterIcon,
  OrderedListIcon,
  UnorderedListIcon,
  TextAlignRightIcon,
  HorizontalLineIcon
} from "./icons";
import { EmojiPicker } from "./EmojiPicker";
import { CenteredLayout } from "./ContentWrapper";
import { HorizontalRule } from "./HorizontalRule";
import { RawDescriptionContainer } from "./RawDescriptionContainer";

import * as Helpers from "../helpers";

interface BBCodeInfo {
  // Should this tag include a header field?
  hasHeader?: boolean;
  // This is the default header value
  header?: string;
  // This is the replacement title for the header label
  headerLabel?: string;
  // This is the default content value (unless selectedContent is non-empty)
  content?: string;
  // This is the replacement title for the content label
  contentLabel?: string;
}

const BBcodeTagInfo: Record<string, BBCodeInfo> = {
  "b": { contentLabel: "Tekst" },
  "i": { contentLabel: "Tekst" },
  "u": { contentLabel: "Tekst" },
  "s": { contentLabel: "Tekst" },
  "size": {
    hasHeader: true,
    header: "5",
    headerLabel: "Veličina fonta (od 1 do 7; 2 je normalna veličina)",
    contentLabel: "Tekst"
  },
  "img": { contentLabel: "URL" },
  "url": {
    hasHeader: true,
    headerLabel: "URL",
    contentLabel: "Naslov"
  },
  "video": { contentLabel: "URL" },
  "ul": { content: "* Jedan\n* Dva\n* Tri" },
  "ol": { content: "* Prva\n* Druga\n* Treća" },
  "center": { contentLabel: "Tekst" },
  "right": { contentLabel: "Tekst" },
  "spoiler": {
    hasHeader: true,
    headerLabel: "Opis (naslov)"
  },
  "code": {},
  "hr": {},
  "font": {
    hasHeader: true,
    header: "Arial",
    headerLabel: "Font",
    contentLabel: "Tekst"
  }
};

const Wrapper = withStyle(CenteredLayout, ({ $theme }: any) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: $theme.sizing.scale200
}));

type InputRefType = React.MutableRefObject<HTMLTextAreaElement | null>;

interface Props {
  input_ref: InputRefType;
  SetValue: (new_value: string) => void;
}

interface ModalDialogProps {
  tag: string;
  inputRef: InputRefType;
  selectedContent: string;
  onAddTag: (tag: string, header: string, content: string) => void;
  onClose: () => void;
}

const GetTag = (
  current: HTMLTextAreaElement,
  tag: string,
  header: string,
  content: string
) => {
  const title = (header !== "" ? `="${header}"` : "");
  if (current.selectionStart == current.selectionEnd) {
    const space = current.value !== "" ? " " : "";
    return (current.value + `${space}[${tag}${title}]${content}[/${tag}]`);
  }

  return (
    current.value.substring(0, current.selectionStart) +
    `[${tag}${title}]${content}[/${tag}]` +
    current.value.substring(current.selectionEnd)
  );
}

const ModalDialog = (
  { tag, inputRef, selectedContent, onAddTag, onClose }: ModalDialogProps
) => {
  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");

  useEffect(
    () => setContent(selectedContent),
    [selectedContent]
  );

  useEffect(
    () => {
      const info = BBcodeTagInfo[tag];
      if (info !== undefined) {
        if (info.content !== undefined && content === "")
          setContent(info.content);

        if (info.header !== undefined && header === "")
          setHeader(info.header);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tag]
  );

  const bbcode_info = BBcodeTagInfo[tag];
  if (bbcode_info === undefined)
    return null;

  const has_content = (tag !== "hr");
  const has_header = bbcode_info.hasHeader ?? false;
  return (
    <Modal
      animate
      autoFocus
      closeable
      unstable_ModalBackdropScroll
      role="dialog"
      isOpen={tag !== ""}
      onClose={onClose}
    >
      <ModalHeader>{`Dodajte novi "${tag}" element`}</ModalHeader>
      <ModalBody $style={{ marginBottom: 0 }}>
        {has_header ? (
          <FormControl
            label={() => (bbcode_info.headerLabel ?? "Zaglavlje")}
          >
            <Input
              required
              value={header}
              onChange={(event) => setHeader(event.currentTarget.value)}
            />
          </FormControl>
        ) : null}
        {has_content ? (
          <FormControl
            label={() => (bbcode_info.contentLabel ?? "Sadržaj")}
          >
            <Textarea
              clearable
              required
              value={content}
              onChange={(event) => setContent(event.currentTarget.value)}
              overrides={{
                Input: { style: { minHeight: "150px", resize: "vertical" } }
              }}
            />
          </FormControl>
        ) : null}
        {(inputRef.current && (
          (has_header && header !== "") ||
          (has_content && content !== "")
        )) ? (
          <>
            <HorizontalRule/>
            <LabelMedium>Kod:</LabelMedium>
            <RawDescriptionContainer>
              {GetTag(inputRef.current, tag, header, content)}
            </RawDescriptionContainer>
            <HorizontalRule/>
            <LabelMedium>Prikaz:</LabelMedium>
            {Helpers.FormatBBcode(GetTag(inputRef.current, tag, header, content))}
          </>
        ) : null}
      </ModalBody>
      <ModalFooter $style={{ marginTop: 0 }}>
        <ModalButton
          type="submit"
          kind="primary"
          onClick={() => {
            if ((has_header && header === "") || (has_content && content === ""))
              return toaster.negative("Sva polja moraju biti popunjena.", {});

            onAddTag(tag, header, content);
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

export const BBCodeToolkit = ({ input_ref, SetValue }: Props) => {
  const [current_tag, setCurrentTag] = useState("");
  const [selected_content, setSelectedContent] = useState("");

  const AddTag = (tag: string, header: string, content: string) => {
    if (!input_ref.current)
      return;

    SetValue(GetTag(input_ref.current, tag, header, content));
  }

  const SetTag = (tag: string) => {
    if (!input_ref.current)
      return;

    const selected = input_ref.current.value.substring(
      input_ref.current.selectionStart,
      input_ref.current.selectionEnd
    );

    setSelectedContent(selected);
    setCurrentTag(tag);
  }

  const OnEmojiPick = (emoji: string) => {
    if (!input_ref.current)
      return;

    const space = (input_ref.current.value !== "" ? " " : "");
    SetValue(input_ref.current.value + space + emoji);
  }

  return (
    <Wrapper>
      <StatefulTooltip
        content="Bold"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("b")}
          $style={{ fontWeight: "bold" }}
        >
          B
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Italik"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("i")}
          $style={{ fontStyle: "italic" }}
        >
          I
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Podvlaka"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("u")}
          $style={{ textDecoration: "underline" }}
        >
          U
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Precrtan tekst"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("s")}
          $style={{ textDecoration: "line-through" }}
        >
          S
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Veličina fonta"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("size")}
        >
          aA
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Slika"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("img")}
        >
          <ImageIcon />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Link"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("url")}
        >
          <LinkIcon />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Video klip"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("video")}
        >
          <VideoIcon />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Lista stavki"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("ul")}
        >
          <UnorderedListIcon />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Lista stavki po redosledu"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("ol")}
        >
          <OrderedListIcon />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Centriran tekst"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("center")}
        >
          <TextCenterIcon />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Tekst uvučen desno"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("right")}
        >
          <TextAlignRightIcon />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Spoiler"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("spoiler")}
        >
          <Show size={16} />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Kod"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("code")}
        >
          <CodeTagsIcon />
        </Button>
      </StatefulTooltip>
      <StatefulTooltip
        content="Horizontalna linija"
        placement="top"
      >
        <Button
          type="button"
          kind="tertiary"
          size="compact"
          onClick={() => SetTag("hr")}
        >
          <HorizontalLineIcon />
        </Button>
      </StatefulTooltip>
      <EmojiPicker OnEmojiPick={OnEmojiPick} />
      {(input_ref && input_ref.current && current_tag !== "") ? (
        <ModalDialog
          tag={current_tag}
          inputRef={input_ref}
          selectedContent={selected_content}
          onAddTag={AddTag}
          onClose={() => setCurrentTag("")}
        />
      ) : null}
    </Wrapper>
  );
}