import React, { useCallback, useState } from "react";
import without from "lodash/without";
import uniqWith from "lodash/uniqWith";

import { styled } from "baseui";
import { Button } from "baseui/button";
import { Upload } from "baseui/icon";
import { toaster } from "baseui/toast";
import { FileUploader } from "baseui/file-uploader";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { ImageListItem } from "./ImageListItem";

import * as Helpers from "../../helpers";
import { ClipboardIcon } from "../icons";

// Accept only image mimetypes
const AcceptedMimetypes = [
  "image/bmp", "image/gif", "image/jpeg", "image/png"
];

// Limit max file size to 12MB
const MaxFileSize = 12 * 1000 * 1000;

const IsDuplicate = (a: ImagePreviewFile, b: ImagePreviewFile) => (
  a.name === b.name &&
  a.size === b.size &&
  a.type === b.type &&
  a.lastModified === b.lastModified
);

const GetUniqueKey = (image_file: ImagePreviewFile) => (
  `${image_file.name}_${image_file.size}_${image_file.lastModified}`
);

const FileUploadWrapper = styled("div", {
  minWidth: "100%"
});

const List = styled("ul", {
  paddingInlineStart: "0px"
});

export const ImageUploadComponent = () => {
  const [, setUpdatedState] = useState<Record<string, unknown>>();
  const ForceUpdate = useCallback(() => setUpdatedState({}), []);

  const [is_uploading, setIsUploading] = useState(false);
  const [has_image_with_url, setHasImageWithUrl] = useState(false);
  const [image_files, setImageFiles] = useState<Array<ImagePreviewFile>>([]);

  const OnRemove = (file: ImagePreviewFile) => {
    setImageFiles((state) => without(state, file));
  }

  const OnDrop = (files: Array<File>) => {
    // Promote File to ImagePreviewFile
    const image_files = files.map((file) => (
      Object.assign(
        file,
        {
          preview: URL.createObjectURL(file),
          progress: -1
        }
      ) as ImagePreviewFile
    ));

    setImageFiles((state) => (
      uniqWith(state.concat(image_files), IsDuplicate)
    ));
  }

  const UploadImages = () => {
    if (!image_files.length) {
      toaster.negative("Morate izabrati barem jednu sliku!", {});
      return;
    }

    const images = image_files.filter((image) => image.uploadUrl === undefined);
    if (!images.length)
      return setImageFiles([]);

    setIsUploading(true);

    Promise.allSettled(
      images.map((image) => Helpers.UploadImage(image, ForceUpdate))
    )
      .then(() => {
        if (images.every((image) => image.uploadUrl !== undefined))
          toaster.positive("Sve slike postavljene uspešno :)", {});

        setIsUploading(false);
        setImageFiles(images);

        setHasImageWithUrl(images.some((image) => image.uploadUrl !== undefined));
      });
  }

  return (
    <Grid behavior={BEHAVIOR.fluid}>
      <Cell span={12}>
        <FileUploadWrapper>
          <FileUploader
            multiple
            maxSize={MaxFileSize}
            accept={AcceptedMimetypes}
            onDropAccepted={OnDrop}
          />
        </FileUploadWrapper>
      </Cell>
      <Cell span={12}>
        <Button
          size="compact"
          kind="primary"
          onClick={UploadImages}
          isLoading={is_uploading}
          startEnhancer={() => <Upload />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: "100%",
                marginTop: $theme.sizing.scale600
              })
            }
          }}
        >
          Postavi
        </Button>
      </Cell>
      {has_image_with_url ? (
        <Cell span={12}>
          <Button
            size="compact"
            kind="secondary"
            onClick={() => {
              let all_links = "";
              image_files.forEach((image) => {
                all_links += image.uploadUrl + "\n";
              });

              if (!all_links) {
                toaster.negative("Nema linkova za kopiranje!", {});
                return;
              }

              // Cut last new line when copying
              Helpers.CopyTextToClipboard(all_links.slice(0, -1));
            }}
            startEnhancer={() => <ClipboardIcon />}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: "100%",
                  marginTop: $theme.sizing.scale600
                })
              }
            }}
          >
            Kopiraj sve
          </Button>
        </Cell>
      ) : null}
      <Cell span={12}>
        {image_files.length !== 0 ? (
          <>
            <h2>Slike ({image_files.length})</h2>
            <List>
              {image_files.map((image_file) => (
                <ImageListItem
                  key={GetUniqueKey(image_file)}
                  file={image_file}
                  onRemove={OnRemove}
                />
              ))}
            </List>
          </>
        ) : null}
      </Cell>
    </Grid>
  );
};