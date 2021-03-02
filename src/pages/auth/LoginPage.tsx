import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { styled } from "baseui";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { FormControl } from "baseui/form-control";
import { ParagraphSmall } from "baseui/typography";
import { Grid, Cell, BEHAVIOR, ALIGNMENT } from "baseui/layout-grid";

import { KeyIcon } from "../../components/icons";
import { AuthPanel } from "../../components/AuthPanel";
import { PageTitle } from "../../components/PageTitle";
import { LinkAnchor } from "../../components/LinkAnchor";
import { ContentWrapper } from "../../components/ContentWrapper";

import * as Api from "../../api";
import * as Actions from "../../actions";

// Preload HomePage
import(/* webpackPreload: true */ "../HomePage");

const Bold = styled("span", {
  fontWeight: "bold"
});

const Separator = styled("div", ({ $theme }) => ({
  textAlign: "center",
  marginTop: $theme.sizing.scale600,
  marginRight: 0,
  marginBottom: $theme.sizing.scale600,
  marginLeft: 0
}));

const LoginPage = () => {
  const history = useHistory();

  const [is_loading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const OnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    Api.Login(username, password)
      .then((response) => {
        setIsLoading(false);
        Actions.Login(response);
        history.push("/");
      })
      .catch(() => {
        setIsLoading(false);
        toaster.negative(`Greška se dogodila prilikom prijavljivanja`, {});
      });
  }

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle primary auth>Prijava</PageTitle>
        </Cell>
        <Cell span={12} align={ALIGNMENT.center}>
          <AuthPanel
            $style={{ maxWidth: "484px" }}
          >
            <form onSubmit={OnSubmit}>
              <FormControl
                label={() => "Korisničko ime"}
              >
                <Input
                  required
                  name="username"
                  disabled={is_loading}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                />
              </FormControl>
              <FormControl
                label={() => "Lozinka"}
                caption={() => (
                  <>
                    Zaboravili ste lozinku? Kliknite <Link to="/recover" component={LinkAnchor}>ovde</Link>
                  </>
                )}
              >
                <Input
                  required
                  name="password"
                  type="password"
                  disabled={is_loading}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
              </FormControl>
              <Button
                type="submit"
                size="compact"
                isLoading={is_loading}
                startEnhancer={() => <KeyIcon />}
                overrides={{
                  BaseButton: { style: { width: "100%" } }
                }}
              >
                Prijavite se
              </Button>
            </form>
            {/*<Separator>
              <small>ILI</small>
            </Separator>
            <div>
              <Link
                to="/register"
                component={(props: LinkProps) => (
                  <Button
                    kind="secondary"
                    size="compact"
                    overrides={{
                      BaseButton: { style: { width: "100%" } }
                    }}
                    onClick={props.navigate}
                  >
                    Registrujte se
                  </Button>
                )}
              />
            </div>
            */}
          </AuthPanel>
        </Cell>
        <Cell span={12} align={ALIGNMENT.center}>
          <ParagraphSmall>
            <Bold>Napomena: </Bold>
            Ni jedan od fajlova prikazanih ovde nije zapravo hostovan na ovom serveru.
            Linkovi su dati isključivo od strane korisnika sajta.
            Administratori ovog sajta nisu odgovorni za ono što korisnici šalju na sajt,
            niti za bilo kakve akcije korisnika sajta.
            Ne možete koristiti ovaj sajt za distribuciju ili download bilo kakvog materijala
            za koji nemate legalna prava. Vaša je odgovornost za pristanak na ove uslove.
          </ParagraphSmall>
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default LoginPage;