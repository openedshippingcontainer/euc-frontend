import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import { LabelLarge, LabelMedium } from "baseui/typography";
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

const RecoverAccountConfirmPage = () => {
  const params = useParams<ParamsType>();

  const { isFetching } = useQuery(
    "recover_account_confirm",
    () => Api.RecoverAccountConfirm(+params.id, params.hash),
    { staleTime: 500 }
  );

  if (isFetching)
    return (<PageLoading />);

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle auth>Potvrda o resetovanju lozinke</PageTitle>
        </Cell>
        <Cell span={12} align={ALIGNMENT.center}>
          <LabelLarge>Uspešno ste resetovali svoju lozinku.</LabelLarge>
          <LabelMedium>Nova lozinka je poslata na vašu e-mail adresu.</LabelMedium>
          <br />
          <Link
            to="/"
            component={LinkAnchor}
            // @ts-ignore
            $style={{ fontWeight: "bold" }}
          >
            Kliknite na sledeći link da biste se vratili na prijavnu stranicu.
          </Link>
        </Cell>
      </Grid>
    </ContentWrapper>
  );
}

export default RecoverAccountConfirmPage;