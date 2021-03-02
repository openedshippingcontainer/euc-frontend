import React, { useEffect, useCallback } from "react";
import {
  Link,
  matchPath,
  useHistory,
  useLocation
} from "react-router-dom";
import { useSelector } from "react-redux";

import { styled } from "baseui";
import { Block } from "baseui/block";
import { Notification } from "baseui/notification";

import { LinkAnchor } from "../LinkAnchor";
import { NavBar, setItemActive } from "./nav-bar";

import * as Helpers from "../../helpers";
import * as Actions from "../../actions";
import { RootStateType } from "../../reducers";

import PackageJSON from "../../../package.json";

interface ItemType {
  label: string;
  path: string;
  starts_with?: string;
  should_bold?: boolean;
  callback?: () => void;
}

const Bold = styled<{ $bold?: boolean }, "span">("span", ({ $bold }) => ({
  ...($bold ? { fontWeight: "bold" } : {}),
  userSelect: "none",
  cursor: "pointer"
}));

const Version = styled("span", ({ $theme }) => ({
  fontSize: $theme.sizing.scale500,
  color: $theme.colors.primaryA
}));

const RenderItem = (item: NavItem) => {
  const nav_item = item.info as ItemType;
  return (
    <Bold $bold={nav_item.should_bold}>
      {item.label}
    </Bold>
  );
}

interface HeaderProps {
  callback: () => void;
}

export const Header = ({ callback }: HeaderProps) => {
  const user = useSelector((state: RootStateType) => state.auth.user);
  const notifications = useSelector((state: RootStateType) => state.notifications);

  const history = useHistory();
  const location = useLocation();

  const [mainItems, setMainItems] = React.useState([
    {
      label: "Naslovna",
      info: { path: "/" }
    },
    {
      label: "Torenti",
      info: {
        path: "/torrents",
        starts_with: "/torrents",
        should_bold: notifications.response.newTorrent
      }
    },
    {
      label: "Upload",
      info: { path: "/torrent/upload" }
    },
    {
      label: "Zahtevi",
      info: { path: "/requests", starts_with: "/request", }
    },
    {
      label: "Forum",
      info: {
        path: (
          notifications.response.newPost ? "/forum/unread" : "/forum"
        ),
        starts_with: "/forum",
        should_bold: notifications.response.newPost
      },
      children: [
        {
          label: "Nepročitane teme",
          info: { path: "/forum/unread" }
        },
        {
          label: "Forum",
          info: { path: "/forum" }
        }
      ]
    },
    {
      label: "Pravila",
      info: { path: "/rules-and-guides" }
    },
    {
      label: "Podrška",
      info: {
        path: "/support",
        should_bold: notifications.response.newSQ
      }
    },
    {
      label: "Donacije",
      info: { path: "/donate" }
    }
  ] as Array<NavItem>);

  const UserNavigationConfig = useCallback(
    (): Array<NavItem> => ([
      {
        label: "Privatne poruke",
        info: { path: "/pm/in" }
      },
      {
        label: "Profil",
        info: { path: `/profile/id/${(user !== undefined) ? user.id : 0}` }
      },
      {
        label: "Podešavanja",
        info: { path: "/preferences" }
      },
      {
        label: "Promeni temu",
        info: { callback: callback }
      },
      {
        label: "Odjavi se",
        info: { callback: Actions.Logout }
      }
    ]),
    [callback, user]
  );

  const IsNavItemActive = useCallback(
    (item: NavItem) => {
      const nav_item = item.info as ItemType;
      if (nav_item.callback)
        return false;

      if (nav_item.starts_with)
        return location.pathname.startsWith(nav_item.starts_with);

      return !!matchPath(location.pathname, { path: nav_item.path, exact: true });
    },
    [location]
  );

  const OnNavItemSelect = useCallback(
    (item: NavItem) => {
      const nav_item = item.info as ItemType;
      if (nav_item.callback)
        return nav_item.callback();

      if (history.location.pathname === nav_item.path)
        return;

      history.push(nav_item.path);
      setMainItems((state) => setItemActive(state, item));
    },
    [history]
  );

  const OnMainItemAuxClick = useCallback(
    (item: NavItem) => {
      const nav_item = item.info as ItemType;
      if (nav_item.callback)
        return nav_item.callback();

      window.open(nav_item.path, "_blank");
    },
    []
  );

  const CheckNotifications = useCallback(
    () => Actions.CheckNotifications(),
    []
  );

  useEffect(
    () => {
      const items = mainItems.slice();

      items.forEach((item) => {
        if (!item.info)
          return;

        // Don't work at Uber. Don't smoke crack. Don't burn your lips smoking crack.
        switch (item.label) {
        case "Torenti":
          item.info.should_bold = notifications.response.newTorrent;
          return;
        case "Forum":
          item.info.path = (
            notifications.response.newPost ? "/forum/unread" : "/forum"
          ),
          item.info.should_bold = notifications.response.newPost;
          return;
        case "Podrška":
          item.info.should_bold = notifications.response.newSQ;
          return;
        default: return;
        }
      });

      setMainItems(items);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notifications]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(CheckNotifications, []);

  // Run notification checker every 5 seconds
  // so we can send a request every NOTIFICATIONS_CHECK_INTERVAL +- 5s
  Helpers.useInterval(CheckNotifications, 5000);

  if (!user)
    return null;

  return (
    <Block
      as="header"
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            width: "100%",
            ...(
              $theme.name === "dark" ?
              {} :
              { boxShadow: "0 12px 24px -24px rgb(0, 0, 0, 0.4)" }
            )
          })
        }
      }}
    >
      <NavBar
        title={(
          <Link
            to="/"
            component={(props: LinkProps) => (
              <Block
                overrides={{
                  Block: { style: { lineHeight: "normal" } }
                }}
              >
                <Bold
                  $bold
                  onClick={props.navigate}
                  onAuxClick={(event) => {
                    if (event.button === 1) {
                      event.preventDefault();
                      window.open(props.href, "_blank");
                    }
                  }}
                >
                  ELITEUNITEDCREW
                </Bold>
                <Version>{PackageJSON.version}</Version>
              </Block>
            )}
          />
        )}
        isMainItemActive={IsNavItemActive}
        mainItems={mainItems}
        mapItemToNode={RenderItem}
        onMainItemSelect={OnNavItemSelect}
        onMainItemAuxClick={OnMainItemAuxClick}
        userItems={UserNavigationConfig()}
        onUserItemSelect={OnNavItemSelect}
        username={user.username}
        usernameSubtitle={user.class_name}
        userImgUrl={Helpers.GetUserAvatarURL(user)}
      />
      {notifications.response.newPM ? (
        <Notification
          overrides={{
            Body: { style: { width: "100%" } },
            InnerContainer: {
              style: {
                marginTop: 0,
                marginRight: "auto",
                marginBottom: 0,
                marginLeft: "auto"
              }
            }
          }}
        >
          <Link
            to="/pm/in"
            component={LinkAnchor}
          >
            Imate novu privatnu poruku!
          </Link>
        </Notification>
      ) : null}
      {notifications.response.newCommentOnMyTorrent.length !== 0 ? (
        <Notification
          kind="positive"
          overrides={{
            Body: { style: { width: "100%" } },
            InnerContainer: {
              style: {
                marginTop: 0,
                marginRight: "auto",
                marginBottom: 0,
                marginLeft: "auto"
              }
            }
          }}
        >
          Imate novi komentar na sledećim torentima:
          {notifications.response.newCommentOnMyTorrent.map((id) => (
            <>
              {' '}
              <Link
                key={id}
                to={`/torrent/${id}`}
                component={LinkAnchor}
              >
                {id}
              </Link>
            </>
          ))}
        </Notification>
      ) : null}
    </Block>
  );
};
