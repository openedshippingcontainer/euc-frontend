import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import { styled, withStyle } from "baseui";
import { Block } from "baseui/block";
import { toaster } from "baseui/toast";
import { StatefulTooltip } from "baseui/tooltip";
import { ParagraphXSmall } from "baseui/typography";

import { UserTag } from "../UserTag";
import { HashTagIcon } from "../icons";
import { CenteredLayout } from "../ContentWrapper";
import { HorizontalRule } from "../HorizontalRule";
import { ConfirmActionModal } from "../ConfirmActionModal";

import {
  Comment,
  CommentBody,
  CommentHeader,
  CommentAction,
  CommentAvatarWrapper,
  CommentAvatar
} from "./CommentStyle";
import { CommentEditModal } from "./CommentEditModal";

import * as Api from "../../api";
import * as Actions from "../../actions";
import * as Helpers from "../../helpers";

const Italic = styled("span", {
  fontStyle: "italic"
});

const CommentLinkWrapper = withStyle(CenteredLayout, ({ $theme }: any) => ({
  width: "18px",
  height: "18px",
  cursor: "pointer",
  borderRadius: "50%",
  marginRight: $theme.sizing.scale0,
  backgroundColor: $theme.colors.backgroundSecondary,
  ":hover": {
    backgroundColor: $theme.colors.backgroundTertiary
  }
}));

interface CommentTextWrapperProps {
  marginTop?: boolean;
  children?: any;
}

export const CommentTextWrapper = (
  { marginTop, children }: CommentTextWrapperProps
) => (
  <Block
    overrides={{
      Block: {
        style: ({ $theme }) => ({
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          ...(marginTop ? { marginTop: $theme.sizing.scale200 } : {}),
          marginBottom: $theme.sizing.scale200,
          marginLeft: $theme.sizing.scale100
        })
      }
    }}
  >
    {children}
  </Block>
);

interface CommentProps {
  post: any;
  type: CommentInputType;
  isStaff: boolean;
  canEdit: boolean;
  onRefresh: () => void;
}

const GetRemoveEndpoint = (type: CommentInputType) => {
  switch (type) {
    case "forum": return Api.RemoveForumPost;
    case "torrent": return Api.RemoveTorrentComment;
    case "request": return Api.RemoveRequestComment;
    default: return null;
  }
}

export const CommentComponent = (
  { post, type, isStaff, canEdit, onRefresh }: CommentProps
) => {
  const [edit_content, setEditContent] = useState<string | null>(null);
  const [remove_post_id, setRemovePostId] = useState(-1);

  const OnRemove = () => {
    const endpoint = GetRemoveEndpoint(type);
    if (!endpoint)
      return toaster.negative("Pogešno uvezana ulazna komponenta!", {});

    endpoint(remove_post_id)
      .then(() => {
        setRemovePostId(-1);
        onRefresh();

        toaster.positive("Poruka izbrisana uspešno!", {});
      })
      .catch(() => {
        toaster.negative(`Greška se dogodila prilikom brisanja poruke`, {});
      });
  }

  const time = moment(post.added);
  return (
    <>
      <Comment id={post.id}>
        <CommentAvatarWrapper>
          <Link to={`/profile/id/${post.user.id}`}>
            <CommentAvatar
              src={Helpers.GetUserAvatarURL(post.user)}
              loading="lazy"
            />
          </Link>
        </CommentAvatarWrapper>
        <CommentBody>
          <CommentHeader>
            <CommentHeader>
              <StatefulTooltip
                content={`Kopiraj link do posta #${post.id}`}
              >
                <CommentLinkWrapper
                  onClick={() => {
                    const href = (
                      window.location.protocol + "//" +
                      window.location.host +
                      window.location.pathname
                    );
                    window.prompt(
                      `Kopiraj link do posta #${post.id}: Ctrl+C, Enter`,
                      `${href}#${post.id}`
                    );
                  }}
                >
                  <HashTagIcon />
                </CommentLinkWrapper>
              </StatefulTooltip>
              <UserTag user={post.user} />
              <StatefulTooltip
                content={time.format("LLLL")}
              >
                <ParagraphXSmall
                  overrides={{
                    Block: {
                      style: ({ $theme }) => ({
                        display: "inline-block",
                        marginTop: 0,
                        marginBottom: 0,
                        marginLeft: $theme.sizing.scale200
                      })
                    }
                  }}
                >
                  {time.fromNow()}
                </ParagraphXSmall>
              </StatefulTooltip>
            </CommentHeader>
            <ParagraphXSmall
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    display: "inline-flex",
                    marginTop: $theme.sizing.scale200,
                    marginBottom: $theme.sizing.scale200,
                    "@media screen and (max-width: 425px)": {
                      flexDirection: "column"
                    }
                  })
                }
              }}
            >
              <CommentAction
                onClick={() => Actions.QuoteForumPost(
                  `[quote="${post.user.username}"]${post.body}[/quote]`
                )}
              >
                Citiraj
              </CommentAction>
              {(isStaff || canEdit) ? (
                <>
                  {(edit_content !== null) ? (
                    <CommentEditModal
                      id={post.id}
                      type={type}
                      content={edit_content}
                      onClose={() => setEditContent(null)}
                      onRefresh={onRefresh}
                    />
                  ) : null}
                  <CommentAction
                    $staff
                    onClick={() => setEditContent(post.body)}
                  >
                    Izmeni
                  </CommentAction>
                </>
              ) : null}
              {isStaff ? (
                <>
                  <ConfirmActionModal
                    title="Obriši poruku"
                    isOpen={remove_post_id !== -1}
                    onConfirm={OnRemove}
                    onClose={() => setRemovePostId(-1)}
                  />
                  <CommentAction
                    $staff
                    $style={{ color: "#f31726" }}
                    onClick={() => setRemovePostId(post.id)}
                  >
                    Obriši
                  </CommentAction>
                </>
              ) : null}
            </ParagraphXSmall>
          </CommentHeader>
          <CommentTextWrapper>
            {Helpers.FormatBBcode(post.body)}
          </CommentTextWrapper>
          {post.editedAt ? (
            <StatefulTooltip
              content={moment(post.editedAt).format("LLLL")}
            >
              <ParagraphXSmall
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      display: "inline",
                      marginTop: $theme.sizing.scale200,
                      marginBottom: $theme.sizing.scale200
                    })
                  }
                }}
              >
                <Italic>Poslednji put izmenjeno {moment(post.editedAt).fromNow()}</Italic>
              </ParagraphXSmall>
            </StatefulTooltip>
          ) : null}
        </CommentBody>
      </Comment>
      <HorizontalRule />
    </>
  );
}