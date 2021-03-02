import React, { useState } from "react";

import { styled } from "baseui";

const PreviewImage = styled("div", {
  display: "flex",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundColor: "#000",
  cursor: "pointer"
});

const PlayButton = styled("div", {
  cursor: "pointer",
  position: "relative",
  height: "60px",
  width: "100px",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: "5px",
  ":hover": {
    backgroundColor: "rgba(0, 0, 0, 0.9)"
  },
  ":after": {
    display: "block",
    position: "absolute",
    top: "16.5px",
    left: "40px",
    content: `""`,
    marginTop: 0,
    marginRight: "auto",
    marginBottom: 0,
    marginLeft: "auto",
    borderStyle: "solid",
    borderWidth: "12.5px 0 12.5px 20px",
    borderColor: "transparent transparent transparent rgba(255, 255, 255, 1)"
  }
});

interface Props {
  video_id: string;
  width?: string;
  height?: string;
}

// Copy-pasted from https://github.com/ahakem/react-lazyload-youtube
export const YouTubePlayer = (
  { video_id, width, height }: Props
) => {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <React.Fragment>
      {showVideo ? (
        <iframe
          width={width || "100%"}
          height={height || "400px"}
          src={`https://www.youtube.com/embed/${video_id}?autoplay=1&showinfo=0`}
          frameBorder="0"
          allowFullScreen
        />
      ) : (
        <PreviewImage
          $style={{
            backgroundImage: `url(${`https://img.youtube.com/vi/${video_id}/hqdefault.jpg`})`,
            width: width,
            height: height
          }}
          onClick={() => setShowVideo(true)}
        >
          <PlayButton />
        </PreviewImage>
      )}
    </React.Fragment>
  )
}