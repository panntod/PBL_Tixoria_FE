import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Festival Musik Kampus 2026",
    date: "24 Okt 2026",
    location: "Stadion Utama",
    price: "Rp 50.000",
  },
  {
    id: "2",
    title: "Seminar Nasional AI & Web",
    date: "12 Nov 2026",
    location: "Auditorium Gd. A",
    price: "Gratis",
  },
  {
    id: "3",
    title: "Pameran Karya Akhir Desain",
    date: "05 Des 2026",
    location: "Galeri Seni",
    price: "Rp 15.000",
  },
];

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Daftar Event Tersedia</h1>
        <p className="text-slate-600">
          Pilih acara kampus favoritmu dan amankan tiketnya.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_EVENTS.map((event) => (
          <Card key={event.id} className="flex flex-col justify-between">
            <CardHeader>
              <Badge className="w-fit mb-2">{event.price}</Badge>
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {event.date}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {event.location}
              </div>
            </CardContent>
            <CardFooter>
              <Link to={`/events/${event.id}`}>
                <Button asChild className="w-full">
                  Detail Tiket
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
