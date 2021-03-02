import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Tag } from "baseui/tag";
import { Input } from "baseui/input";
import { Upload } from "baseui/icon";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { Checkbox } from "baseui/checkbox";
import { Textarea } from "baseui/textarea";
import { Select, Value } from "baseui/select";
import { FormControl } from "baseui/form-control";
import { FileUploader } from "baseui/file-uploader";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { PageTitle } from "../../components/PageTitle";
import { ContentWrapper, CenteredLayout } from "../../components/ContentWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

const CountDotsAndDashes = (input: string) => {
  let dots = 0, dashes = 0;
  for (let i = 0; i < input.length; ++i) {
    if (input[i] === ".") ++dots;
    else if (input[i] === "-") ++dashes;
  }

  return { dots: dots, dashes: dashes };
}

// Replaces all dashes but the last one
const ReplaceDashes = (input: string) => {
  const parts = input.split("-");
  if (parts.length === 1)
    return input;

  return parts.slice(0, -1).join(" ") + "-" + parts.slice(-1);
}

const GetTorrentName = (input: string) => {
  let result = input.replace(/\.torrent/ig, "");

  const count = CountDotsAndDashes(result);
  if (count.dashes > 1)
    result = ReplaceDashes(result);

  try {
    if (count.dots > 1) {
      // Replaces every dot except when found in:
      // 2.0, 5.1, 7.1, H.264, H.265, H.266
      const DotRegex = new RegExp("(?<!(?:2(?=\\.0)|5(?=\\.1)|7(?=\\.1)|H(?=\\.26[456])))\\.", "ig");
      result = result.replace(DotRegex, " ");
    }
  } catch {
    console.warn(
      `Vaš pretraživač ne podržava "negative lookbehind RegExp" izraze. Automatsko popunjavanje naziva je isključeno.`
    );
  }

  return result;
}

const TorrentUploadPage = () => {
  const history = useHistory();

  const [is_uploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState<Value | undefined>(undefined);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [quality, setQuality] = useState("");
  const [requested, setRequested] = useState(false);
  const [request_id, setRequestId] = useState(0);

  const OnSubmit = () => {
    const warn = (field: string): void => {
      toaster.warning(`Polje ${field} je obavezno!`, {});
    }

    if (!file) return warn("fajl");
    if (name.length === 0) return warn("ime");
    if (quality.length === 0) return warn("kvalitet");
    if (description.length === 0) return warn("deskripcija");

    if (
      category === undefined ||
      category.length === 0 ||
      category[0].id === undefined
    ) {
      return warn("kategorija");
    }

    if (requested && request_id) {
      if (isNaN(request_id) && request_id !== 0)
        return warn("ID");
    }

    setIsUploading(true);

    Api.UploadTorrent(
      +category[0].id,
      description,
      file,
      name,
      quality,
      requested,
      requested ? request_id : null
    )
    .then((response) => {
      setIsUploading(false);

      // Download torrent and then redirect to the torrent's page
      Api.DownloadTorrent(+response, file.name)
        .then(() => history.push(`/torrent/${response}`))
        .catch(() => {
          toaster.negative(`Greška prilikom preuzimanja postavljenog torenta!`, {});
        });
    })
    .catch(() => {
      setIsUploading(false);
      toaster.negative(`Greška prilikom postavljana torenta!`, {});
    });
  }

  const OnDropAccepted = (accepted_file: Array<File>) => {
    setFile(accepted_file[0]);
    setName((state) => (
      (state && state.length !== 0) ? state : GetTorrentName(accepted_file[0].name)
    ));
  }

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>Postavi novi torent</PageTitle>
        </Cell>
        <Cell span={12}>
          {((file === null) || is_uploading) ? (
            <FileUploader
              onDropAccepted={OnDropAccepted}
              progressMessage={is_uploading ? "Fajl se šalje..." : ""}
              accept="application/x-bittorrent"
            />
          ) : (
            <CenteredLayout>
              {(file !== null) ? (
                <Tag
                  size="large"
                  variant="solid"
                  onActionClick={() => setFile(null)}
                  overrides={{
                    Text: { style: { wordBreak: "break-all", maxWidth: "70vw" } }
                  }}
                >
                  {file.name}
                </Tag>
              ) : null}
            </CenteredLayout>
          )}
          <FormControl label={() => "Naziv"}>
            <Input
              clearable
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </FormControl>
          <FormControl label={() => "Kategorija"}>
            <Select
              type="search"
              valueKey="id"
              labelKey="name"
              placeholder="Izaberite kategoriju torenta"
              maxDropdownHeight="55vh"
              value={category}
              options={Helpers.GroupedTorrentCategories}
              onChange={({ option }) => {
                if (option !== undefined)
                  setCategory(option ? [option] : undefined);
              }}
            />
          </FormControl>
          <FormControl label={() => "Opis"}>
            <Textarea
              clearable
              value={description}
              onChange={(event) => setDescription(event.currentTarget.value)}
              overrides={{
                Input: { style: { minHeight: "200px", resize: "vertical" } }
              }}
            />
          </FormControl>
          <FormControl label={() => "Kvalitet"}>
            <Textarea
              clearable
              value={quality}
              onChange={(event) => setQuality(event.currentTarget.value)}
              overrides={{
                Input: { style: { minHeight: "200px", resize: "vertical" } }
              }}
            />
          </FormControl>
          <Checkbox
            checked={requested}
            onChange={(event) => setRequested(event.currentTarget.checked)}
            labelPlacement="right"
          >
            Da li ovaj torent ispunjava neki zahtev?
          </Checkbox>
          {requested ? (
            <FormControl label={() => "ID zahteva"}>
              <Input
                clearable
                onChange={(event) => setRequestId(+event.currentTarget.value)}
              />
            </FormControl>
          ) : (
            <br />
          )}
          <Button
            startEnhancer={() => <Upload />}
            onClick={OnSubmit}
            overrides={{
              BaseButton: { style: { width: "100%" } }
            }}
          >
            Postavi
          </Button>
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default TorrentUploadPage;