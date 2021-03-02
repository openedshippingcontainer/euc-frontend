type RefType = string | ((instance: HTMLAnchorElement | null) => void) | React.RefObject<HTMLAnchorElement> | null | undefined;

interface LinkProps extends React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> {
  innerRef: RefType;
  $style?: StyleObject;
  onClick?: ((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void);
  navigate: () => void;
  target?: "_self" | "_blank" | "_parent" | "_top";
}