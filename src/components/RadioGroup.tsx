import React from "react";

import { styled } from "baseui";
import { Block } from "baseui/block";
import { LabelMedium, LabelSmall } from "baseui/typography";

import { FormatShoutboxBBcode } from "../helpers";

interface RadioButtonStyleProps {
  $checked?: boolean;
  $disabled?: boolean;
}

const RadioButtonStyle = styled<RadioButtonStyleProps, "div">(
  "div",
  ({ $theme, $checked, $disabled }) => ({
    position: "relative",
    marginTop: $theme.sizing.scale200,
    marginBottom: $theme.sizing.scale200,
    borderStyle: "solid",
    borderColor: $checked ? $theme.colors.accent : $theme.colors.borderOpaque,
    borderWidth: $theme.sizing.scale0,
    cursor: $disabled ? "not-allowed" : "pointer",
    transitionDuration: $theme.animation.timing200,
    transitionTimingFunction: $theme.animation.easeOutCurve
  })
);

const RadioButtonFill = styled("div", ({ $theme }) => ({
  display: "flex",
  alignItems: "center",
  position: "relative",
  userSelect: "none",
  paddingTop: $theme.sizing.scale500,
  paddingRight: $theme.sizing.scale600,
  paddingBottom: $theme.sizing.scale500,
  paddingLeft: $theme.sizing.scale600
}));

const RadioButtonLeft = styled("div", {
  display: "flex",
  flex: 1,
  flexFlow: "column wrap"
});

const RadioMarkInner = styled<RadioButtonStyleProps, "div">(
  "div",
  ({ $theme, $checked }) => ({
    backgroundColor: $checked ? $theme.colors.accent : "transparent",
    borderTopLeftRadius: "50%",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
    borderBottomLeftRadius: "50%",
    height: $checked ? $theme.sizing.scale200 : $theme.sizing.scale550,
    transitionDuration: $theme.animation.timing200,
    transitionTimingFunction: $theme.animation.easeOutCurve,
    width: $checked ? $theme.sizing.scale200 : $theme.sizing.scale550
  })
);

const RadioMarkOuter = styled<RadioButtonStyleProps, "div">(
  "div",
  ({ $theme, $checked }) => ({
    alignItems: "center",
    backgroundColor: "transparent",
    borderTopLeftRadius: "50%",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
    borderBottomLeftRadius: "50%",
    boxShadow: $checked ? `0 0 0 3px ${$theme.colors.accent}` : "none",
    display: "flex",
    height: $theme.sizing.scale700,
    justifyContent: "center",
    marginTop: $theme.sizing.scale0,
    marginRight: $theme.sizing.scale0,
    marginBottom: $theme.sizing.scale0,
    marginLeft: $theme.sizing.scale0,
    outline: "none",
    verticalAlign: "middle",
    width: $theme.sizing.scale700,
    flexShrink: 0,
    transitionDuration: $theme.animation.timing200,
    transitionTimingFunction: $theme.animation.easeOutCurve
  })
);

const RadioButtonOverlay = styled<{ $fill: number }, "div">(
  "div",
  ({ $fill }) => ({
    position: "absolute",
    width: `${$fill}%`,
    left: 0, top: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 155, 255, 0.2)"
  })
);

interface RadioButtonProps {
  id: number;
  title: React.ReactNode;
  description?: string;
  voted?: boolean;
  votes: number;
  totalVotes: number;
  checked: boolean;
  disabled?: boolean;
  onSelect: (id: number) => void;
}

const RadioButton = ({
  id,
  title,
  description,
  voted,
  votes,
  totalVotes,
  checked,
  disabled,
  onSelect
}: RadioButtonProps) => {
  const OnClick = (
    (!disabled && onSelect !== undefined) ?
    () => onSelect(id) :
    undefined
  );

  const percentage = Math.floor((votes * 100) / totalVotes);
  return (
    <RadioButtonStyle
      $checked={checked}
      $disabled={disabled}
      onClick={OnClick}
    >
      {voted ? (
        <RadioButtonOverlay $fill={percentage} />
      ) : null}
      <RadioButtonFill>
        <RadioButtonLeft>
          <LabelMedium display="flex" alignItems="center">
            {title}
          </LabelMedium>
          {description !== undefined ? (
            <LabelSmall>{description}</LabelSmall>
          ) : null}
        </RadioButtonLeft>
        {voted ? (
          <Block display="flex" flexDirection="column" alignItems="center">
            <LabelSmall
              overrides={{ Block: { style: { fontWeight: "bold" } } }}
            >
              {percentage}%
            </LabelSmall>
            <LabelSmall>
              ({votes}/{totalVotes})
            </LabelSmall>
          </Block>
        ) : (
          <RadioMarkOuter
            $checked={checked}
            $disabled={disabled}
          >
            <RadioMarkInner
              $checked={checked}
              $disabled={disabled}
            />
          </RadioMarkOuter>
        )}
      </RadioButtonFill>
    </RadioButtonStyle>
  );
}

interface RadioGroupProps {
  choices: Array<PollChoicesDTO>;
  selection: number;
  setSelection: (new_selection: number) => void;
  voted?: boolean;
  disabled?: boolean;
}

export const RadioGroup = ({
  selection,
  setSelection,
  voted,
  choices
}: RadioGroupProps) => {
  let total_votes = 1;
  choices.forEach((choice) => total_votes += choice.value);

  return (
    <>
      {choices.map((choice) => (
        <RadioButton
          key={choice.option}
          id={choice.option}
          title={choice.name ? FormatShoutboxBBcode(choice.name) : "Nice try, BIA"}
          description={(voted && selection === choice.option) ? "Hvala vam što ste glasali." : undefined}
          voted={voted}
          disabled={voted}
          votes={choice.value}
          totalVotes={total_votes}
          checked={selection === choice.option}
          onSelect={setSelection}
        />
      ))}
    </>
  );
}