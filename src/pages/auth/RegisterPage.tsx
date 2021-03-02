import React, { useState } from "react";

import { styled } from "baseui";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { FormControl } from "baseui/form-control";
import { Grid, Cell, BEHAVIOR, ALIGNMENT } from "baseui/layout-grid";

import { PageTitle } from "../../components/PageTitle";
import { AuthPanel } from "../../components/AuthPanel";
import { ContentWrapper } from "../../components/ContentWrapper";

import * as Api from "../../api";

const USERNAME_CAPTION = "Korisničko ime mora sadržati najmanje 3, a najviše 32 karaktera";
const EMAIL_CAPTION = "E-mail adresa mora sadržati najmanje 6 karaktera";
const PASSWORD_CAPTION = "Lozinka mora sadržati najmanje 10 karaktera";

const Bold = styled("span", {
  fontWeight: "bold"
});

const RegisterPage = () => {
  return (
    <ContentWrapper>
      <Cell span={12}>
        <h1>Registracije su zatvorene do daljnjeg.</h1>
      </Cell>
    </ContentWrapper>
  );
  /*const [is_loading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");

  const OnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username.length < 3 || username.length > 32)
      return toaster.warning(USERNAME_CAPTION, {});

    if (email.length < 6)
      return toaster.warning(EMAIL_CAPTION, {});

    if (password.length < 10)
      return toaster.warning(PASSWORD_CAPTION, {});

    if (password !== password_confirm)
      return toaster.warning("Lozinke se ne podudaraju!", {});

    // Set response state back to default.
    setIsLoading(true);

    Api.Register(username, email, password)
      .then(() => {
        setIsLoading(false);
        toaster.positive((
          <>
            <Bold>Dobrodošli na EliteUnitedCrew!</Bold>
            <br/>
            Vaš nalog je uspešno kreiran.
            <br />
            <br />
            Dalja uputstva su poslata na vašu e-mail adresu.
          </>
        ), { autoHideDuration: 0 });
      })
      .catch(() => {
        setIsLoading(false);
        toaster.negative(`Greška se dogodila prilikom registracije`, {});
      });
  }


  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle auth>Registracija</PageTitle>
        </Cell>
        <Cell span={12} align={ALIGNMENT.center}>
          <AuthPanel $style={{ maxWidth: "576px" }}>
            <form onSubmit={OnSubmit}>
              <FormControl
                label={() => "Željeno korisničko ime"}
                caption={() => USERNAME_CAPTION}
              >
                <Input
                  required
                  name="username"
                  disabled={is_loading}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                />
              </FormControl>
              <FormControl
                label={() => "E-mail adresa"}
                caption={() => EMAIL_CAPTION}
              >
                <Input
                  required
                  name="email"
                  type="email"
                  disabled={is_loading}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                />
              </FormControl>
              <FormControl
                label={() => "Lozinka"}
                caption={() => PASSWORD_CAPTION}
              >
                <Input
                  required
                  name="password"
                  type="password"
                  disabled={is_loading}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
              </FormControl>
              <FormControl
                label={() => "Potvrda lozinke"}
              >
                <Input
                  required
                  type="password"
                  name="password_confirm"
                  disabled={is_loading}
                  onChange={(event) => setPasswordConfirm(event.currentTarget.value)}
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
                Registrujte se
              </Button>
            </form>
          </AuthPanel>
        </Cell>
      </Grid>
    </ContentWrapper>
  );*/
}

export default RegisterPage;