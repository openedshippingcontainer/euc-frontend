import React, { useState } from "react";

import { Checkbox } from "baseui/checkbox";
import { Tabs, Tab } from "baseui/tabs-motion";

import * as Helpers from "../../helpers";

export interface CategoryStateType {
  [key: string]: boolean;
}

const GetFilteredCategories = () => (
  Object.keys(Helpers.GroupedTorrentCategories)
    .filter((key) => Helpers.GroupedTorrentCategories[key].length !== 0)
);

export const GetInitialCategoriesState = (categories: Array<string>) => {
  if (categories.length === 0)
    return {};

  const state: CategoryStateType = {};
  Object.values(Helpers.GroupedTorrentCategories).forEach((category) => {
    category.forEach((entry) => {
      const id = (entry.id as number).toString();
      state[id] = (
        (categories.length !== 0) ? categories.includes(id) : false
      );
    })
  });

  return state;
}

interface Props {
  is_visible: boolean;
  on_change: (state: CategoryStateType) => void;
}

export const TorrentCategoryPicker = (
  { is_visible, on_change }: Props
) => {
  const [active_key, setActiveKey] = useState(GetFilteredCategories()[0]);
  const [categories, setCategories] = useState<CategoryStateType>({});

  if (!is_visible)
    return null;

  return (
    <Tabs
      fill="fixed"
      activateOnFocus
      activeKey={active_key}
      onChange={({ activeKey }) => setActiveKey(activeKey as string)}
    >
      {GetFilteredCategories().map((key) => (
        <Tab key={key} title={key}>
          {Helpers.GroupedTorrentCategories[key]
            .map((entry) => (
              <Checkbox
                key={entry.id}
                checked={categories[entry.id as string]}
                onChange={(event) => {
                  setCategories((state) => {
                    const new_state = {
                      ...state,
                      [entry.id as string]: event.currentTarget.checked
                    };

                    on_change(new_state);
                    return new_state;
                  });
                }}
              >
                {entry.name}
              </Checkbox>
          ))}
        </Tab>
      ))}
    </Tabs>
  );
};