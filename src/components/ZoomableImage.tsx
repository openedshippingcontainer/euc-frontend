import React from "react";

import { styled, useStyletron } from "baseui";

import Zoom from "./image-zoom";
import { CenteredLayout } from "./ContentWrapper";

interface ZoomableImageProps {
  image: string;
  width?: string;
}

// If an image failed to load, set width to 150px
const OnImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  event.currentTarget.width = 150;
}

const Image = styled("img", {
  maxHeight: "100%",
  maxWidth: "100%",
  userSelect: "none"
});

export const ZoomableImage = ({
  image,
  width = "100%"
}: ZoomableImageProps) => {
  const [, theme] = useStyletron();
  return (
    <CenteredLayout>
      <Zoom
        overlayBgColorEnd={theme.colors.backgroundPrimary}
      >
        <Image
          id={`dyn-${Math.floor(Math.random() * 100000)}`}
          src={image}
          width={width}
          onError={OnImageError}
        />
      </Zoom>
    </CenteredLayout>
  );
}