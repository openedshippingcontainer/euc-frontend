import * as Pages from "../pages";

interface NavigationRouteObject {
  path?: string;
  component: any;
  staff_component?: any;
  inexact?: boolean;
}

export const UnauthorizedRoutes: Array<NavigationRouteObject> = [
  {
    path: "/register",
    component: Pages.RegisterPage
  },
  {
    path: "/register/confirm/:id/:hash",
    component: Pages.RegisterConfirmPage
  },
  {
    path: "/recover",
    component: Pages.RecoverAccountPage
  },
  {
    path: "/recover/email",
    component: Pages.RecoverAccountEmailPage
  },
  {
    path: "/recover/confirm/:id/:hash",
    component: Pages.RecoverAccountConfirmPage
  },
  {
    // Fallback route
    component: Pages.LoginPage,
    inexact: true
  }
];

export const AuthorizedRoutes: Array<NavigationRouteObject> = [
  {
    // This is a bilateral route
    // NOTE: Page parameter only used in staff route
    path: "/support/:page?",
    component: Pages.SupportPage,
    staff_component: Pages.Staff.SupportPage
  },
  {
    path: "/reset/email",
    component: null,
    staff_component: Pages.Staff.ResetUserEmailPage
  },
  {
    path: "/donate",
    component: Pages.DonatePage,
  },
  {
    path: "/rules-and-guides",
    component: Pages.RulesAndGuidesPage
  },
  {
    path: "/pm/:section/:page?/:search?",
    component: Pages.PrivateMessagesPage
  },
  {
    path: "/forum",
    component: Pages.ForumPage
  },
  {
    path: "/forum/unread",
    component: Pages.ForumUnreadPage
  },
  {
    path: "/forum/new/topic/:id",
    component: Pages.ForumNewTopicPage
  },
  {
    path: "/forum/category/:id/:page?",
    component: Pages.ForumCategoryPage
  },
  {
    path: "/forum/topic/:id/:page?",
    component: Pages.ForumTopicPage
  },
  {
    path: "/torrent/upload",
    component: Pages.TorrentUploadPage
  },
  {
    path: "/torrent/:id/:page?",
    component: Pages.TorrentDetailsPage
  },
  {
    path: "/torrents/:page?/:sort_column?/:sort_order?/:search_query?",
    component: Pages.TorrentsPage
  },
  {
    path: "/request/:id",
    component: Pages.RequestDetailsPage
  },
  {
    path: "/requests/new",
    component: Pages.NewRequestPage
  },
  {
    path: "/requests",
    component: Pages.RequestsPage
  },
  {
    path: "/previous-day-visitors",
    component: Pages.PreviousDayVisitorsPage
  },
  {
    path: "/polls/:class/:page?",
    component: Pages.PollsPage
  },
  {
    path: "/preferences",
    component: Pages.PreferencesPage
  },
  {
    path: "/profile/id/:id",
    component: Pages.ProfilePage
  },
  {
    path: "/profile/username/:username",
    component: Pages.ProfilePage
  },
  {
    path: "/",
    component: Pages.HomePage
  },
  {
    // Fallback route
    component: Pages.NotFoundPage,
    inexact: true
  }
];
