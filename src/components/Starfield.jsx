import { useMemo } from 'react'

export default function Starfield({ count = 70 }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.6 + 1,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3,
      })),
    [count]
  )

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
