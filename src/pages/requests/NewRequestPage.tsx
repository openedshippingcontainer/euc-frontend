import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { Textarea } from "baseui/textarea";
import { Select, Value } from "baseui/select";
import { FormControl } from "baseui/form-control";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { SendIcon } from "../../components/icons";
import { PageTitle } from "../../components/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

const NewRequestPage = () => {
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Value | undefined>(undefined);

  const OnSubmit = () => {
    if (title.length === 0) return toaster.warning(`Polje naziv je obavezno!`, {});
    if (description.length === 0) return toaster.warning(`Polje deskripcija je obavezno!`, {});

    if (
      category === undefined ||
      category.length === 0 ||
      category[0].id === undefined
    ) {
      return toaster.warning(`Polje kategorija je obavezno!`, {});
    }

    Api.AddRequest(
      +category[0].id,
      title,
      description
    )
    .then(() => {
      toaster.positive("Zahtev uspešno postavljen!", {});
      history.push(`/requests`);
    })
    .catch(() => {
      toaster.negative(`Greška prilikom postavljana zahteva!`, {});
    });
  }

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>Novi zahtev</PageTitle>
        </Cell>
        <Cell span={12}>
          <FormControl label={() => "Naziv"}>
            <Input
              clearable
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
          </FormControl>
        </Cell>
        <Cell span={12}>
          <FormControl label={() => "Kategorija"}>
            <Select
              type="search"
              valueKey="id"
              labelKey="name"
              placeholder="Izaberite kategoriju zahteva"
              maxDropdownHeight="55vh"
              value={category}
              options={Helpers.GroupedTorrentCategories}
              onChange={({ option }) => {
                if (option !== undefined)
                  setCategory(option ? [option] : undefined);
              }}
            />
          </FormControl>
        </Cell>
        <Cell span={12}>
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
        </Cell>
        <Cell span={12}>
          <Button
            size="compact"
            startEnhancer={() => <SendIcon inverse />}
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

export default NewRequestPage;