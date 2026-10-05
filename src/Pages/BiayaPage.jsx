import { useState } from "react";

const ADMIN_FEE = 5000;
const QRIS_RATE = 0.007;

function formatRp(n) {
  const rounded = Math.round(n || 0);
  return "Rp" + rounded.toLocaleString("id-ID");
}

export default function BiayaPage() {
  const [ticketName, setTicketName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [localTax, setLocalTax] = useState("");
  const [ticketQty, setTicketQty] = useState("1");

  const price = parseFloat(ticketPrice) || 0;
  const taxPct = parseFloat(localTax) || 0;
  const qty = Math.max(1, parseInt(ticketQty, 10) || 1);

  const qrisFee = price * QRIS_RATE;
  const totalPerTicket = price + ADMIN_FEE + qrisFee;
  const totalBayar = totalPerTicket * qty;
  const taxAmount = price * (taxPct / 100) * qty;
  const balance = price * qty - taxAmount;

  return (
    <main className="wrap">
      <div className="page-head">
        <h1>Biaya</h1>
        <p>
          Transparan dari awal — cek rincian biaya tiket sebelum kamu jual atau
          beli.
        </p>
      </div>

      {/* FRAME 1: Hero simulator banner */}
      <div className="hero-frame">
        <div>
          <h2>Simulasikan Biaya Tiketmu</h2>
          <p>
            Masukkan harga tiket yang kamu mau, dan lihat langsung rincian biaya
            admin, layanan QRIS, sampai saldo bersih yang kamu terima.
          </p>
          <button
            className="btn btn-solid"
            onClick={() =>
              document
                .getElementById("simulasi")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Coba Simulasi
          </button>
        </div>

        <div className="example-card">
          <div className="ex-label">Contoh transaksi</div>
          <div className="ex-row">
            <span>Harga tiket</span>
            <span>Rp150.000</span>
          </div>
          <div className="ex-row">
            <span>Admin fee</span>
            <span>Rp5.000</span>
          </div>
          <div className="ex-row">
            <span>Biaya layanan QRIS</span>
            <span>Rp1.050</span>
          </div>
          <div className="ex-row total">
            <span>Total dibayar</span>
            <span>Rp156.050</span>
          </div>
        </div>
      </div>

      {/* FRAME 2+3: Split simulator */}
      <div className="sim-section" id="simulasi">
        <div className="sim-title">Simulasi Harga Tiket</div>
        <div className="sim-grid">
          {/* Left: input */}
          <div className="sim-card">
            <h3>Detail Tiket</h3>

            <div className="field">
              <label>Nama Tiket</label>
              <div className="input-wrap">
                <input
                  type="text"
                  placeholder="Contoh: Presale 1"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Harga Tiket</label>
              <div className="input-wrap">
                <span className="prefix">Rp</span>
                <input
                  type="number"
                  placeholder="150000"
                  min="0"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>
                Pajak Daerah (%) <span className="hint">opsional</span>
              </label>
              <div className="input-wrap">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                  value={localTax}
                  onChange={(e) => setLocalTax(e.target.value)}
                />
                <span className="prefix">%</span>
              </div>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label>Jumlah Tiket</label>
              <div className="input-wrap">
                <input
                  type="number"
                  placeholder="1"
                  min="1"
                  value={ticketQty}
                  onChange={(e) => setTicketQty(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right: result */}
          <div className="sim-card">
            <h3>
              Simulasi Harga Tiket{" "}
              <span
                style={{
                  color: "var(--white-faint)",
                  fontWeight: 500,
                  fontSize: 13,
                }}
              >
                {ticketName ? `— ${ticketName}` : ""}
              </span>
            </h3>

            <div className="result-row">
              <span>Harga tiket / pcs</span>
              <b>{formatRp(price)}</b>
            </div>
            <div className="result-row">
              <span>Admin fee / pcs</span>
              <b>{formatRp(ADMIN_FEE)}</b>
            </div>
            <div className="result-row">
              <span>Biaya layanan QRIS (0.7%)</span>
              <b>{formatRp(qrisFee)}</b>
            </div>
            <div className="result-row">
              <span>Jumlah tiket</span>
              <b>{qty} pcs</b>
            </div>
            <div className="result-row total">
              <span className="rlabel">Total dibayar pembeli</span>
              <span className="rvalue">{formatRp(totalBayar)}</span>
            </div>
            <div className="result-sub">
              Sudah termasuk admin fee &amp; biaya layanan QRIS per tiket.
            </div>
          </div>
        </div>

        {/* FRAME 4: balance */}
        <div className="balance-card">
          <div className="balance-left">
            <div className="balance-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 10h18M3 6h18v12H3V6Z" />
                <circle cx="12" cy="14" r="2.5" />
              </svg>
            </div>
            <div>
              <div className="balance-label">Saldo yang kamu terima</div>
              <div className="balance-note">
                Estimasi untuk penyelenggara — harga tiket dikalikan jumlah,
                dikurangi pajak daerah (jika diisi). Admin fee &amp; biaya QRIS
                ditanggung pembeli.
              </div>
            </div>
          </div>
          <div className="balance-value">{formatRp(balance)}</div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="pay-section">
        <div className="sim-title">Metode Pembayaran</div>

        <div className="pay-group">
          <div className="pay-group-title">Transfer Bank</div>
          <div className="pay-row">
            <div className="pay-chip">
              <span className="pay-badge badge-bca">BCA</span>
              <span className="pay-name">Bank BCA</span>
            </div>
            <div className="pay-chip">
              <span className="pay-badge badge-mandiri">MDR</span>
              <span className="pay-name">Bank Mandiri</span>
            </div>
            <div className="pay-chip">
              <span className="pay-badge badge-bni">BNI</span>
              <span className="pay-name">Bank BNI</span>
            </div>
            <div className="pay-chip">
              <span className="pay-badge badge-bri">BRI</span>
              <span className="pay-name">Bank BRI</span>
            </div>
          </div>
        </div>

        <div className="pay-group">
          <div className="pay-group-title">E-Wallet</div>
          <div className="pay-row">
            <div className="pay-chip">
              <span className="pay-badge badge-gopay">GP</span>
              <span className="pay-name">GoPay</span>
            </div>
            <div className="pay-chip">
              <span className="pay-badge badge-ovo">OVO</span>
              <span className="pay-name">OVO</span>
            </div>
            <div className="pay-chip">
              <span className="pay-badge badge-dana">DN</span>
              <span className="pay-name">DANA</span>
            </div>
            <div className="pay-chip">
              <span className="pay-badge badge-shopeepay">SP</span>
              <span className="pay-name">ShopeePay</span>
            </div>
          </div>
        </div>

        <div className="pay-group" style={{ marginBottom: 0 }}>
          <div className="pay-group-title">QRIS</div>
          <div className="pay-row">
            <div className="pay-chip">
              <span className="pay-badge badge-qris">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
                </svg>
              </span>
              <span className="pay-name">Scan QRIS</span>
            </div>
          </div>
          <p className="qris-note">
            Bayar pakai aplikasi bank atau e-wallet apa pun yang mendukung QRIS
            — satu kode untuk semua metode.
          </p>
        </div>
      </div>
    </main>
  );
}
