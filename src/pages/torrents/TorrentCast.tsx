import React from "react";

import { styled, withStyle } from "baseui";

import PersonSvg from "./person.svg";

const ScrollerWrap = styled("div", {
  position: "relative",
  top: "0",
  left: "0"
});

const Scroller = styled("ol", ({ $theme }) => ({
  display: "flex",
  overflowX: "auto",
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  marginLeft: `-${$theme.sizing.scale300}`,
  marginBlockEnd: 0,
  listStyleType: "none",
  listStylePosition: "inside"
}));

const Item = styled("li", {
  width: "144px",
  minWidth: "144px"
});

const Card = withStyle(Item, ({ $theme }: any) => ({
  marginTop: $theme.sizing.scale400,
  marginRight: $theme.sizing.scale100,
  marginBottom: $theme.sizing.scale400,
  marginLeft: $theme.sizing.scale400,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: $theme.colors.borderOpaque,
  borderRadius: $theme.sizing.scale300,
  paddingBottom: $theme.sizing.scale400,
  overflow: "hidden",
  boxShadow: $theme.lighting.shadow400
}));

const CardText = styled("p", ({ $theme }) => ({
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  paddingTop: $theme.sizing.scale400,
  paddingRight: $theme.sizing.scale400,
  paddingBottom: "0",
  paddingLeft: $theme.sizing.scale400
}));

const CardImage = styled("img", {
  display: "block",
  height: "210px",
  width: "100%"
});

const NoImageHolder = withStyle(CardImage, {
  width: "50%",
  marginLeft: "auto",
  marginRight: "auto"
});

interface Props {
  torrent: TorrentDTO;
}

export const TorrentCast = ({ torrent }: Props) => {
  const casts = torrent.mediaInfo.info.casts;
  return (
    <>
      {(casts && casts.length !== 0) ? (
        <ScrollerWrap>
          <Scroller>
          {casts.map((info) => (
            <Card key={info.id}>
              {info.profile !== "false" ? (
                <CardImage src={info.profile} />
              ) : (
                <NoImageHolder src={PersonSvg} />
              )}
              <CardText $style={{ fontWeight: "bold" }}>{info.name}</CardText>
              <CardText
                $style={{
                  fontSize: "0.9em",
                  paddingTop: "0px"
                }}
              >
                {info.character}
              </CardText>
            </Card>
          ))}
          </Scroller>
        </ScrollerWrap>
      ) : null}
    </>
  );
};