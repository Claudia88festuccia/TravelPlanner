 import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function MapView({ destination }) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
          setCoords(data.results[0].geometry.location);
        } else {
          console.error("Geocoding fallito:", data);
        }
      } catch (err) {
        console.error("Errore fetch geocoding:", err);
      }
    };

    if (destination) getCoordinates();
  }, [destination]);

  if (!coords) return <p>Caricamento mappa...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={coords} zoom={10}>
      <Marker position={coords} />
    </GoogleMap>
  );
}
