import { createBrowserRouter } from 'react-router-dom'
import RootLayout, { AuthLayout } from '../layouts/RootLayout'
import RequireAuth from '../components/RequireAuth'
import NotFoundPage from '../pages/NotFoundPage'
import LandingPage from '../pages/LandingPage'
import ExplorePage from '../pages/ExplorePage'
import EventDetailPage from '../pages/EventDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import RegistrationPage from '../pages/RegistrationPage'
import ConfirmationPage from '../pages/ConfirmationPage'
import MyTicketsPage from '../pages/MyTicketsPage'
import TicketDetailPage from '../pages/TicketDetailPage'
import AccountLayout from '../pages/AccountLayout'
import AccountProfilePage from '../pages/AccountProfilePage'
import AccountNotificationsPage from '../pages/AccountNotificationsPage'
import AccountHistoryPage from '../pages/AccountHistoryPage'

// Role "user". Rute admin dan owner event ditambahkan setelah desainnya diiris.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'events', element: <ExplorePage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'events/:id/register', element: <RegistrationPage /> },
          { path: 'registrations/:orderNo/success', element: <ConfirmationPage /> },
          { path: 'my-tickets', element: <MyTicketsPage /> },
          { path: 'tickets/:orderNo', element: <TicketDetailPage /> },
          {
            path: 'account',
            element: <AccountLayout />,
            children: [
              { index: true, element: <AccountProfilePage /> },
              { path: 'notifikasi', element: <AccountNotificationsPage /> },
              { path: 'riwayat', element: <AccountHistoryPage /> },
            ],
          },
        ],
      },
    ],
  },
  // Masuk & daftar: halaman penuh tanpa header, sesuai desain.
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
