import { createBrowserRouter } from "react-router-dom"
import RootLayout from "../Layouts/RootLayout"
import NotFoundPage from "../Pages/NotFoundPage"
import HomePage from "../Pages/HomePage"
import EventsPage from "../Pages/EventPage"
import EventDetailPage from "../Pages/EventDetailPage"

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
    ],
  },
])