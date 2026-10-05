import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  MapPin,
  Search,
} from "lucide-react";
import { api } from "../lib/api";
import EventCard from "../components/EventCard";

export default function EventPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "semua";
  const activeLocation = searchParams.get("location") || "semua";
  const activeDate = searchParams.get("date") || "";

  function updateFilter(patch) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([key, value]) => {
        if (!value || value === "semua") next.delete(key);
        else next.set(key, value);
      });
      return next;
    });
  }

  function resetFilters() {
    setSearchParams({});
  }

  const activeFiltersCount =
    (activeCategory !== "semua" ? 1 : 0) +
    (activeLocation !== "semua" ? 1 : 0) +
    (activeDate ? 1 : 0);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });
  const { data: locations = [] } = useQuery({
    queryKey: ["events", "locations"],
    queryFn: api.getEventLocations,
  });
  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events", "list", activeCategory, activeLocation, activeDate],
    queryFn: () =>
      api.getEvents({
        category: activeCategory,
        location: activeLocation,
        date: activeDate,
      }),
  });

  return (
    <main className="wrap">
      <div className="page-head">
        <h1>Jelajah Event</h1>
        <p>
          Temukan konser, seminar, workshop, dan event lainnya yang cocok
          buatmu.
        </p>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filterOpen ? "open" : ""}`}
          onClick={() => setFilterOpen((v) => !v)}
        >
          <SlidersHorizontal />
          Filter
          {activeFiltersCount > 0 && (
            <span className="filter-count">{activeFiltersCount}</span>
          )}
          <ChevronDown className="chev" />
        </button>

        <div className={`filter-panel ${filterOpen ? "open" : ""}`}>
          <div className="filter-panel-inner">
            <div className="filter-grid">
              <div className="filter-field">
                <label>Tanggal</label>
                <div className="input-wrap">
                  <Calendar />
                  <input
                    type="date"
                    value={activeDate}
                    onChange={(e) => updateFilter({ date: e.target.value })}
                  />
                </div>
              </div>
              <div className="filter-field">
                <label>Lokasi</label>
                <div className="input-wrap">
                  <MapPin />
                  <select
                    value={activeLocation}
                    onChange={(e) => updateFilter({ location: e.target.value })}
                  >
                    <option value="semua">Semua Lokasi</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="filter-field cat-field">
              <label>Kategori</label>
              <div className="cat-pill-row">
                <button
                  className={`cat-pill ${activeCategory === "semua" ? "active" : ""}`}
                  onClick={() => updateFilter({ category: "semua" })}
                >
                  Semua
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    className={`cat-pill ${activeCategory === c.slug ? "active" : ""}`}
                    onClick={() => updateFilter({ category: c.slug })}
                  >
                    {c.nama}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-actions">
              <button className="btn btn-ghost" onClick={resetFilters}>
                Reset
              </button>
              <button
                className="btn btn-solid"
                onClick={() => setFilterOpen(false)}
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="results-bar">
        <div className="results-count">
          <b>{events.length}</b> event ditemukan
        </div>
      </div>

      {isError ? (
        <p style={{ color: "var(--white-faint)", fontSize: 14 }}>
          Gagal memuat event. Pastikan backend berjalan.
        </p>
      ) : isLoading ? (
        <p style={{ color: "var(--white-faint)", fontSize: 14 }}>
          Memuat event...
        </p>
      ) : (
        <>
          <div className="event-grid">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>

          <div className={`empty-state ${events.length === 0 ? "show" : ""}`}>
            <Search />
            <h3>Event tidak ditemukan</h3>
            <p>
              Coba ubah filter kategori, lokasi, atau tanggal yang kamu pilih.
            </p>
          </div>
        </>
      )}
    </main>
  );
}