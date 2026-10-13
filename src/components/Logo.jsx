import { Link } from 'react-router-dom'

export function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg-top" x1="3" y1="4" x2="28" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#5b3df0" />
        </linearGradient>
        <linearGradient id="lg-left" x1="10" y1="17" x2="14" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="lg-right" x1="18" y1="17" x2="22" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5eead4" />
          <stop offset="1" stopColor="#5ec8e5" />
        </linearGradient>
      </defs>
      <path
        d="M4 10.5 15.2 4.2a1.6 1.6 0 0 1 1.6 0L27 10a1 1 0 0 1 0 1.8L17 17.4a2 2 0 0 1-2 0L4.2 12.3a1 1 0 0 1-.2-1.8Z"
        fill="url(#lg-top)"
      />
      <path d="M9.5 17.5 15 20.3V28a1.2 1.2 0 0 1-1.8 1L10 26.5a2 2 0 0 1-.9-1.7Z" fill="url(#lg-left)" />
      <path d="M17 20.3 22.5 17.4V25a2 2 0 0 1-.9 1.7L18.8 29a1.2 1.2 0 0 1-1.8-1Z" fill="url(#lg-right)" />
    </svg>
  )
}

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="logo" aria-label="Tixora, ke beranda">
      <LogoMark />
      Tixora
    </Link>
  )
}
