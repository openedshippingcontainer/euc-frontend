import React from "react";

import { styled } from "baseui";
import { Delete } from "baseui/icon";
import { Button } from "baseui/button";
import { ListItem, ListItemLabel } from "baseui/list";

import { ZoomableImage } from "../ZoomableImage";
import { ClipboardIcon } from "../icons";

import * as Helpers from "../../helpers";
import { LabelMedium } from "baseui/typography";

const PreviewWrapper = styled("div", {
  display: "flex",
  width: "64px",
  height: "64px"
});

const FileName = styled("span", {
  cursor: "pointer",
  fontWeight: "bold",
});

// Copy-pasted from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
const GetSizeFromBytes = (bytes: number, decimals = 1): string => {
  if (!bytes)
    return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

interface ImageListItemProps {
  file: ImagePreviewFile;
  onRemove: (file: ImagePreviewFile) => void;
}

export const ImageListItem = ({ file, onRemove }: ImageListItemProps) => {
  const OnPreviewClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.preventDefault();
    window.open(file.preview, "_blank");
  }

  const OnUrlClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (file.uploadUrl === undefined)
      return;

    event.preventDefault();
    window.open(file.uploadUrl, "_blank");
  }

  const CopyToClipboard = () => {
    if (file.uploadUrl !== undefined)
      Helpers.CopyTextToClipboard(file.uploadUrl);
  }

  const is_uploaded = (file.uploadUrl !== undefined);
  return (
    <ListItem
      artwork={() => (
        <PreviewWrapper>
          <ZoomableImage image={file.preview} />
        </PreviewWrapper>
      )}
      artworkSize={64}
      endEnhancer={() => (
        <>
          {is_uploaded ? (
            <Button
              size="compact"
              kind="secondary"
              shape="round"
              onClick={CopyToClipboard}
            >
              <ClipboardIcon />
            </Button>
          ) : (
            <>
              {file.progress !== -1 ? (
                <LabelMedium
                  overrides={{
                    Block: { style: { fontWeight: "bold" } }
                  }}
                >
                  {file.progress}%
                </LabelMedium>
              ) : (
                <Button
                  size="compact"
                  kind="secondary"
                  shape="round"
                  onClick={() => onRemove(file)}
                >
                  <Delete />
                </Button>
              )}
            </>
          )}
        </>
      )}
      overrides={{
        Root: {
          style: ({ $theme }) => {
            if (file.isError)
              return { backgroundColor: $theme.colors.negative500 };
            if (is_uploaded)
              return { backgroundColor: $theme.colors.positive500 };
            if (file.progress !== -1)
              return { backgroundColor: $theme.colors.warning500 };
            return {};
          }
        },
        ArtworkContainer: {
          style: ({ $theme }) => ({
            marginRight: $theme.sizing.scale500
          })
        }
      }}
    >
      {is_uploaded ? (
        <ListItemLabel
          description="Slika postavljena uspešno!"
        >
          <FileName
            onClick={OnUrlClick}
            onAuxClick={(event) => {
              if (event.button === 1)
                OnUrlClick(event);
            }}
          >
            {file.uploadUrl}
          </FileName>
        </ListItemLabel>
      ) : (
        <ListItemLabel>
          <FileName
            onClick={OnPreviewClick}
            onAuxClick={(event) => {
              if (event.button === 1)
                OnPreviewClick(event);
            }}
          >
            {file.name}
          </FileName>
          {' '}{GetSizeFromBytes(file.size)}
        </ListItemLabel>
      )}
    </ListItem>
  );
}