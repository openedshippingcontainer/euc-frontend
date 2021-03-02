import React, { useState } from "react";

import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { Textarea } from "baseui/textarea";
import { LabelMedium } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Grid, Cell, BEHAVIOR, ALIGNMENT } from "baseui/layout-grid";

import { SendIcon } from "../../components/icons";
import { PageTitle } from "../../components/PageTitle";
import { AuthPanel } from "../../components/AuthPanel";
import { ContentWrapper } from "../../components/ContentWrapper";
import { ConfirmActionModal } from "../../components/ConfirmActionModal";

import * as Api from "../../api";

const RecoverAccountPage = () => {
  const [is_loading, setIsLoading] = useState(false);
  const [ask_for_confirmation, setAskForConfirmation] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const SendRequest = () => {
    setIsLoading(true);

    Api.SendResetEmailRequest(email, message, username)
      .then(() => {
        setIsLoading(false);
        setMessage("");
        setEmail("");
        setUsername("");
        toaster.positive("Zahtev za reset je uspešno podnet. U sledećih 24-48h dobićete obaveštenje o statusu vašeg zahteva.", {});
      })
      .catch(() => {
        setIsLoading(false);
        toaster.negative(`Greška se dogodila prilikom podnošenja zahteva`, {});
      });
  }

  const OnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.includes("@"))
      return setAskForConfirmation(true);

    SendRequest();
  }

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle auth>Zahtev za ručni reset</PageTitle>
        </Cell>
        <Cell span={12} align={ALIGNMENT.center}>
          <LabelMedium
            marginTop="scale300"
            marginRight="scale700"
            marginBottom="scale700"
            marginLeft="scale700"
          >
            Nakon što podnesete zahtev za reset, uprava sajta će izvršiti proveru vaših podataka i u slučaju potvrde identiteta, novi podaci za prijavu biće vam poslati na vašu novu e-mail adresu.
          </LabelMedium>
        </Cell>
        <Cell span={12} align={ALIGNMENT.center}>
          <AuthPanel $style={{ maxWidth: "576px" }}>
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
                label={() => "Nova E-mail adresa"}
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
                label={() => "Poruka"}
                caption={() => "Navedite barem staru email adresu, a ukoliko se ne sećate koju ste email adresu koristili, možete nam navesti više adresa u polju ispod, a mi ćemo uraditi proveru umesto vas. Takođe, ovde možete navesti i torente koje ste preuzimali, a kojih se sećate."}
              >
                <Textarea
                  clearable
                  value={message}
                  onChange={(event) => setMessage(event.currentTarget.value)}
                  overrides={{
                    Input: { style: { minHeight: "200px", resize: "vertical" } }
                  }}
                />
              </FormControl>
              <Button
                type="submit"
                size="compact"
                isLoading={is_loading}
                startEnhancer={() => <SendIcon inverse />}
                overrides={{
                  BaseButton: { style: { width: "100%" } }
                }}
              >
                Pošaljite zahtev za reset
              </Button>
            </form>
          </AuthPanel>
        </Cell>
        <ConfirmActionModal
          title="Potencijalni problem sa vašim zahtevom"
          body={
            `Za podnošenje reset zahteva je potrebno uneti staru email adresu ili navesti torente koje ste skidali. Ukoliko verujete da je sve u redu sa vašim zahtevom, pritisnite dugme "Da", uostalom kliknite dugme "Nazad".`
          }
          isOpen={ask_for_confirmation}
          onConfirm={() => {
            SendRequest();
            setAskForConfirmation(false);
          }}
          onClose={() => setAskForConfirmation(false)}
        />
      </Grid>
    </ContentWrapper>
  );
}

export default RecoverAccountPage;