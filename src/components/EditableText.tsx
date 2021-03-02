import React, { useState, useEffect, useRef } from "react";

import { styled } from "baseui";
import { Input } from "baseui/input";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { Textarea } from "baseui/textarea";
import { Check, DeleteAlt } from "baseui/icon";

import { PencilIcon, ResetIcon } from "./icons";
import { ConfirmActionModal } from "./ConfirmActionModal";

interface EditableTextProps {
  initialValue: string;
  onSet: (new_value: string) => void;
  canEdit: boolean;
  multiLine?: boolean;
  children: any;
}

const MOUSE_ENTER_DELAY = 10;
const MOUSE_LEAVE_DELAY = 10;

const ChildWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  flex: 1,
  cursor: "pointer"
})

export const EditableText = ({
  initialValue,
  onSet,
  canEdit,
  multiLine,
  children
}: EditableTextProps) => {
  const top_ref = useRef<HTMLDivElement | null>(null);

  const [value, setValue] = useState("");
  const [is_hovered, setIsHovered] = useState(false);
  const [is_focused, setIsFocused] = useState(false);
  const [should_apply, setShouldApply] = useState(false);

  let mouse_enter_timer: NodeJS.Timeout;
  let mouse_leave_timer: NodeJS.Timeout;

  const OnMouseEnter = () => {
    clearTimeout(mouse_leave_timer);
    mouse_enter_timer = setTimeout(
      () => setIsHovered(true),
      MOUSE_ENTER_DELAY
    );
  }

  const OnMouseLeave = () => {
    clearTimeout(mouse_enter_timer);
    mouse_leave_timer = setTimeout(() => setIsHovered(false),
      MOUSE_LEAVE_DELAY
    );
  }

  const OnApplyChanges = () => {
    if (value.trim() === "") {
      toaster.negative("Vrednost polja ne sme biti prazna!", {});
      return;
    }

    setIsFocused(false);
    setShouldApply(false);

    onSet(value);
  }

  useEffect(() => setValue(initialValue), [initialValue]);
  useEffect(
    () => {
      // Scroll to top of the element, when the element gets focused
      if (is_focused)
        top_ref.current?.scrollIntoView({ block: "center" });
    },
    [is_focused]
  );

  // Draw only original component, if this text can't be edited
  if (!canEdit)
    return children;

  return (
    <Block
      ref={top_ref}
      display="flex"
      width="100%"
      flexWrap={multiLine}
      marginBottom={(!multiLine && is_focused) ? "scale200" : undefined}
    >
      {!is_focused ? (
        <ChildWrapper
          onClick={() => {
            setIsFocused(true);
            setIsHovered(false);
          }}
          onMouseEnter={OnMouseEnter}
          onMouseLeave={OnMouseLeave}
        >
          {children}
          {is_hovered ? (
            <Block display="flex" marginLeft="scale300">
              <PencilIcon />
            </Block>
          ) : null}
        </ChildWrapper>
      ) : (
        <>
          {multiLine ? (
            <Textarea
              autoFocus
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              overrides={{
                Input: { style: { minHeight: "200px", resize: "vertical" } }
              }}
            />
          ) : (
            <Input
              autoFocus
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
          )}
          <Block
            display="flex"
            width={multiLine ? "100%" : undefined}
            marginTop={multiLine ? "scale100" : undefined}
          >
            <Button
              type="button"
              kind="secondary"
              size="compact"
              onClick={() => setShouldApply(true)}
              startEnhancer={() => <Check />}
              overrides={{ BaseButton: { style: { flex: multiLine ? 1 : 0 } } }}
            >
             Primeni
            </Button>
            <Button
              type="button"
              kind="tertiary"
              size="compact"
              onClick={() => {
                setIsFocused(false);
                setValue(initialValue);
              }}
              startEnhancer={() => <DeleteAlt />}
              overrides={{
                BaseButton: {
                  style: ({ $theme }) => ({
                    flex: multiLine ? 1 : 0,
                    color: $theme.colors.white,
                    backgroundColor: $theme.colors.negative600,
                    ":hover": {
                      backgroundColor: $theme.colors.negative400,
                    }
                  })
                }
              }}
            >
              Poništi
            </Button>
            {value !== initialValue ? (
              <Button
                type="button"
                kind="tertiary"
                size="compact"
                onClick={() => setValue(initialValue)}
                startEnhancer={() => <ResetIcon />}
                overrides={{ BaseButton: { style: { flex: multiLine ? 1 : 0 } } }}
              >
                Resetuj
              </Button>
            ) : null}
            <ConfirmActionModal
              title="Izmeni ovo polje"
              isOpen={should_apply}
              onConfirm={OnApplyChanges}
              onClose={() => setShouldApply(false)}
            />
          </Block>
        </>
      )}
    </Block>
  );
}