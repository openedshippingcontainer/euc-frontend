
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { styled } from "baseui";
import { Block } from "baseui/block";
import { LabelLarge, ParagraphXSmall } from "baseui/typography";

import { LinkAnchor } from "./LinkAnchor";
import { HorizontalRule } from "./HorizontalRule";
import { QuoteComponent } from "./QuoteComponent";
import {
  Comment,
  CommentAction,
  CommentBody,
  CommentHeader,
  CommentTextWrapper
} from "./comment";
import { CenteredLayout } from "./ContentWrapper";

import { DraftContext } from "../app/DraftContext";
import { ConfirmActionModal } from "./ConfirmActionModal";

import * as Helpers from "../helpers";

const Title = styled("h3", {
  marginTop: 0,
  marginBottom: 0
});

export const DraftListComponent = () => {
  const [drafts, setDrafts] = DraftContext.use();
  const [remove_draft_id, setRemoveDraftId] = useState(-1);

  const OnRemove = () => {
    setDrafts((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [remove_draft_id]: remove, ...rest } = state;
      return rest;
    });

    setRemoveDraftId(-1);
  }

  return (
    <Block marginTop="scale300">
      {Object.entries(drafts).length !== 0 ? (
        <>
          <Title>Nacrti na ovom uređaju:</Title>
          {Object.entries(drafts).map(([key, content]) => (
            <React.Fragment key={key}>
              <Comment>
                <CommentBody>
                  <CommentHeader>
                    <Link
                      to={`/forum/topic/${key}`}
                      component={LinkAnchor}
                    >
                      Tema #{key}
                    </Link>
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
                      <CommentAction onClick={() => window.prompt(
                        `Kopiraj sadržaj ovog nacrta: Ctrl+C, Enter`,
                        content
                      )}>
                        Kopiraj
                      </CommentAction>
                      <ConfirmActionModal
                        title="Obriši poruku"
                        isOpen={remove_draft_id !== -1}
                        onConfirm={OnRemove}
                        onClose={() => setRemoveDraftId(-1)}
                      />
                      <CommentAction
                        $staff
                        $style={{ color: "#f31726" }}
                        onClick={() => setRemoveDraftId(+key)}
                      >
                        Obriši
                      </CommentAction>
                    </ParagraphXSmall>
                  </CommentHeader>
                  <CommentTextWrapper>
                    <QuoteComponent>
                      {Helpers.FormatBBcode(content)}
                    </QuoteComponent>
                  </CommentTextWrapper>
                </CommentBody>
              </Comment>
              <HorizontalRule />
            </React.Fragment>
          ))}
        </>
      ) : (
        <CenteredLayout>
          <LabelLarge>Nema dostupnih nacrta na ovom uređaju.</LabelLarge>
        </CenteredLayout>
      )}
    </Block>
  );
}