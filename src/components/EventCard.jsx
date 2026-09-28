import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { getCategoryIcon } from '../lib/categoryIcons'

export default function EventCard({ event }) {
  const Icon = getCategoryIcon(event.category?.slug)
  const badgeLabel = event.category?.nama ? event.category.nama.split(' ')[0] : ''

  return (
    <Link to={`/events/${event.id}`} className="event-card block no-underline">
      <div className={`event-thumb ${event.category?.thumbClass || ''}`}>
        <span className="cat-badge">{badgeLabel}</span>
        <Icon color="#fff" strokeWidth={1.6} />
      </div>
      <div className="event-body">
        <h3>{event.title}</h3>
        <div className="event-meta">
          <div>
            <Calendar /> {event.formattedDate}
          </div>
          <div>
            <User /> {event.organizer}
          </div>
        </div>
        <div className="event-foot">
          <div className="event-price">
            {event.formattedPrice}
            <span>mulai dari</span>
          </div>
          <div className="mini-btn">
            <ArrowRight />
          </div>
        </div>
      </div>
    </Link>
  )
}
