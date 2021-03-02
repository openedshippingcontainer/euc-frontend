type NavItemKind = "primary" | "secondary";
type NavItemPosition = "horizontal" | "vertical";

interface NavItem {
  active?: boolean;
  icon?: React.ComponentType<any>;
  info?: any;
  // Internal property -- do not use atm.
  item?: React.ReactNode;
  label: string;
  children?: Array<NavItem>;
  navExitIcon?: React.ComponentType<any>;
  navPosition?: {
    desktop?: NavItemPosition;
    mobile?: NavItemPosition;
  };
  // Internal types -- do not use
  userTitleItem?: boolean;
  userMenuItem?: boolean;
  parentMenuItem?: boolean;
}

interface UserMenuProps {
  userItems?: Array<NavItem>;
  username?: string;
  usernameSubtitle?: React.ReactNode;
  userImgUrl?: string;
  onUserItemSelect?: (item: NavItem) => void;
  onMainItemAuxClick?: (item: NavItem) => void;
  mapItemToNode?: (item: NavItem) => React.ReactNode;
}

interface NavBarProps extends UserMenuProps {
  isMainItemActive?: (item: NavItem) => boolean;
  mainItems?: Array<NavItem>;
  onMainItemSelect?: (item: NavItem) => void;
  title?: React.ReactNode;
}