import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import NotFoundPage from "../Pages/NotFoundPage";
import HomePage from "../Pages/HomePage";
import EventsPage from "../Pages/EventPage";
import EventDetailPage from "../Pages/EventDetailPage";
import AuthPage from "../Pages/AuthPage";
import BiayaPage from "../Pages/BiayaPage";
import GelangPage from "../Pages/GelangPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "events",
        element: <EventsPage />,
      },
      {
        path: "events/:id",
        element: <EventDetailPage />,
      },
      {
        path: "biaya",
        element: <BiayaPage />,
      },
      {
        path: "tiket-gelang",
        element: <GelangPage />,
      },
    ],
  },
  // Login & Register sengaja di luar RootLayout: desainnya full-page
  // sendiri, tanpa header/nav/footer situs.
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/register",
    element: <AuthPage />,
  },
]);