import { createBrowserRouter } from "react-router-dom";
import RootLayout, { AuthLayout } from "../layouts/RootLayout";
import RequireAuth from "../components/RequireAuth";
import NotFoundPage from "../Pages/NotFoundPage";
import LandingPage from "../Pages/LandingPage";
import EventDetailPage from "../Pages/EventDetailPage";
import RegisterPage from "../Pages/RegisterPage";
import ForgotPasswordPage from "../Pages/ForgotPasswordPage";
import ConfirmationPage from "../Pages/ConfirmationPage";
import MyTicketsPage from "../Pages/MyTicketsPage";
import AccountLayout from "../Pages/AccountLayout";
import AccountProfilePage from "../Pages/AccountProfilePage";
import AccountNotificationsPage from "../Pages/AccountNotificationsPage";
import RegistrationPage from "../Pages/RegistrationPage";
import ExplorePage from "../Pages/ExplorePage";
import TicketDetailPage from "../Pages/TicketDetailPage";
import AccountHistoryPage from "../Pages/AccountHistoryPage";
import LoginPage from "../Pages/LoginPage";

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
