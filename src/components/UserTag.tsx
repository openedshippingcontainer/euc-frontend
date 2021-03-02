import React from "react";
import { Link } from "react-router-dom";

import { styled } from "baseui";
import { Tag, KIND } from "baseui/tag";

import * as Helpers from "../helpers";

interface SettingsType {
  bold: boolean;
  kind: KIND[keyof KIND];
}

const GetUserSettings = (class_id: number): SettingsType => {
  switch (class_id) {
    // Beginner and Leecher and undefined
    case 0: case 1: case 2: default:
      return { bold: false, kind: "primary" };
    // Seeder/EUC Monster and Uploader/EUC Extreme
    case 3: case 4: return { bold: false, kind: "warning" };
    // EUC Monster and EUC SB Uploader/EUC Penzioner
    case 5: case 9: return { bold: true, kind: "brown" };
    // VIP, Torrent Master and Saradnik
    case 10: case 11: case 12:
      return { bold: true, kind: "purple" };
    // Moderator and Senior Moderator
    case 13: case 14:
      return { bold: true, kind: "accent" };
    // Administrator, Site admin, Arhiva and roBOT skripta
    case 15: case 16: case 28: case -1: case 17:
      return { bold: true, kind: "negative" };
  }
};

interface UserTagProps {
  user: UserDTO | UserType;
}

const Wrapper = styled("span", {
  cursor: "pointer",
  userSelect: "none"
});

export const UserTag = ({ user }: UserTagProps) => {
  const settings = GetUserSettings(user.clazz);
  return (
    <Link
      to={Helpers.GetUserProfileHref(user)}
      component={(props: LinkProps) => (
        <Wrapper
          onAuxClick={(event) => {
            if (event.button === 1) {
              event.preventDefault();
              window.open(props.href, "_blank");
            }
          }}
        >
          <Tag
            overrides={{
              Root: {
                style: ({ $theme }) => ({
                  marginTop: $theme.sizing.scale0,
                  marginRight: $theme.sizing.scale0,
                  marginBottom: $theme.sizing.scale0,
                  marginLeft: $theme.sizing.scale0,
                  lineHeight: $theme.sizing.scale700
                })
              },
              Text: {
                style: ({ $theme }) => ({
                  fontSize: $theme.sizing.scale550,
                  ...(settings.bold ? { fontWeight: "bold" } : {})
                })
              }
            }}
            kind={settings.kind}
            variant="solid"
            closeable={false}
            title={user.className}
            onClick={props.navigate}
          >
            {Helpers.GetUserUsername(user)}
          </Tag>
        </Wrapper>
      )}
    />
  );
};

interface UserMentionProps {
  username: string;
}

export const UserMention = ({ username }: UserMentionProps) => (
  <Link
    to={Helpers.GetUserProfileByUsernameHref(username)}
    component={(props: LinkProps) => (
      <Tag
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale0,
              marginRight: $theme.sizing.scale0,
              marginBottom: $theme.sizing.scale0,
              marginLeft: $theme.sizing.scale0,
              lineHeight: $theme.sizing.scale700
            })
          },
          Text: {
            style: ({ $theme }) => ({
              fontWeight: "bold",
              fontSize: $theme.sizing.scale550,
            })
          }
        }}
        kind="neutral"
        variant="light"
        closeable={false}
        title={username}
        onClick={props.navigate}
      >
        @{username}
      </Tag>
    )}
  />
);