import React from "react";

import { Button } from "baseui/button";
import { Drawer, ANCHOR } from "baseui/drawer";
import { Menu, ArrowLeft } from "baseui/icon";
import {
  MenuAdapter,
  ListItemLabel,
  ARTWORK_SIZES
} from "baseui/list";
import { StatefulMenu } from "baseui/menu";

import {
  StyledSideMenuButton,
  StyledUserMenuProfileListItem,
} from "./NavBarStyle";
import UserProfileTile from "./UserProfileTile";
import { defaultMapItemToNode } from "./Utils";

interface MobileNavMenuItemProps {
  item: NavItem;
  mapItemToNode?: (item: NavItem) => React.ReactNode;
}

const MobileNavMenuItem = React.forwardRef<unknown, MobileNavMenuItemProps>(
  function RenderMobileNavMenuItem(props: MobileNavMenuItemProps, ref) {
    const {
      item,
      mapItemToNode = defaultMapItemToNode,
      ...restProps
    } = props;

    if (item.parentMenuItem) {
      return (
        <MenuAdapter
          {...restProps}
          // @ts-ignore
          ref={ref}
          artwork={item.navExitIcon || ArrowLeft}
          artworkSize={ARTWORK_SIZES.LARGE}
        >
          <ListItemLabel>{item.label}</ListItemLabel>
        </MenuAdapter>
      );
    }

    if (item.userTitleItem) {
      // Replace with a user menu item renderer
      return (
        <StyledUserMenuProfileListItem
          {...restProps}
          ref={ref}
        >
          {/* @ts-ignore */}
          <UserProfileTile {...item.item} />
        </StyledUserMenuProfileListItem>
      );
    }

    return (
      // Replace with a main menu item renderer
      <MenuAdapter
        {...restProps}
        // @ts-ignore
        ref={ref}
        artwork={item.icon || null}
        artworkSize={ARTWORK_SIZES.LARGE}
      >
        <ListItemLabel>{mapItemToNode(item)}</ListItemLabel>
      </MenuAdapter>
    );
  }
);

export default function MobileMenu(props: NavBarProps) {
  const {
    mainItems = [],
    userItems = [],
    mapItemToNode,
    ...rest
  } = props;

  const items: Array<NavItem> = [
    ...(!userItems.length ?
      [] :
      [
        {
          item: { ...rest },
          label: props.username,
          userTitleItem: true,
          children: userItems.map((item) => ({
            ...item,
            userMenuItem: true,
          }))
        } as NavItem
      ]
    ),
    ...mainItems,
  ];

  const [isOpen, setIsOpen] = React.useState(false);
  const [currentNavItems, setCurrentNavItems] = React.useState(items);
  const [ancestorNavItems, setAncestorNavItems] = React.useState<Array<NavItem>>([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        onClick={toggleMenu}
        overrides={{
          BaseButton: { component: StyledSideMenuButton }
        }}
      >
        <Menu size="24px" />
      </Button>
      <Drawer
        anchor={ANCHOR.left}
        isOpen={isOpen}
        onClose={toggleMenu}
        size="75%"
        overrides={{
          DrawerBody: {
            style: ({
              marginTop: "0px",
              marginBottom: "0px",
              marginLeft: "0px",
              marginRight: "0px",
            }),
          },
          // Removes the close icon from the drawer
          Close: () => null,
        }}
      >
        <StatefulMenu
          items={currentNavItems}
          onItemSelect={({item}) => {
            if (item.PARENT_MENU_ITEM) {
              // Remove current parent item selected to return to
              // from the ancestors list (`ancestorNavItems[ancestorArrLength - 1]`)
              const updatedAncestorNavItems = ancestorNavItems.slice(
                0,
                ancestorNavItems.length - 1,
              );
              const isTopLevel = !updatedAncestorNavItems.length;
              if (isTopLevel) {
                // Set to the initial `navItems` value
                setCurrentNavItems(items);
              } else {
                const newParentItem: NavItem = {
                  ...updatedAncestorNavItems[
                    updatedAncestorNavItems.length - 1
                  ],
                  parentMenuItem: true,
                };
                setCurrentNavItems([
                  newParentItem,
                  ...(newParentItem.children || [])
                ]);
              }
              setAncestorNavItems(updatedAncestorNavItems);
              return;
            }

            if (item.USER_MENU_ITEM && props.onUserItemSelect) {
              props.onUserItemSelect(item);
            } else if (!item.USER_TITLE_ITEM && props.onMainItemSelect) {
              props.onMainItemSelect(item);
            }

            if (item.children && item.children.length) {
              const parentItem: NavItem = {...item, parentMenuItem: true};
              setAncestorNavItems([...ancestorNavItems, item]);
              setCurrentNavItems([parentItem, ...item.children]);
              return;
            }
            toggleMenu();
          }}
          overrides={{
            List: {
              style: {
                paddingTop: "0",
                paddingBottom: "0",
                minHeight: "100vh",
                boxShadow: "none",
              },
            },
            ListItem(listItemProps) {
              return (
                <MobileNavMenuItem
                  {...listItemProps}
                  mapItemToNode={mapItemToNode}
                />
              );
            },
          }}
        />
      </Drawer>
    </>
  );
}
