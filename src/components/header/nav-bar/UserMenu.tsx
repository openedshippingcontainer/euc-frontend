import React from "react";

import { Avatar } from "baseui/avatar";
import { Button } from "baseui/button";
import { ChevronDown, ChevronUp } from "baseui/icon";
import { StatefulMenu, StyledList } from "baseui/menu";
import {
  ListItem,
  ListItemLabel,
  MenuAdapterPropsT,
  ARTWORK_SIZES
} from "baseui/list";
import { StatefulPopover, PLACEMENT, TRIGGER_TYPE } from "baseui/popover";

import {
  StyledUserMenuButton,
  StyledUserMenuProfileListItem,
} from "./NavBarStyle";
import UserProfileTile from "./UserProfileTile";
import { defaultMapItemToNode } from "./Utils";

const MENU_ITEM_WIDTH = "250px";

type CustomMenuAdapterProps = MenuAdapterPropsT & {
  onAuxClick: (event: React.MouseEvent<HTMLLIElement>) => void;
};

const MenuAdapter = React.forwardRef<
  HTMLLIElement,
  CustomMenuAdapterProps
>(
  function RenderCustomMenuAdapter(props: CustomMenuAdapterProps, ref) {
    return (
      <ListItem
        // @ts-ignore
        ref={ref}
        sublist={props.sublist || props.$size === "compact"}
        artwork={props.artwork}
        artworkSize={props.artworkSize}
        endEnhancer={props.endEnhancer}
        overrides={{
          Root: {
            props: {
              onMouseEnter: props.onMouseEnter,
              onClick: props.onClick,
              onAuxClick: props.onAuxClick
            },
            // @ts-ignore
            style: ({ $theme }) => ({
              height: $theme.sizing.scale1400,
              backgroundColor: props.$isHighlighted
                ? $theme.colors.menuFillHover
                : null,
              cursor: props.$disabled ? "not-allowed" : "pointer",
            }),
          },
          Content: {
            style: ({ $theme }) => ({
              height: $theme.sizing.scale1400,
              paddingRight: "0",
              marginRight: $theme.sizing.scale600
            })
          }
        }}
      >
        {props.children}
      </ListItem>
    );
  },
);

interface UserMenuListItemProps {
  item: NavItem;
  mapItemToNode?: (item: NavItem) => React.ReactNode;
  onMainItemAuxClick?: (item: NavItem) => void;
  close: () => void;
}

const UserMenuListItem = React.forwardRef<unknown, UserMenuListItemProps>(
  function RenderUserMenuListItem(props: UserMenuListItemProps, ref) {
    const {
      item,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onMainItemAuxClick = () => {},
      close,
      mapItemToNode = defaultMapItemToNode
    } = props;
    // Replace with a user menu item renderer
    return (
      <MenuAdapter
        {...props}
        // @ts-ignore
        ref={ref}
        artwork={item.icon || null}
        artworkSize={ARTWORK_SIZES.LARGE}
        onAuxClick={() => {
          onMainItemAuxClick(item);
          close();
        }}
      >
        <ListItemLabel>{mapItemToNode(item)}</ListItemLabel>
      </MenuAdapter>
    );
  }
);

export default function UserMenuComponent(props: UserMenuProps) {
  // isOpen is used for displaying different arrow icons in open or closed state
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    userItems = [],
    username,
    userImgUrl,
    usernameSubtitle,
    mapItemToNode,
    onMainItemAuxClick
  } = props;

  return (
    <StatefulPopover
      content={({ close }) => (
        <StatefulMenu
          items={userItems}
          onItemSelect={({ item }) => {
            if (props.onUserItemSelect)
              props.onUserItemSelect(item);
            close();
          }}
          overrides={{
            List: {
              component: React.forwardRef(
                function RenderUserMenuList({ children, ...restProps }: any, ref) {
                  return (
                    <StyledList {...restProps} ref={ref}>
                      <StyledUserMenuProfileListItem>
                        {/* Replace with a renderer: renderUserProfileTile() */}
                        <UserProfileTile
                          username={username}
                          usernameSubtitle={usernameSubtitle}
                          userImgUrl={userImgUrl}
                        />
                      </StyledUserMenuProfileListItem>
                      {children}
                    </StyledList>
                  );
                }
              ),
              style: { width: MENU_ITEM_WIDTH }
            },
            ListItem: React.forwardRef<any, any>(
              function ListItemForwardRef(listItemProps, ref) {
                return (
                  <UserMenuListItem
                    {...listItemProps}
                    ref={ref}
                    close={close}
                    mapItemToNode={mapItemToNode}
                    onMainItemAuxClick={onMainItemAuxClick}
                  />
                );
              }
            ),
          }}
        />
      )}
      dismissOnEsc={true}
      dismissOnClickOutside={true}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      placement={PLACEMENT.bottomRight}
      popperOptions={{modifiers: {flip: {enabled: false}}}}
      triggerType={TRIGGER_TYPE.click}
    >
      <Button
        overrides={{
          BaseButton: { component: StyledUserMenuButton }
        }}
      >
        <Avatar name={username || ""} src={userImgUrl} size={"32px"} />
        {isOpen ? (
          <ChevronUp
            size={28}
            overrides={{
              Svg: {
                style: ({ $theme }) => ({
                  paddingLeft: $theme.sizing.scale200
                })
              }
            }}
          />
        ) : (
          <ChevronDown
            size={28}
            overrides={{
              Svg: {
                style: ({ $theme }) => ({
                  paddingLeft: $theme.sizing.scale200
                })
              }
            }}
          />
        )}
      </Button>
    </StatefulPopover>
  );
}
