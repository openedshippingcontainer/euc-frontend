import React from "react";
import DOMPurify from "dompurify";
import { StyleObject } from "styletron-react";

import { StyledLink } from "baseui/link";

import { Spoiler } from "../components/Spoiler";
import { UserMention } from "../components/UserTag";
import { YouTubePlayer } from "../components/YouTubePlayer";
import { ZoomableImage } from "../components/ZoomableImage";
import { QuoteComponent } from "../components/QuoteComponent";
import { HorizontalRule } from "../components/HorizontalRule";
import { RawDescriptionContainer } from "../components/RawDescriptionContainer";

import { ReactProcessString } from "./ReactProcessString";
import { Smilies, GetSmileyURL } from "./Smilies";

import { RenderBBCode } from "./bbcode/react";
import { CreatePreset } from "./bbcode/preset";
import { GetUniqueAttribute } from "./bbcode/plugin-helper";
import { DefaultPreset, InterfaceType } from "./bbcode/preset/DefaultTags";

const ForumPresetTags: InterfaceType = {
  ...DefaultPreset,
  quote: (node) => ({
    tag: QuoteComponent,
    attrs: { username: GetUniqueAttribute(node.attrs) },
    content: node.content
  }),
  code: (node) => ({
    tag: RawDescriptionContainer,
    content: node.content
  }),
  img: (node) => {
    const url = GetUniqueAttribute(node.attrs) || node.content[0];
    if (!url)
      return undefined;

    return {
      tag: ZoomableImage,
      attrs: {
        image: url,
        width: "300px"
      }
    };
  },
  video: (node) => {
    const url = GetUniqueAttribute(node.attrs) || node.content[0];
    if (!url)
      return undefined;

    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
    if (match) {
      return {
        tag: YouTubePlayer,
        attrs: {
          video_id: match[1],
          width: "640px",
          height: "385px"
        }
      };
    }

    if (url.endsWith(".gif"))
      return { tag: "img", attrs: { src: url } };

    return { tag: "video", attrs: { src: url, controls: true } };
  },
  url: (node) => {
    const url: string = GetUniqueAttribute(node.attrs) || node.content[0];
    if (!url)
      return undefined;

    const is_local = url.includes("eliteunitedcrew.org");
    return {
      tag: StyledLink,
      attrs: {
        rel: "noopener noreferrer",
        href: url,
        target: "_blank"
      },
      content: (
        (node.content[0] && node.content[0] !== url) ?
        (is_local ? node.content[0] : `${node.content[0]} (${url})`) :
        url
      )
    };
  },
  spoiler: (node) => ({
    tag: Spoiler,
    attrs: {
      title: GetUniqueAttribute(node.attrs)
    },
    content: node.content
  }),
  screen: (node) => ({
    tag: Spoiler,
    attrs: {
      title: "Slike: " + GetUniqueAttribute(node.attrs)
    },
    content: node.content
  }),
  hr: () => ({
    tag: HorizontalRule
  })
};

const ForumPreset = CreatePreset(ForumPresetTags)();

const URL_RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:;%_+.~#?&//=!]*)/ig;

const ShoutboxConfig = [
  {
    // @username
    // Copy-pasted from https://github.com/regexhq/mentions-regex/blob/master/index.js
    regex: /(?:^|[^a-zA-Z0-9_＠!@#$%&*])(?:(?:@|＠)(?!\/))([a-zA-Z0-9/_.]{1,15})(?:\b(?!@|＠)|$)/ig,
    match: function MatchUsername(key: number, result: Array<string>) {
      return (
        <UserMention key={`mention-${key}`} username={result[1]} />
      );
    }
  },
  {
    // Any link
    regex: URL_RegExp,
    match: function MatchURL(key: number, result: Array<string>) {
      const style: StyleObject = (
        result[0].includes("eliteunitedcrew.org") ?
        { fontWeight: "bold" } :
        {}
      );
      return (
        <StyledLink
          key={`external-link-${key}`}
          rel="noopener noreferrer"
          href={result[0]}
          target="_blank"
          $style={{
            ...style,
            wordBreak: "break-all"
          }}
        >
          {result[0]}
        </StyledLink>
      );
    }
  },
  {
    // Smilies
    regex: /(?::\w+:|<[/\\]?3|[()\\|*$][-^]?[:;=]|[:;=B8][-^]?[3DOPp@$*\\)(?:/|])/ig,
    match: function MatchSmilies(key: number, result: Array<string>) {
      if (!(result[0] in Smilies))
        return result[0];

      return (
        <img
          key={`smilies-${key}`}
          src={GetSmileyURL(result[0])}
          alt={result[0]}
        />
      );
    }
  }
];

export function FormatBBcode(text?: string) {
  if (text === undefined)
    return (<h1>Greška se dogodila. Prikazivanje ovog posta nije moguće.</h1>);

  // Ghett0 fix. Hopefully this won't break anything
  // This fixes extra whitespace before/after quote tags
  // which is particularly annoyning because we're using <pre>
  // to display the result of this function.
  // NOTE: This shouldn't throw, but you can never be too careful.
  let result = text;
  try {
    result = result
      .replace(
        /(?:\[quote[^\]]{0,35}\])([\s]*?)+/ig,
        (match: string) => (
          // indexOf will never -1, because our regex ensures that beforehand
          match.substring(0, match.indexOf("]") + 1)
        )
      )
      .replace(
        /(?:\[\/quote\])([\s]*?)+/ig,
        "[/quote]"
      );
  } catch {
    console.warn("Pre-formatiranje BBcode tagova nije moguće.");
  }

  return ReactProcessString(ShoutboxConfig)(
    RenderBBCode(
      result,
      ForumPreset,
      { onlyAllowTags: Object.keys(ForumPresetTags) }
    )
  );
}

export function FormatShoutboxBBcode(text: string) {
  const purified = DOMPurify.sanitize(text);
  if (!purified || purified.length === 0)
    return purified;

  return ReactProcessString(ShoutboxConfig)(purified);
}