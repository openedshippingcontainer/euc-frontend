import React, { useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

import { styled } from "baseui";
import { Input } from "baseui/input";
import { toaster } from "baseui/toast";
import { StatefulMenu } from "baseui/menu";
import { StatefulPopover } from "baseui/popover";
import { StatefulTooltip } from "baseui/tooltip";
import { StyledSpinnerNext } from "baseui/spinner";

import * as Actions from "../actions";
import * as Helpers from "../helpers";

import { LinkAnchor } from "./LinkAnchor";
import { EmojiPicker } from "./EmojiPicker";
import { ElevatedPanel } from "./ElevatedPanel";
import { PencilIcon, DropdownMenuIcon } from "./icons";

import { RootStateType } from "../reducers";

const ShoutboxEntry = styled("li", {
  borderStyle: "none",
  marginTop: "1px",
  marginBottom: "1px"
});

const ShoutboxWrapper = styled("div", {
  overflow: "auto"
});

const InputWrapper = styled("div", {
  marginTop: "auto"
});

const UpdatingContainer = styled("div", ({ $theme }) => ({
  display: "flex",
  alignItems: "center",
  paddingRight: $theme.sizing.scale500
}));

// In production update shoutbox every 10s
// In development update shoutbox every 30s
const SHOUTBOX_UPDATE_INTERVAL = (
  (process.env.NODE_ENV === "production") ? 10000 : 30000
);

const IsMessageValid = (message: string) => (message && message.length >= 2 && message.length <= 255);

const DropdownWrapper = styled("span", ({ $theme }) => ({
  cursor: "pointer",
  paddingTop: 0,
  paddingRight: $theme.sizing.scale100,
  paddingBottom: 0,
  paddingLeft: $theme.sizing.scale100,
  backgroundColor: $theme.colors.buttonTertiaryFill,
  ":hover": { backgroundColor: $theme.colors.buttonTertiaryHover }
}));

export const Shoutbox = () => {
  const history = useHistory();
  const input_ref = useRef<HTMLInputElement | null>(null);

  const auth = useSelector((state: RootStateType) => state.auth);
  const shoutbox = useSelector((state: RootStateType) => state.shoutbox);

  const OnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input_ref || !input_ref.current)
      return toaster.negative("Nepravilno inicijalizovana ulazna komponenta!", {});

    const message = input_ref.current.value;
    if (!IsMessageValid(message))
      return toaster.warning("Poruka mora biti duža od jednog karaktera, a kraća od 256 karaktera.", {});

    Actions.SendShout(message, () => {
      if (input_ref && input_ref.current)
        input_ref.current.value = "";
    });
  };

  const OnEmojiPick = (emoji: string) => {
    if (!input_ref || !input_ref.current)
      return;

    const space = (input_ref.current.value !== "" ? " " : "");
    input_ref.current.value += space + emoji;
  };

  const GetMenuItems = (shout: ShoutboxDTO) => ([
    {
      label: "Pošalji poruku",
      callback: () => history.push(`/pm/out/?compose=${shout.name}`)
    },
    {
      label: "Izbriši",
      callback: () => Actions.RemoveShout(shout.id)
    }
  ]);
  
  useEffect(
    () => {
      // Optimization:
      // If we have shouts in our Redux container, then just update the delta
      // If we don't, then fetch all shouts
      if (shoutbox.shouts && shoutbox.shouts.length !== 0) {
        Actions.FetchShoutsDelta();
      } else {
        Actions.FetchShouts();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  Helpers.useInterval(
    () => Actions.FetchShoutsDelta(),
    SHOUTBOX_UPDATE_INTERVAL
  );

  const InputAfter = () => (
    <>
      {shoutbox.is_updating ? (
        <UpdatingContainer>
          <StyledSpinnerNext $size="small" />
        </UpdatingContainer>
      ) : null}
    </>
  );

  const is_staff = Helpers.IsUserStaff(auth.user);
  return (
    <ElevatedPanel
      $style={{
        height: "30vw",
        minHeight: "400px",
        maxHeight: "550px"
      }}
    >
      {(shoutbox.shouts.length === 0) ? (
        <StyledSpinnerNext
          size="large"
          $style={{ 
            marginTop: "auto",
            marginRight: "auto",
            marginBottom: "auto",
            marginLeft: "auto"
           }}
        />
      ) : (
        <>
          <ShoutboxWrapper>
            {shoutbox.shouts.map((shout) => {
              const time = moment(shout.date);
              const href = Helpers.GetUserProfileByUsernameHref(shout.name);
              return (
                <ShoutboxEntry
                  key={`shout-${shout.id}`}
                >
                  {is_staff ? (
                    <StatefulPopover
                      triggerType="click"
                      placement="bottom"
                      content={({ close }) => (
                        <StatefulMenu
                          items={GetMenuItems(shout)}
                          onItemSelect={({ item }) => {
                            item.callback();
                            close();
                          }}
                        />
                      )}
                    >
                      <DropdownWrapper>
                        <DropdownMenuIcon />
                      </DropdownWrapper>
                    </StatefulPopover>
                  ) : null}
                  <StatefulTooltip content={time.format("LLLL")}>
                    <small>{time.fromNow()}</small>
                  </StatefulTooltip>
                  {' '}
                  <Link
                    to={href}
                    component={LinkAnchor}
                    // This prop will get passed down to LinkAnchor
                    // which makes use of it. Don't listen to TypeScript.
                    // @ts-ignore
                    $style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      textDecoration: "none"
                    }}
                  >
                    {shout.name}
                  </Link>
                  {': '}{Helpers.FormatShoutboxBBcode(shout.message)}
                </ShoutboxEntry>
              );
            })}
          </ShoutboxWrapper>
          <InputWrapper>
            <form onSubmit={OnSubmit}>
              <br />
              <Input
                clearable
                size="compact"
                placeholder="Unesite vašu poruku..."
                inputRef={input_ref}
                startEnhancer={() => <PencilIcon />}
                endEnhancer={() => (
                  <EmojiPicker
                    OnEmojiPick={OnEmojiPick}
                  />
                )}
                overrides={{ After: InputAfter }}
              />
            </form>
          </InputWrapper>
        </>
      )}
    </ElevatedPanel>
  );
}