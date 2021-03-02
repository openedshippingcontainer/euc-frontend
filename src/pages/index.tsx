import React from "react";

// Mostly unused routes
export const DonatePage = React.lazy(() => import("./DonatePage"));
export const RulesAndGuidesPage = React.lazy(() => import("./RulesAndGuidesPage"));

export const HomePage = React.lazy(() => import("./HomePage"));
export const NotFoundPage = React.lazy(() => import("./NotFoundPage"));
export const ProfilePage = React.lazy(() => import("./ProfilePage"));
export const SupportPage = React.lazy(() => import("./SupportPage"));
export const PrivateMessagesPage = React.lazy(() => import("./PrivateMessagesPage"));
export const PreferencesPage = React.lazy(() => import("./PreferencesPage"));
export const PollsPage = React.lazy(() => import("./PollsPage"));
export const PreviousDayVisitorsPage = React.lazy(() => import("./PreviousDayVisitorsPage"));

export * from "./auth";
export * from "./forums";
export * from "./torrents";
export * from "./requests";

import * as Staff from "./staff";
export { Staff };
