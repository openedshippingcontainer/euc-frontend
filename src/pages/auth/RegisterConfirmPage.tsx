import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { toaster } from "baseui/toast";
import { Grid, Cell, BEHAVIOR, ALIGNMENT } from "baseui/layout-grid";

import { PageTitle } from "../../components/PageTitle";
import { LinkAnchor } from "../../components/LinkAnchor";
import { PageLoading } from "../../components/PageLoading";
import { ContentWrapper } from "../../components/ContentWrapper";

import * as Api from "../../api";

interface ParamsType {
  id: string;
  hash: string;
}

const RegisterConfirmPage = () => {
  const params = useParams<ParamsType>();

  const [is_loading, setIsLoading] = useState(true);

  useEffect(
    () => {
      const id = +params.id;
      if (isNaN(id)) {
        toaster.negative("Prosleđen nevažeći ID naloga!", {});
        return;
      }

      Api.ConfirmRegistration(id, params.hash)
        .then(() => {
          setIsLoading(false);
          const key = toaster.positive((
            <span onClick={() => toaster.clear(key)}>
              Uspešno ste potvrdili svoj nalog.
              <br />
              Kliknite na
              {' '}
              <Link
                to="/login"
                component={LinkAnchor}
                // @ts-ignore
                $style={{ fontWeight: "bold" }}
              >
                sledeći link
              </Link>
              {' '}
              da biste se prijavili na sajt.
            </span>
          ), { autoHideDuration: 0 });
        })
        .catch(() => {
          setIsLoading(false);
          toaster.negative(`Greška se dogodila prilikom potvrđivanja naloga`, {});
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle auth>Potvrda naloga</PageTitle>
        </Cell>
        <Cell span={12} align={ALIGNMENT.center}>
          {is_loading ? <PageLoading /> : null}
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default RegisterConfirmPage;