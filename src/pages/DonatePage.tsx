import React from "react";
import { Link } from "react-router-dom";

import { styled } from "baseui";
import { LabelMedium } from "baseui/typography";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

import { PageTitle } from "../components/PageTitle";
import { ContentWrapper, CenteredLayout } from "../components/ContentWrapper";

import * as Helpers from "../helpers";

interface DonationInfoType {
  name: string;
  count?: number;
}

const DonationList: Array<DonationInfoType> = [
  { name: "Donator 1", count: 5 },
  { name: "Donator 2" }
];

const AnonymousDonatorCount = 5;

const Bold = styled("span", {
  fontWeight: "bold"
});

const DonatorTitle = styled("h2", ({ $theme }) => ({
  cursor: "pointer",
  marginTop: $theme.sizing.scale400,
  marginBottom: $theme.sizing.scale400
}));

const ImageContainer = styled("img", ({ $theme }) => ({
  marginLeft: $theme.sizing.scale200
}));

const DonatePage = () => {
  const sorted_list = DonationList.sort((a: DonationInfoType, b: DonationInfoType) => (
    (a.count !== undefined && (a.count > (b.count || 1)) ? -1 : 1)
  ));

  const result: Array<Array<DonationInfoType>> = [];
  for (let i = 0; i < sorted_list.length; i += 3)
    result.push(sorted_list.slice(i, i + 3));

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>
            Najlepše hvala svim donatorima
            <ImageContainer
              src="https://eliteunitedcrew.org/pic/smilies/euclove2.gif"
            />
          </PageTitle>
        </Cell>
        <Cell span={12}>
          <LabelMedium>
            Zabeleženo ukupno <Bold>{sorted_list.length + AnonymousDonatorCount}</Bold> donatora,
            od kojih je <Bold>{AnonymousDonatorCount}</Bold> želelo da ostane anonimno.
          </LabelMedium>
        </Cell>
        {result.map((donator_row, index) => (
          <React.Fragment key={`donator-${index}`}>
            {donator_row.map((donator) => (
              <Cell span={[2, 2, 3]} key={donator.name}>
                <CenteredLayout>
                  <Link
                    to={Helpers.GetUserProfileByUsernameHref(donator.name)}
                    component={(props: LinkProps) => (
                      <DonatorTitle
                        onClick={props.navigate}
                        onAuxClick={(event) => {
                          if (event.button === 1) {
                            event.preventDefault();
                            window.open(props.href, "_blank");
                          }
                        }}
                      >
                        <Bold>{donator.name}</Bold>
                        {donator.count ? ` (${donator.count})` : null}
                      </DonatorTitle>
                    )}
                  />
                </CenteredLayout>
              </Cell>
            ))}
          </React.Fragment>
        ))}
      </Grid>
    </ContentWrapper>
  );
};

export default DonatePage;