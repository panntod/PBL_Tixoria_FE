import { Link } from "react-router-dom";
import EventCover from "./EventCover";
import { EventStatusBadge } from "./StatusBadge";
import { formatDate } from "../lib/format";
import { totalSeats } from "../lib/services";

function footNote(event) {
  switch (event.status) {
    case "habis":
      return "Kuota terpenuhi";
    case "selesai":
      return "Acara telah berakhir";
    case "dibatalkan":
      return "Dibatalkan penyelenggara";
    default:
      return `Tersisa ${totalSeats(event)} kursi`;
  }
}

export default function EventCard({ event }) {
  const dateLine = event.date ? formatDate(event.date) : event.dateLabel;
  const rangeLine = event.dateEnd
    ? `${new Date(event.date).getDate()}–${formatDate(event.dateEnd).replace(/^\w+, /, "")}`
    : dateLine;

  return (
    <Link to={`/events/${event.id}`} className="event-card">
      <EventCover
        theme={event.theme}
        eyebrow={event.category?.nama}
        title={event.coverLabel}
      />
      <div className="event-card-body">
        <div>
          <EventStatusBadge status={event.status} />
        </div>
        <h3>{event.title}</h3>
        <p className="meta">
          {rangeLine} · {event.location}
        </p>
        <div className="event-card-foot">
          <span>{footNote(event)}</span>
        </div>
      </div>
    </Link>
  );
}
