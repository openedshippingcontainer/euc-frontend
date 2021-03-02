import React from "react";
import { Link } from "react-router-dom";

import { Breadcrumbs } from "baseui/breadcrumbs";

import { LinkAnchor } from "../../components/LinkAnchor";

import * as Helpers from "../../helpers";

interface Props {
  category: CategoryDTO;
}

export const TorrentCategoryBreadcrumbs = ({ category }: Props) => {
  const category_parent = Helpers.GetTorrentCategoryKey(
    category.id
  );
  const category_slug = Helpers.GetTorrentCategorySlug(
    category_parent
  );
  const category_name = Helpers.GetTorrentCategory(
    category.id,
    category_parent
  );

  if (category_parent === undefined || category_name === undefined)
    return null;

  return (
    <Breadcrumbs
      overrides={{
        ListItem: {
          style: ({ $theme }) => ({
            ...$theme.typography.LabelSmall
          })
        }
      }}
    >
      <Link
        to="/torrents/1/added/DESC"
        component={LinkAnchor}
      >
        Torenti
      </Link>
      <Link
        to={`/torrents/1/added/DESC${category_slug}`}
        component={LinkAnchor}
      >
        {category_parent}
      </Link>
      <Link
        to={`/torrents/1/added/DESC?c=${category_name.id}`}
        component={LinkAnchor}
      >
        {category_name.name}
      </Link>
    </Breadcrumbs>
  );
}