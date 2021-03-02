import React from "react";
import { Avatar } from "baseui/avatar";
import { LabelMedium, ParagraphSmall } from "baseui/typography";

import {
  StyledUserProfileTileContainer,
  StyledUserProfilePictureContainer,
  StyledUserProfileInfoContainer,
} from "./NavBarStyle";

export default function UserProfileTile({
  username,
  usernameSubtitle,
  userImgUrl
}: UserMenuProps) {
  return (
    // Replace with a profile tile renderer: renderUserProfileTile()
    <StyledUserProfileTileContainer>
      <StyledUserProfilePictureContainer>
        <Avatar name={username || ""} src={userImgUrl} size="48px" />
      </StyledUserProfilePictureContainer>
      <StyledUserProfileInfoContainer>
        <LabelMedium
          overrides={{
            Block: { style: { fontWeight: "bold" } }
          }}
        >
          {username}
        </LabelMedium>
        {usernameSubtitle ? (
          <ParagraphSmall marginTop="0" marginBottom="0">
            {usernameSubtitle}
          </ParagraphSmall>
        ) : null}
      </StyledUserProfileInfoContainer>
    </StyledUserProfileTileContainer>
  );
}
