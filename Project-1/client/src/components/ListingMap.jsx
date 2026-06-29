import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ListingMap({ lat, lon, title, location }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!lat || !lon || !containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current).setView([lat, lon], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(`<b>${title}</b><br>${location}`)
      .openPopup();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lon, title, location]);

  if (!lat || !lon) {
    return (
      <div
        style={{ height: 300, borderRadius: 16, marginTop: "1rem" }}
        className="d-flex align-items-center justify-content-center bg-light"
      >
        <p className="text-muted mb-0 pt-5">
          Map not available for this location
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height: 300, borderRadius: 16, marginTop: "1rem" }}
    />
  );
}
