import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

import { Show } from "baseui/icon";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { Textarea } from "baseui/textarea";
import { StyledSpinnerNext } from "baseui/spinner";

import { BBCodeToolkit } from "../BBCodeToolkit";
import { CenteredLayout } from "../ContentWrapper";
import { SendIcon, PencilIcon } from "../icons";

import { RootStateType } from "../../reducers";
import { DraftContext } from "../../app/DraftContext";

import { CommentTextWrapper } from "./CommentComponent";

import * as Api from "../../api";
import * as Actions from "../../actions";
import * as Helpers from "../../helpers";

interface InputProps {
  id: number;
  type: CommentInputType;
  defaultText?: string;
  // Used in:
  // "new-topic" -> as subject
  // "pm" -> as receiver username
  additionalField?: string;
  onSubmit: () => void;
}

const RemoveKeyFromObject = (key: number, object: Record<number, string>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: remove, ...rest } = object;
  return rest;
}

const GetSubmissionEndpoint = (
  type: CommentInputType,
  id: number,
  value: string,
  additionalField?: string
) => {
  switch (type) {
    case "support-user":
      return Api.SubmitStaffQuestion(value);
    case "support-staff":
      return Api.SubmitStaffAnswer(id, value);
    case "forum":
      return Api.ReplyToForumTopic(id, value);
    case "forum-edit":
      return Api.EditForumPost(id, value);
    case "request":
      return Api.SendRequestComment(id, value);
    case "request-edit":
      return Api.EditRequestComment(id, value);
    case "new-topic":
      if (additionalField !== undefined)
        return Api.NewForumTopic(id, additionalField, value);
      return null;
    case "torrent":
      return Api.ReplyToTorrent(id, value);
    case "torrent-edit":
      return Api.EditTorrentComment(id, value);
    case "pm":
      if (additionalField !== undefined)
        return Api.SendPrivateMessageByUsername(additionalField, value);
      return Api.SendPrivateMessage(id, value);
    default:
      return null;
  }
}

const _CommentInputComponent = (
  { id, additionalField, defaultText, type, onSubmit }: InputProps
) => {
  const forum = useSelector((state: RootStateType) => state.forum);
  
  const input_ref = useRef<HTMLTextAreaElement | null>(null);
  const [is_loading, setIsLoading] = useState(false);
  const [is_in_preview, setIsInPreview] = useState(false);
  const [value, setValue] = useState(
    defaultText !== undefined ? defaultText : ""
  );

  const QuoteEffect = useCallback(
    () => {
      if (!forum.content)
        return;

      const prefix = (!value || value.length === 0) ? "" : (value + "\n\n");
      setValue(prefix + forum.content);

      // Clear state
      Actions.QuoteForumPost("");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [forum]
  );

  // Load draft for this comment if it:
  // - exists in localStorage
  // - we're on ForumTopicPage
  // - TextArea is empty
  useEffect(
    () => {
      if (type === "forum" && value === "") {
        const draft = DraftContext.get()[id];
        if (draft !== undefined)
          setValue(draft);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(QuoteEffect, [QuoteEffect]);

  const OnTextAreaChange = useCallback(
    (event) => {
      setValue(event.currentTarget.value);

      if (type === "forum") {
        // Remove empty drafts from storage
        if (event.currentTarget.value === "") {
          DraftContext.set((state) => RemoveKeyFromObject(id, state));
        } else {
          DraftContext.set((state) => ({
            ...state,
            [id]: event.currentTarget.value
          }));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const OnPreviewToggle = useCallback(
    () => setIsInPreview((state) => !state),
    []
  );

  const OnSubmitCallback = useCallback(
    (id: number, promise: Promise<ResponseObject>) => {
      promise
        .then(() => {
          setValue("");
          setIsLoading(false);
          setIsInPreview(false);

          // Call parent refresh function
          onSubmit();

          // Reset default draft value
          DraftContext.set((state) => RemoveKeyFromObject(id, state));
        })
        .catch(() => {
          setIsLoading(false);
          toaster.negative(`Nepoznata greška se dogodila prilikom slanja vaše poruke.`, {});
        });
    },
    [onSubmit]
  );

  const OnSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (value.length < 2)
        return toaster.warning("Poruka mora biti duža od jednog karaktera!", {});

      if (type === "pm" && additionalField !== undefined) {
        if (additionalField.length < 3)
          return toaster.negative("Korisničko ime mora sadržati više od 2 karaktera!", {});
      } else {
        if (id === 0)
          return toaster.negative("Slanje poruke nije moguće!", {});
      }

      setIsLoading(true);

      const endpoint = GetSubmissionEndpoint(type, id, value, additionalField);
      if (!endpoint) {
        setIsLoading(false);
        return toaster.negative("Pogešno uvezana ulazna komponenta!", {});
      }

      OnSubmitCallback(id, endpoint);
    },
    [value, type, additionalField, id, OnSubmitCallback]
  );

  return (
    <>
      {is_loading ? (
        <CenteredLayout>
          <StyledSpinnerNext />
        </CenteredLayout>
      ) : (
        <>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  paddingTop: $theme.sizing.scale200,
                  paddingRight: $theme.sizing.scale200,
                  paddingBottom: $theme.sizing.scale200,
                  paddingLeft: $theme.sizing.scale200,
                  ...$theme.borders.border300
                })
              }
            }}
          >
            {!is_in_preview ? (
              <>
                {input_ref ? (
                  <BBCodeToolkit
                    input_ref={input_ref}
                    SetValue={setValue}
                  />
                ) : null}
                <Textarea
                  clearable
                  placeholder="Unesite vašu poruku..."
                  value={value}
                  onChange={OnTextAreaChange}
                  inputRef={input_ref}
                  overrides={{
                    Input: { style: { minHeight: "350px", resize: "vertical" } }
                  }}
                />
              </>
            ) : (
              <CommentTextWrapper marginTop>
                {Helpers.FormatBBcode(value)}
              </CommentTextWrapper>
            )}
          </Block>
          <br />
          <form onSubmit={OnSubmit}>
            <Button
              type="submit"
              size="compact"
              startEnhancer={() => <SendIcon inverse />}
              overrides={{
                BaseButton: { style: { width: "50%" } }
              }}
            >
              Pošaljite poruku
            </Button>
            <Button
              type="button"
              kind="secondary"
              size="compact"
              disabled={value === ""}
              startEnhancer={() => (
                <>{is_in_preview ? <PencilIcon /> : <Show />}</>
              )}
              overrides={{
                BaseButton: { style: { width: "50%" } }
              }}
              onClick={OnPreviewToggle}
            >
              {is_in_preview ? "Nazad na pisanje" : "Pregled"}
            </Button>
          </form>
        </>
      )}
    </>
  );
};

export const CommentInputComponent = React.memo(_CommentInputComponent);