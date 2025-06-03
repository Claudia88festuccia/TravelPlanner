 import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function MapView({ destination }) {
  const [coords, setCoords] = React.useState(null);

  // Geocoding
  React.useEffect(() => {
    const getCoordinates = async () => {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.results?.[0]?.geometry?.location) {
        setCoords(data.results[0].geometry.location);
        if (data.status !== "OK") {
  console.error("Geocoding fallito:", data);
  return;
}

      }
    };

    if (destination) getCoordinates();
  }, [destination]);

  if (!coords) return <p>Caricamento mappa...</p>;

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={coords} zoom={10}>
        <Marker position={coords} />
      </GoogleMap>
    </LoadScript>
  );
}
