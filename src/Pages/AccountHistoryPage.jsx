import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RegistrationStatusBadge } from "../components/StatusBadge";
import { BlockSkeleton, EmptyState, ErrorState } from "../components/States";
import { useToast } from "../context/ToastContext";
import { formatDateShort } from "../lib/format";
import { groupOf, listRegistrations, payRegistration } from "../lib/services";

const TABS = [
  ["semua", "Semua"],
  ["akan-datang", "Akan datang"],
  ["selesai", "Selesai"],
  ["dibatalkan", "Dibatalkan"],
];

export default function AccountHistoryPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("semua");
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey: ["registrations"], queryFn: listRegistrations });

  const count = (key) =>
    key === "semua"
      ? data.length
      : data.filter((r) => groupOf(r) === key).length;
  const rows = tab === "semua" ? data : data.filter((r) => groupOf(r) === tab);

  async function pay(orderNo) {
    await payRegistration(orderNo);
    await queryClient.invalidateQueries({ queryKey: ["registrations"] });
    toast("Pendaftaran berhasil. Tiket Anda sudah terbit.");
  }

  return (
    <>
      <div className="pill-tabs" role="group" aria-label="Filter status">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className="chip"
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
          >
            {label} {count(key)}
          </button>
        ))}
      </div>

      {isLoading && <BlockSkeleton height={260} />}
      {isError && <ErrorState title="Gagal memuat riwayat" onRetry={refetch} />}
      {!isLoading && !isError && data.length === 0 && (
        <EmptyState
          title="Belum ada pendaftaran"
          text="Acara yang Anda daftar akan tercatat di sini."
          action={
            <Link to="/events" className="btn btn-primary">
              Jelajahi acara
            </Link>
          }
        />
      )}
      {!isLoading && !isError && data.length > 0 && (
        <>
          <div className="card table-card">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Acara</th>
                  <th scope="col">No. pesanan</th>
                  <th scope="col">Tanggal</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.orderNo}>
                    <td className="name">{r.event?.title}</td>
                    <td>{r.orderNo}</td>
                    <td>{r.event && formatDateShort(r.event.date)}</td>
                    <td>
                      <RegistrationStatusBadge status={r.status} />
                    </td>
                    <td className="act">
                      {r.status === "sah" && (
                        <Link
                          to={`/tickets/${r.orderNo}`}
                          className="btn btn-outline btn-sm"
                        >
                          Lihat tiket
                        </Link>
                      )}
                      {r.status === "menunggu" && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => pay(r.orderNo)}
                        >
                          Update
                        </button>
                      )}
                      {(r.status === "dipakai" ||
                        r.status === "dibatalkan") && (
                        <Link
                          to={`/tickets/${r.orderNo}`}
                          className="btn btn-ghost btn-sm"
                        >
                          Detail
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-foot">
            {rows.length ? `1–${rows.length}` : "0"} dari {rows.length}{" "}
            pendaftaran
          </p>
        </>
      )}
    </>
  );
}
