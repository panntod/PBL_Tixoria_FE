import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { BlockSkeleton, ErrorState } from "../components/States";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../lib/format";
import { getRegistration } from "../lib/services";

export default function ConfirmationPage() {
  const { orderNo } = useParams();
  const { user } = useAuth();
  const {
    data: reg,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["registration", orderNo],
    queryFn: () => getRegistration(orderNo),
  });

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <BlockSkeleton height={420} />
        </div>
      </div>
    );
  }
  if (isError || !reg) {
    return (
      <div className="page">
        <div className="container container-md">
          <ErrorState
            title="Pendaftaran tidak ditemukan"
            text="Periksa kembali nomor pesanan Anda."
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  const email = reg.participant?.email || user?.email;
  const ev = reg.event;

  return (
    <div className="page" style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="card confirm-card">
          <div className="status-icon ok" style={{ width: 48, height: 48 }}>
            <Check />
          </div>
          <h1>Pendaftaran berhasil</h1>
          <p className="lead">
            Tiket Anda sudah dikirim ke {email}
            <br />
            dan tersimpan di akun Anda.
          </p>

          <div className="order-box">
            <div>
              <div className="k">No. pesanan</div>
              <div className="v">{reg.orderNo}</div>
            </div>
            <div className="full">
              <div className="k">Acara</div>
              <div className="v">
                {ev?.title} · Tiket {reg.ticketName} × {reg.qty}
              </div>
            </div>
            <div className="full">
              <div className="k">Waktu dan tempat</div>
              <div className="v">
                {ev &&
                  `${formatDate(ev.date)} · ${ev.time?.split("–")[0]} WIB · ${ev.location}`}
              </div>
            </div>
          </div>

          <div className="alert alert-info" style={{ textAlign: "left" }}>
            Tunjukkan kode QR pada tiket saat registrasi ulang di lokasi.
          </div>

          <div className="confirm-actions">
            <Link to="/my-tickets" className="btn btn-primary btn-lg">
              Lihat tiket saya
            </Link>
            <Link to="/events" className="btn btn-outline btn-lg">
              Jelajahi acara lain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
