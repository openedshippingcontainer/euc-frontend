import React, { useState, useEffect } from "react";

//import { Input } from "baseui/input";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
//import { StyledLink } from "baseui/link";
import { Checkbox } from "baseui/checkbox";
import { LabelSmall } from "baseui/typography";
//import { FormControl } from "baseui/form-control";
import { StyledSpinnerNext } from "baseui/spinner";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { SaveIcon } from "../components/icons";
import { PageTitle } from "../components/PageTitle";
import { HorizontalRule } from "../components/HorizontalRule";
import { DraftListComponent } from "../components/DraftListComponent";
import { ContentWrapper, CenteredLayout } from "../components/ContentWrapper";

import * as Api from "../api";
import { PreferencesContext } from "../app/PreferencesContext";
// import { SnowflakeContext } from "../app/SnowflakeContext";

const PreferencesPage = () => {
  const [is_loading, setIsLoading] = useState(true);
  const [is_sending, setIsSending] = useState(false);

  const [pref_view_xxx, setPrefViewXXX] = useState(false);
  const [pref_accept_pms, setPrefAcceptPms] = useState(false);
  const [pref_delete_pms, setPrefDeletePms] = useState(false);
  const [pref_save_pms, setPrefSavePms] = useState(false);
  const [pref_pm_notifs, setPrefPmNotifs] = useState(false);
  const [preferences_config, setPreferencesConfig] = PreferencesContext.use();
  // const [snowflake_config, setSnowflakeConfig] = SnowflakeContext.use();

  useEffect(() => {
    Api.GetPreferences()
      .then((response) => {
        setPrefViewXXX(response.viewXxx === "YES" ? true : false);
        setPrefAcceptPms(response.acceptPms === "YES" ? true : false);
        setPrefDeletePms(response.deletePms === "YES" ? true : false);
        setPrefSavePms(response.savePms === "YES" ? true : false);
        setPrefPmNotifs(response.pmNotifs === "YES" ? true : false);

        setIsLoading(false);
      })
      .catch(() =>  {
        toaster.negative(`Greška se dogodila prilikom učitavanja postavki`, {});
        setIsLoading(false);
      });
  }, []);

  const OnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSending(true);

    Api.SavePreferences(
      pref_view_xxx,
      pref_accept_pms,
      pref_delete_pms,
      pref_save_pms,
      pref_pm_notifs
    )
    .then(() => {
      toaster.positive("Postavke uspešno sačuvane!", {});
      setIsSending(false);
    })
    .catch(() => {
      toaster.negative(`Greška se dogodila prilikom učitavanja postavki`, {});
      setIsSending(false);
    });
  };

  /*const OnSnowflakeCountChange = (event: React.FormEvent<HTMLInputElement>) => {
    const count = +event.currentTarget.value;
    if (isNaN(count))
      return;

    // Clamp count between 25 and 1000
    setSnowflakeConfig((state) => ({
      ...state,
      count: Math.max(25, Math.min(count, 1000))
    }));
  }

  const OnSnowflakeColorChange = (event: React.FormEvent<HTMLInputElement>) => {
    const color = event.currentTarget.value;
    setSnowflakeConfig((state) => ({
      ...state,
      color: !color.length ? "#dee4fd" : color
    }));
  }*/

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>Podešavanja</PageTitle>
        </Cell>
        <Cell span={12}>
          {is_loading ? (
            <CenteredLayout>
              <StyledSpinnerNext />
            </CenteredLayout>
          ) : (
            <form onSubmit={OnSubmit}>
              <Checkbox
                labelPlacement="right"
                checked={pref_view_xxx}
                onChange={(event) => setPrefViewXXX(event.currentTarget.checked)}
              >
                Prikaz XXX torenata
              </Checkbox>
              <Checkbox
                labelPlacement="right"
                checked={pref_accept_pms}
                onChange={(event) => setPrefAcceptPms(event.currentTarget.checked)}
              >
                Svi korisnici mogu da mi šalju privatne poruke (umesto samo Staff)
              </Checkbox>
              <Checkbox
                labelPlacement="right"
                checked={pref_delete_pms}
                onChange={(event) => setPrefDeletePms(event.currentTarget.checked)}
              >
                Brisanje privatnih poruka nakon odgovora
              </Checkbox>
              <Checkbox
                labelPlacement="right"
                checked={pref_save_pms}
                onChange={(event) => setPrefSavePms(event.currentTarget.checked)}
              >
                Čuvanje svih poslatih privatnih poruka u odlazno sanduče
              </Checkbox>
              <Checkbox
                labelPlacement="right"
                checked={pref_pm_notifs}
                onChange={(event) => setPrefPmNotifs(event.currentTarget.checked)}
              >
                Slanje E-mail obaveštenja kada mi pristigne privatna poruka
              </Checkbox>
              <br />
              <Button
                type="submit"
                size="compact"
                isLoading={is_sending}
                startEnhancer={() => <SaveIcon inverse />}
                overrides={{
                  BaseButton: { style: { width: "100%" } }
                }}
              >
                Sačuvaj izmene
              </Button>
            </form>
          )}
        </Cell>
        <Cell span={12}>
          <Block
            as="h2"
            marginBottom="0"
          >
            Lokalne izmene
          </Block>
          <LabelSmall
            color="contentSecondary"
          >
            Nakon promene NIJE potrebno sačuvati izmene. Izmene važe samo za ovaj uređaj/pretraživač.
          </LabelSmall>
          <HorizontalRule />
          {/*<Checkbox
            labelPlacement="right"
            checked={snowflake_config.enabled}
            onChange={(event) => setSnowflakeConfig((state) => ({
              ...state,
              enabled: event.currentTarget.checked
            }))}
          >
            Pahuljice
          </Checkbox>
          <br />
          <FormControl
            label="Broj pahuljica na stranici"
            caption="Standardna vrednost: 100. Vrednost je ograničena na intervalu između 25 i 1000"
          >
            <Input
              clearable
              type="number"
              size="compact"
              step={5}
              maxLength={3}
              value={snowflake_config.count}
              onChange={OnSnowflakeCountChange}
            />
          </FormControl>
          <FormControl
            label="Boja"
            caption={() => (
              <>
                Standardna vrednost: #dee4fd. U HTML zapisu. Ovde možete eksperimentisati:
                {' '}
                <StyledLink
                  href="https://www.hexcolortool.com"
                >
                  https://www.hexcolortool.com
                </StyledLink>
              </>
            )}
          >
            <Input
              clearable
              size="compact"
              value={snowflake_config.color}
              onChange={OnSnowflakeColorChange}
            />
          </FormControl>
          <br />*/}
          <Checkbox
            labelPlacement="right"
            checked={preferences_config.showRobotTorrents}
            onChange={(event) => setPreferencesConfig((state) => ({
              ...state,
              showRobotTorrents: event.currentTarget.checked
            }))}
          >
            Prikaži robotove torente
          </Checkbox>
        </Cell>
        <Cell span={12}>
          <HorizontalRule />
          <DraftListComponent />
        </Cell>
      </Grid>
    </ContentWrapper>
  );
};

export default PreferencesPage;