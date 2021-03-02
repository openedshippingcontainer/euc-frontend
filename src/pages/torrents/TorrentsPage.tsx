import React, { useState, useRef, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import { withStyle } from "baseui";
import { Input } from "baseui/input";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
import { Search, TriangleUp, TriangleDown } from "baseui/icon";

import { ResetIcon } from "../../components/icons";
import { PageTitle } from "../../components/PageTitle";
import { ElevatedPanel } from "../../components/ElevatedPanel";
import {
  ContentWrapper,
  CenteredLayout
} from "../../components/ContentWrapper";

import * as Api from "../../api";
import * as Helpers from "../../helpers";

import { TorrentTable } from "./TorrentTable";
import {
  TorrentCategoryPicker,
  CategoryStateType,
  GetInitialCategoriesState
} from "./TorrentCategoryPicker";
import { PreferencesContext } from "../../app/PreferencesContext";

const DEFAULT_SORT_COLUMN = "added";
const DEFAULT_SORT_ORDER = "DESC";

const DropdownContainer = withStyle(CenteredLayout, ({ $theme, $marginBottom }: any) => ({
  cursor: "pointer",
  width: "100%",
  marginTop: $theme.sizing.scale300,
  ...($marginBottom ? { marginBottom: $theme.sizing.scale300 } : {}),
  userSelect: "none",
  ":hover": {
    backgroundColor: $theme.colors.backgroundTertiary
  }
}));

const GetURLWithSlug = (
  page: number,
  sort_column: string,
  sort_order: string,
  search_query: string | null,
  categories: Array<string>
) => {
  const parameters = new URLSearchParams();

  // Craft categories parameter
  categories.forEach((category) => parameters.append("c", category));

  // Decode already encoded URI, since encodeURI will be called later
  // If we don't do it, then some symbols will unfortunately get double encoded
  const query = decodeURIComponent(parameters.toString());
  const additional = (query.length !== 0) ? `?${query}` : "";
  return (
    `/torrents/${page}/${sort_column}/${sort_order}${search_query ? `/${search_query}` : ""}${additional}`
  );
};

interface ParamsType {
  page?: string;
  sort_column?: string;
  sort_order?: string;
  search_query?: string;
}

const CategoriesAsArray = (categories: CategoryStateType) => {
  const arr: Array<string> = [];
  Object.keys(categories).forEach((key) => {
    if (categories[key])
      arr.push(key);
  });

  return arr;
}

const IsSomeCategoryApplied = (categories: CategoryStateType) => (
  Object.values(categories).find((value) => (value === true))
);

const GetCategoriesFromURL = () => {
  const search_params = new URLSearchParams(location.search);
  return GetInitialCategoriesState(search_params.getAll("c"));
}

const IsDefaultState = (params: ParamsType) => (
  params.page === "1" &&
  params.sort_column === DEFAULT_SORT_COLUMN &&
  params.sort_order === DEFAULT_SORT_ORDER &&
  params.search_query === undefined &&
  !IsSomeCategoryApplied(GetCategoriesFromURL())
);

const TorrentsPage = () => {
  const history = useHistory();
  const params = useParams<ParamsType>();
  const input_ref = useRef<HTMLInputElement | null>(null);

  const [show_categories, setShowCategories] = useState(false);

  const current_page = +(params.page || 1);
  const current_sort_column = params.sort_column || DEFAULT_SORT_COLUMN;
  const current_sort_order = params.sort_order || DEFAULT_SORT_ORDER;
  const current_search_query = params.search_query || null;

  const {
    data: torrents,
    isError,
    isFetching,
    refetch
  } = useQuery(
    [
      "torrents",
      current_page,
      current_sort_column,
      current_sort_order,
      current_search_query
    ],
    () => {
      window.scrollTo(0, 0);

      return Api.FetchOrderedTorrents(
        current_page - 1,
        current_sort_column,
        current_sort_order,
        current_search_query,
        CategoriesAsArray(GetCategoriesFromURL())
      ).then((response) => {
        Helpers.FillFakeUser(response.content, "uploaderInfo");
        if (!PreferencesContext.get().showRobotTorrents) {
          response.content = response.content.filter((torrent) => (
            torrent.uploaderInfo.username !== "robot"
          ));
        }
        return response;
      });
    }
  );

  const OnPageChange = useCallback(
    (args: { nextPage: number }) => {
      history.replace(
        GetURLWithSlug(
          args.nextPage,
          current_sort_column,
          current_sort_order,
          current_search_query,
          CategoriesAsArray(GetCategoriesFromURL())
        )
      );
    },
    [current_search_query, current_sort_column, current_sort_order, history]
  );

  const OnSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!input_ref || !input_ref.current)
        return;

      const categories = GetCategoriesFromURL();
      if (input_ref.current.value.length < 2 && !IsSomeCategoryApplied(categories))
        return;

      history.replace(
        GetURLWithSlug(
          1,
          DEFAULT_SORT_COLUMN,
          DEFAULT_SORT_ORDER,
          input_ref.current.value,
          CategoriesAsArray(categories)
        )
      );

      refetch();
    },
    [history, refetch]
  );

  const OnSort = useCallback(
    (next_sort_column: string) => {
      let next_sort_order = "DESC";
      if (current_sort_column === next_sort_column && current_sort_order === "DESC")
        next_sort_order = "ASC";

      return history.replace(
        GetURLWithSlug(
          1,
          next_sort_column,
          next_sort_order,
          current_search_query,
          CategoriesAsArray(GetCategoriesFromURL())
        )
      );
    },
    [current_search_query, current_sort_column, current_sort_order, history]
  );

  const OnCategoriesStateChange = useCallback(
    (state: CategoryStateType) => {
      history.replace(
        GetURLWithSlug(
          current_page,
          current_sort_column,
          current_sort_order,
          current_search_query,
          CategoriesAsArray(state)
        )
      );
    },
    [current_page, current_search_query, current_sort_column, current_sort_order, history]
  );

  const OnResetClick = useCallback(
    () => {
      history.replace(
        GetURLWithSlug(
          1,
          DEFAULT_SORT_COLUMN,
          DEFAULT_SORT_ORDER,
          null,
          []
        )
      );

      refetch();
    },
    [history, refetch]
  );

  const ToggleCategoriesContainer = useCallback(
    () => setShowCategories((state) => !state),
    []
  );

  return (
    <ContentWrapper width={4}>
      <Grid
        behavior={BEHAVIOR.fluid}
        gridMargins={0}
      >
        <Cell span={12}>
          <Block display="flex">
            <PageTitle>Najnoviji torenti</PageTitle>
            <Block
              display="inline-block"
              marginTop="auto"
              marginRight="0"
              marginBottom="auto"
              marginLeft="auto"
            >
              <Button
                kind="secondary"
                size="compact"
                startEnhancer={() => <ResetIcon />}
                disabled={IsDefaultState(params)}
                onClick={OnResetClick}
              >
                Resetuj
              </Button>
            </Block>
          </Block>
        </Cell>
        <Cell span={12}>
          <ElevatedPanel>
            <form onSubmit={OnSearch}>
              <Block display="flex">
                <Input
                  clearable
                  placeholder="Unesite pojam za pretragu..."
                  inputRef={input_ref}
                  startEnhancer={() => <Search size={20} />}
                />
                <Button
                  type="submit"
                  overrides={{
                    Root: {
                      style: ({ $theme }) => ({
                        marginLeft: $theme.sizing.scale200
                      })
                    }
                  }}
                >
                  Pretraži
                </Button>
              </Block>
            </form>
            <DropdownContainer
              $marginBottom={!show_categories}
              onClick={ToggleCategoriesContainer}
            >
              {!show_categories ? (
                <TriangleDown size={32} />
              ) : (
                <TriangleUp size={32} />
              )}
            </DropdownContainer>
            <TorrentCategoryPicker
              is_visible={show_categories}
              on_change={OnCategoriesStateChange}
            />
            <TorrentTable
              torrents={torrents}
              is_loading={isFetching}
              error={isError}
              sort_order={current_sort_order as "ASC" | "DESC"}
              sort_column={current_sort_column}
              on_sort={OnSort}
              page={current_page}
              on_page_change={OnPageChange}
            />
          </ElevatedPanel>
        </Cell>
      </Grid>
    </ContentWrapper>
  );
};

export default TorrentsPage;