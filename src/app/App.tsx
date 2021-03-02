import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { ErrorBoundary } from "react-error-boundary";
import {
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary
} from "react-query";
// import Snowfall from "react-snowfall";

import {
  BaseProvider,
  LocaleProvider
} from "baseui";
import { Block } from "baseui/block";
import { ToasterContainer } from "baseui/toast";

import { Header } from "../components/header";
import { PageLoading } from "../components/PageLoading";
import { ScrollToTopComponent } from "../components/ScrollToTopComponent";
import { ErrorFallbackComponent } from "../components/ErrorFallbackComponent";

import { RootStateType } from "../reducers";
import * as Helpers from "../helpers";

import { DraftContext } from "./DraftContext";
import { ThemeContext } from "./ThemeContext";
import { SerbianLocale } from "./SerbianLocale";
import { LightTheme, DarkTheme } from "./Themes";
// import { SnowflakeContext } from "./SnowflakeContext";
import { PreferencesContext } from "./PreferencesContext";
import { UnauthorizedRoutes, AuthorizedRoutes } from "./Routes";

const LoadDefaultState = () => {
  const forum_drafts = localStorage.getItem("forum_drafts");
  if (forum_drafts) {
    const initial_state = JSON.parse(forum_drafts);
    DraftContext.set(initial_state);
  }

  /*const snowflakes = localStorage.getItem("snowflakes");
  if (snowflakes) {
    const initial_state = JSON.parse(snowflakes);
    SnowflakeContext.set(initial_state);
  }*/
  const preferences = localStorage.getItem("preferences");
  if (preferences) {
    const initial_state = JSON.parse(preferences);
    PreferencesContext.set(initial_state);
  }

  const theme = localStorage.getItem("theme") ?? "dark";
  ThemeContext.set(theme === "dark" ? "dark" : "light");
}

const IsRouteExact = (inexact?: boolean) => (
  (inexact === undefined) ? true : inexact
);

const engine = new Styletron();

const query_client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15000,
      retry: 1,
      useErrorBoundary: true,
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  }
});

LoadDefaultState();

export const App = () => {
  const auth = useSelector((state: RootStateType) => (state.auth));
  const { reset } = useQueryErrorResetBoundary();

  const [theme, setTheme] = ThemeContext.use();
  // const snowflake_config = SnowflakeContext.useValue();

  const SwitchTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const is_staff = Helpers.IsUserStaff(auth.user);
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={theme === "dark" ? DarkTheme : LightTheme}>
        <LocaleProvider locale={SerbianLocale}>
          <QueryClientProvider client={query_client}>
            <Block
              display="block"
              color="contentPrimary"
              backgroundColor="backgroundPrimary"
              maxWidth="100vw"
              minHeight="100vh"
              marginTop="0"
              marginRight="auto"
              marginBottom="0"
              marginLeft="auto"
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    scrollbarColor: `${
                      $theme.colors.backgroundTertiary
                    } ${
                      $theme.colors.backgroundSecondary
                    }`
                  })
                }
              }}
            >
              <ErrorBoundary
                onReset={reset}
                fallbackRender={ErrorFallbackComponent}
              >
                <ToasterContainer autoHideDuration={4500}>
                {!auth.is_authenticated ? (
                  <React.Suspense fallback={<PageLoading />}>
                    <Switch>
                      {UnauthorizedRoutes.map((route) => (
                        <Route
                          key={"unauth" + route.path + (route.inexact ? "inexact" : "exact")}
                          path={route.path}
                          component={route.component}
                          exact={IsRouteExact(route.inexact)}
                        />
                      ))}
                    </Switch>
                  </React.Suspense>
                ) : (
                  <>
                    <Header callback={SwitchTheme} />
                    <React.Suspense fallback={<PageLoading />}>
                      <Block
                        marginTop="0"
                        marginRight="auto"
                        marginBottom="0"
                        marginLeft="auto"
                        maxWidth="1600px"
                      >
                        <Switch>
                          {AuthorizedRoutes.map((route) => (
                            <Route
                              key={
                                "auth" +
                                route.path +
                                (route.inexact ? "inexact" : "exact")
                              }
                              path={route.path}
                              component={
                                (is_staff && route.staff_component) ?
                                route.staff_component :
                                route.component
                              }
                              exact={IsRouteExact(route.inexact)}
                            />
                          ))}
                        </Switch>
                      </Block>
                      <ScrollToTopComponent />
                    </React.Suspense>
                  </>
                )}
                </ToasterContainer>
                {/*snowflake_config.enabled ? (
                  <Snowfall
                    color={snowflake_config.color}
                    snowflakeCount={snowflake_config.count}
                    style={{ position: "fixed" }}
                  />
                ) : null*/}
              </ErrorBoundary>
            </Block>
          </QueryClientProvider>
        </LocaleProvider>
      </BaseProvider>
    </StyletronProvider>
  );
};