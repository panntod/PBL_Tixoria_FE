import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import EventCover from "../components/EventCover";
import QrCode from "../components/QrCode";
import { RegistrationStatusBadge } from "../components/StatusBadge";
import { BlockSkeleton, ErrorState } from "../components/States";
import { useToast } from "../context/ToastContext";
import { formatDate, formatDateLong } from "../lib/format";
import { getRegistration } from "../lib/services";

export default function TicketDetailPage() {
  const { orderNo } = useParams();
  const toast = useToast();
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
          <ErrorState title="Tiket tidak ditemukan" onRetry={refetch} />
        </div>
      </div>
    );
  }

  const ev = reg.event;
  const valid = reg.status === "sah";
  const notice = {
    dipakai: "Tiket ini sudah dipindai dan tidak dapat dipakai lagi.",
    dibatalkan: "Acara ini dibatalkan oleh penyelenggara. Tiket tidak berlaku.",
    menunggu: "Menunggu tiket Anda akan segera terbit.",
  }[reg.status];

  return (
    <div className="page">
      <div className="container">
        <nav
          className="breadcrumb"
          aria-label="Breadcrumb"
          style={{ maxWidth: 460, margin: "0 auto 14px" }}
        >
          <Link to="/my-tickets">Tiket saya</Link> / {reg.orderNo}
        </nav>

        <div className={`ticket-view ${valid ? "" : "ticket-off"}`}>
          <div className="card" style={{ overflow: "hidden" }}>
            {ev && (
              <EventCover
                theme={ev.theme}
                variant="ticket"
                eyebrow={formatDateLong(ev.date)}
                title={ev.coverLabel}
              />
            )}
            <div className="card-pad">
              <div className="row-between">
                <RegistrationStatusBadge status={reg.status} />
                <span className="k">{reg.orderNo}</span>
              </div>
              <h1 style={{ fontSize: 20, margin: "12px 0 4px" }}>
                {ev?.title}
              </h1>
              <p className="muted" style={{ fontSize: 13 }}>
                {ev && `${formatDate(ev.date)} · ${ev.time} · ${ev.location}`}
              </p>

              {notice && (
                <div
                  className={`alert ${reg.status === "dibatalkan" ? "alert-error" : "alert-info"}`}
                  style={{ marginTop: 16 }}
                >
                  {notice}
                </div>
              )}

              <div className="ticket-qr-wrap" style={{ marginTop: 16 }}>
                <QrCode value={reg.orderNo} />
                <span className="hint">
                  Tunjukkan kode QR ini kepada petugas.
                </span>
              </div>

              <div className="detail-list">
                <div>
                  <div className="k">Kategori tiket</div>
                  <div className="v">
                    {reg.ticketName} × {reg.qty}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="row"
            style={{ justifyContent: "center", marginTop: 20 }}
          >
            {valid && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => toast("Tiket berhasil disimpan ke galeri.")}
              >
                Simpan ke galeri
              </button>
            )}
            <Link to="/my-tickets" className="btn btn-outline">
              Kembali ke tiket saya
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
