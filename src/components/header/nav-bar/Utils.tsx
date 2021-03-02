export function defaultMapItemToNode(item: NavItem) {
  if (process.env.NODE_ENV !== "production") {
    if (!item.label) {
      throw Error(
        "There needs to be an unique item.label. You can implement a custom mapping with the mapItemToNode prop.",
      );
    }
  }
  return item.label;
}

function defaultGetUniqueIdentifier(item: NavItem) {
  if (process.env.NODE_ENV !== "production") {
    if (!item.label) {
      throw Error(
        "There needs to be an unique item.label. You can implement a custom mapping with the getUniqueIdentifier argument to setItemActive.",
      );
    }
  }
  return item.label;
}

export function mapItemsActive(
  items: Array<NavItem>,
  predicate: (item: NavItem) => boolean,
) {
  return items.map<NavItem>(current => {
    if (predicate(current)) {
      current.active = true;
    } else {
      current.active = false;
    }

    if (current.children) {
      current.children = mapItemsActive(current.children, predicate);
      if (current.children.some((child) => child.active))
        current.active = true;
    }

    return current;
  });
}

export function setItemActive(
  items: Array<NavItem>,
  item: NavItem,
  getUniqueIdentifier = defaultGetUniqueIdentifier,
) {
  return mapItemsActive(
    items,
    current => getUniqueIdentifier(current) === getUniqueIdentifier(item),
  );
}
