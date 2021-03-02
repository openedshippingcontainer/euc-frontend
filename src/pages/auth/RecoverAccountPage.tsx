import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { LabelMedium } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Grid, Cell, BEHAVIOR, ALIGNMENT } from "baseui/layout-grid";

import {
  ContentWrapper,
  CenterHorizontally
} from "../../components/ContentWrapper";
import { PageTitle } from "../../components/PageTitle";
import { AuthPanel } from "../../components/AuthPanel";
import { LinkAnchor } from "../../components/LinkAnchor";

import * as Api from "../../api/Auth";

const RecoverAccountPage = () => {
  const [is_loading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const OnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    Api.RecoverAccount(username, email)
      .then(() => {
        setIsLoading(false);
        toaster.positive("Podaci za resetovanje lozinke su poslati na vašu e-mail adresu.", {});
      })
      .catch(() => {
        setIsLoading(false);
        toaster.negative(`Greška se dogodila prilikom resetovanja vaše lozinke`, {});
      });
  }

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle auth>Resetovanje lozinke</PageTitle>
        </Cell>
        <Cell span={12} align={ALIGNMENT.center}>
          <LabelMedium
            marginTop="scale300"
            marginRight="scale700"
            marginBottom="scale700"
            marginLeft="scale700"
          >
            Ne možete da pristupite vašem nalogu?
            Unesite vaše korisničko ime i vašu e-mail adresu i
            poslaćemo vam nove detalje za pristup sajtu.
          </LabelMedium>
        </Cell>
        <Cell span={12} align={ALIGNMENT.center}>
          <AuthPanel $style={{ maxWidth: "484px" }}>
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
                label={() => "E-mail"}
              >
                <Input
                  required
                  name="email"
                  type="email"
                  disabled={is_loading}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                />
              </FormControl>
              <Button
                type="submit"
                size="compact"
                isLoading={is_loading}
                overrides={{
                  BaseButton: { style: { width: "100%" } }
                }}
              >
                Resetujte lozinku
              </Button>
            </form>
          </AuthPanel>
        </Cell>
        <Cell span={12}>
          <CenterHorizontally>
            <Link
              to="/recover/email"
              component={LinkAnchor}
            >
              Ukoliko nemate pristup email adresi, kliknite ovde
            </Link>
          </CenterHorizontally>
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default RecoverAccountPage;