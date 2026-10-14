import { createBrowserRouter } from "react-router-dom";
import RootLayout, { AuthLayout } from "../layouts/RootLayout";
import RequireAuth from "../components/RequireAuth";
import NotFoundPage from "../pages/NotFoundPage";
import LandingPage from "../pages/LandingPage";
import EventDetailPage from "../pages/EventDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ConfirmationPage from "../pages/ConfirmationPage";
import MyTicketsPage from "../pages/MyTicketsPage";
import AccountLayout from "../pages/AccountLayout";
import AccountProfilePage from "../pages/AccountProfilePage";
import AccountNotificationsPage from "../pages/AccountNotificationsPage";
import RegistrationPage from "../Pages/RegistrationPage";
import ExplorePage from "../Pages/ExplorePage";
import TicketDetailPage from "../Pages/TicketDetailPage";
import AccountHistoryPage from "../Pages/AccountHistoryPage";

// Role "user". Rute admin dan owner event ditambahkan setelah desainnya diiris.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "events", element: <ExplorePage /> },
      { path: "events/:id", element: <EventDetailPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "events/:id/register", element: <RegistrationPage /> },
          {
            path: "registrations/:orderNo/success",
            element: <ConfirmationPage />,
          },
          { path: "my-tickets", element: <MyTicketsPage /> },
          { path: "tickets/:orderNo", element: <TicketDetailPage /> },
          {
            path: "account",
            element: <AccountLayout />,
            children: [
              { index: true, element: <AccountProfilePage /> },
              { path: "notifikasi", element: <AccountNotificationsPage /> },
              { path: "riwayat", element: <AccountHistoryPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
