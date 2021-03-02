import React, { useState } from "react";

import { styled } from "baseui";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { StatefulTooltip } from "baseui/tooltip";
import { StatefulPopover } from "baseui/popover";

import { EmojiIcon } from "./icons";
import * as Helpers from "../helpers";

const ListComponent = styled("div", ({ $theme }) => ({
  marginTop: $theme.sizing.scale400,
  marginRight: $theme.sizing.scale400,
  marginBottom: $theme.sizing.scale400,
  marginLeft: $theme.sizing.scale400,
  width: "25vw",
  minWidth: "350px",
  height: "30vw",
  minHeight: "300px",
  overflowY: "scroll",
  scrollbarColor: `${$theme.colors.backgroundSecondary} ${$theme.colors.backgroundTertiary}`
}));

const ListItem = styled("img", ({ $theme }) => ({
  cursor: "pointer",
  paddingTop: $theme.sizing.scale100,
  paddingRight: $theme.sizing.scale300,
  paddingBottom: $theme.sizing.scale100,
  paddingLeft: $theme.sizing.scale300,
  borderRadius: $theme.borders.radius200,
  ":hover": {
    backgroundColor: $theme.colors.backgroundSecondary
  }
}));

const ListSearchWrapper = styled("div", ({ $theme }) => ({
  marginBottom: $theme.sizing.scale400
}));

interface Props {
  OnEmojiPick: (name: string) => void;
}

export const EmojiPicker = ({ OnEmojiPick }: Props) => {
  const [search_query, setSearchQuery] = useState("");

  const OnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value);
  };

  const EmojiList = () => {
    const list = Object.keys(Helpers.Smilies).filter((smiley) => (
      (search_query === "" || smiley.includes(search_query))
    ));

    return (
      <>
        <ListSearchWrapper>
          <Input
            clearable
            onChange={OnChange}
            placeholder="Pretražite listu smajlija..."
          />
        </ListSearchWrapper>
        <ListComponent>
          {list.map((smiley) => (
            <StatefulTooltip
              key={smiley}
              content={smiley}
            >
              <ListItem
                loading="lazy"
                src={Helpers.GetSmileyURL(smiley)}
                onClick={() => OnEmojiPick(smiley)}
              />
            </StatefulTooltip>
          ))}
        </ListComponent>
      </>
    );
  };

  return (
    <StatefulPopover
      autoFocus
      returnFocus
      content={EmojiList}
    >
      <Button
        type="button"
        kind="tertiary"
        size="compact"
      >
        <EmojiIcon />
      </Button>
    </StatefulPopover>
  );
}