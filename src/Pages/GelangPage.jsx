import { useState } from "react";

const PRICE = { kertas: 3500, kain: 6000 };
const QR_EXTRA = 500;

function formatRp(n) {
  return "Rp" + Math.round(n || 0).toLocaleString("id-ID");
}

export default function GelangPage() {
  const [material, setMaterial] = useState("kertas");
  const [qrOn, setQrOn] = useState(false);
  const [qty, setQty] = useState("500");

  const unit = PRICE[material] + (qrOn ? QR_EXTRA : 0);
  const qtyNumber = Math.max(1, parseInt(qty, 10) || 0);
  const total = unit * qtyNumber;

  return (
    <main className="wrap">
      <div className="page-head">
        <h1>Cetak Gelang Tiket</h1>
        <p>
          Gelang tiket custom buat event kamu — pilih bahan dan opsi QR code
          sesuai kebutuhan.
        </p>
      </div>

      <div className="top-grid">
        {/* preview */}
        <div className="preview-card">
          <div className="band-outer">
            <div
              className={`band ${material === "kertas" ? "paper" : "fabric"}`}
            >
              <div className={`band-qr ${qrOn ? "show" : ""}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0a1030"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
                </svg>
              </div>
              <div className="band-text">TIXORA</div>
              <div className="band-cut"></div>
              <div className="band-clasp">
                <div className="hole"></div>
              </div>
            </div>
            <div className="band-caption">
              Pratinjau — bahan <b>{material}</b>, QR code{" "}
              <b>{qrOn ? "ya, " : "tidak"}</b> disertakan
            </div>
          </div>
        </div>

        {/* order frame */}
        <div className="order-card">
          <div className="price-line">
            <span className="label">Harga satuan</span>
            <span className="value">
              {formatRp(unit)}
              <span> /pcs</span>
            </span>
          </div>

          <div className="option-field">
            <label>Bahan</label>
            <div className="option-row">
              <button
                className={`option-btn ${material === "kertas" ? "active" : ""}`}
                onClick={() => setMaterial("kertas")}
              >
                Kertas
              </button>
              <button
                className={`option-btn ${material === "kain" ? "active" : ""}`}
                onClick={() => setMaterial("kain")}
              >
                Kain
              </button>
            </div>
          </div>

          <div className="option-field">
            <label>QR Code</label>
            <div className="option-row">
              <button
                className={`option-btn ${qrOn ? "active" : ""}`}
                onClick={() => setQrOn(true)}
              >
                Ya
              </button>
              <button
                className={`option-btn ${!qrOn ? "active" : ""}`}
                onClick={() => setQrOn(false)}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* description */}
      <div className="spec-section">
        <div className="spec-card">
          <div className="spec-list">
            {[
              "Bahan Synthetic Paper LMO",
              "Ukuran 26cm x 2cm",
              "Cetak 1 sisi",
              "Laminasi (Doff atau Glossy)",
              "Safety Cut System",
              "Anti sobek dan tahan air",
              "Waktu pengerjaan 3–7 hari",
              "Exclude ongkir dan design",
            ].map((spec) => (
              <div className="spec-item" key={spec}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {spec}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* quantity + total */}
      <div className="order-section">
        <div className="order-bottom">
          <div className="qty-field">
            <label>Jumlah Tiket yang Ingin Dipesan</label>
            <div className="input-wrap">
              <input
                type="number"
                placeholder="Contoh: 500"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <span>pcs</span>
            </div>
          </div>
          <div className="total-box">
            <div className="t-label">Total Harga</div>
            <div className="t-value">{formatRp(total)}</div>
          </div>
        </div>
      </div>
    </main>
  );
}