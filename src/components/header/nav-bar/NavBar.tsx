import * as React from "react";

import {useStyletron} from "baseui";
import {Cell, Grid} from "baseui/layout-grid";
// @ts-ignore
// eslint-disable-next-line baseui/no-deep-imports
import {isFocusVisible} from "baseui/utils/focusVisible";

import MobileNav from "./MobileMenu";
import UserMenu from "./UserMenu";
import {
  StyledRoot,
  StyledSpacing,
  StyledPrimaryMenuContainer,
  StyledSubnavContainer,
  StyledSecondaryMenuContainer,
  StyledAppName,
  StyledMainMenuItem,
} from "./NavBarStyle";
import { defaultMapItemToNode, mapItemsActive } from "./Utils";

interface MainMenuItemProps {
  item: NavItem;
  kind?: NavItemKind;
  mapItemToNode: (item: NavItem) => React.ReactNode;
  onSelect: (item: NavItem) => void;
  onAuxClick: (item: NavItem) => void;
}

const MainMenuItem = ({
  item,
  kind = "primary",
  mapItemToNode,
  onSelect,
  onAuxClick
}: MainMenuItemProps) => {
  const [focusVisible, setFocusVisible] = React.useState(false);

  function handleFocus(event: React.FocusEvent) {
    if (isFocusVisible(event))
      setFocusVisible(true);
  }

  function handleBlur() {
    if (focusVisible)
      setFocusVisible(false);
  }

  function handleClick() {
    if (onSelect)
      onSelect(item);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && onSelect)
      onSelect(item);
  }

  return (
    <StyledMainMenuItem
      $active={item.active}
      $isFocusVisible={focusVisible}
      $kind={kind}
      aria-selected={item.active}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      onAuxClick={(event) => {
        if (event.button === 1 && onAuxClick) {
          event.preventDefault();
          onAuxClick(item);
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {mapItemToNode(item)}
    </StyledMainMenuItem>
  );
}

interface SecondaryMenuProps {
  items: Array<NavItem>;
  mapItemToNode: (item: NavItem) => React.ReactNode;
  onSelect: (item: NavItem) => void;
  onAuxClick: (item: NavItem) => void;
}

const SecondaryMenu = ({
  items, mapItemToNode, onSelect, onAuxClick
}: SecondaryMenuProps) => {
  return (
    <StyledSubnavContainer>
      <Grid>
        <Cell span={[0, 8, 12]}>
          <StyledSecondaryMenuContainer
            role="navigation"
            aria-label="Secondary navigation"
          >
            {items.map((item, index) => (
              // Replace with a menu item renderer
              <MainMenuItem
                mapItemToNode={mapItemToNode}
                item={item}
                kind="secondary"
                key={index}
                onSelect={onSelect}
                onAuxClick={onAuxClick}
              />
            ))}
          </StyledSecondaryMenuContainer>
        </Cell>
      </Grid>
    </StyledSubnavContainer>
  );
}

export function NavBar(props: NavBarProps) {
  const [css, theme] = useStyletron();
  const {
    title,
    mapItemToNode = defaultMapItemToNode,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMainItemSelect = () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMainItemAuxClick = () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onUserItemSelect = () => {},
    userItems = [],
    username,
    usernameSubtitle,
    userImgUrl,
  } = props;

  const mainItems = React.useMemo(() => {
    if (props.isMainItemActive) {
      return mapItemsActive(props.mainItems || [], props.isMainItemActive);
    }
    return props.mainItems || [];
  }, [props.mainItems, props.isMainItemActive]);

  let secondaryMenu;
  let desktopSubNavPosition = "horizontal";
  let mobileSubNavPosition = "vertical";

  return (
    <StyledRoot data-baseweb="app-nav-bar">
      {/* Mobile Nav Experience */}
      <div
        className={css({
          [`@media screen and (min-width: ${theme.breakpoints.large}px)`]: {
            display: "none",
          },
        })}
      >
        <Grid>
          <Cell span={[4, 8, 0]}>
            <StyledSpacing>
              {mainItems.length || userItems.length ? (
                <MobileNav {...props} />
              ) : null}
              <StyledAppName>{title}</StyledAppName>
            </StyledSpacing>
          </Cell>
        </Grid>

        {(secondaryMenu && mobileSubNavPosition === "horizontal") ? (
          <SecondaryMenu
            items={secondaryMenu}
            mapItemToNode={mapItemToNode}
            onSelect={onMainItemSelect}
            onAuxClick={onMainItemAuxClick}
          />
        ) : null}
      </div>

      {/* Desktop Nav Experience */}
      <div
        className={css({
          [`@media screen and (max-width: ${theme.breakpoints.large - 1}px)`]: {
            display: "none",
          },
        })}
      >
        <Grid gridMargins={16} gridGutters={[0, 16]}>
          <Cell span={[0, 3, 3]}>
            <StyledSpacing>
              {/* Replace with a Logo renderer */}
              <StyledAppName>{title}</StyledAppName>
            </StyledSpacing>
          </Cell>
          <Cell span={userItems.length ? [0, 4, 8] : [0, 5, 9]}>
            <StyledPrimaryMenuContainer
              role="navigation"
              aria-label="Main navigation"
            >
              {mainItems.map((item, index) => {
                // For an active top level menu get the secondary navigation and its positioning
                if (item.active && item.children && item.children.length) {
                  secondaryMenu = item.children;
                  if (item.navPosition) {
                    desktopSubNavPosition =
                      item.navPosition.desktop || desktopSubNavPosition;
                    mobileSubNavPosition =
                      item.navPosition.mobile || mobileSubNavPosition;
                  }
                }
                return (
                  <MainMenuItem
                    item={item}
                    key={index}
                    mapItemToNode={mapItemToNode}
                    onSelect={onMainItemSelect}
                    onAuxClick={onMainItemAuxClick}
                  />
                );
              })}
            </StyledPrimaryMenuContainer>
          </Cell>
          {userItems.length ? (
            <Cell span={[0, 1, 1]}>
              <StyledSpacing>
                <UserMenu
                  mapItemToNode={mapItemToNode}
                  onUserItemSelect={onUserItemSelect}
                  onMainItemAuxClick={onMainItemAuxClick}
                  username={username}
                  usernameSubtitle={usernameSubtitle}
                  userImgUrl={userImgUrl}
                  userItems={userItems}
                />
              </StyledSpacing>
            </Cell>
          ) : null}
        </Grid>
        {(secondaryMenu && desktopSubNavPosition === "horizontal") ? (
          <SecondaryMenu
            items={secondaryMenu}
            mapItemToNode={mapItemToNode}
            onSelect={onMainItemSelect}
            onAuxClick={onMainItemAuxClick}
          />
        ) : null}
      </div>
    </StyledRoot>
  );
}
