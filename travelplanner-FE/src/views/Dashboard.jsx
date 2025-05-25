import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TripList from "../components/TripList";
import SuggestedTrips from "../components/SuggestedTrips";
import AddTripForm from "../components/AddTripForm";


const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.name) setUserName(user.name);

      const res = await fetch("http://localhost:3001/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Errore nel recupero dei viaggi");
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      console.error(err);
      setError("Impossibile caricare i viaggi");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchTrips();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Ciao {userName || "Viaggiatore"} 👋</h2>
      <p>Ecco i tuoi viaggi pianificati:</p>
      {error && <p className="text-danger">{error}</p>}
      <TripList trips={trips} onTripsUpdated={fetchTrips} />
      <AddTripForm onTripAdded={fetchTrips} />
      <SuggestedTrips onTripAdded={fetchTrips} />
    </div>
  );
};

export default Dashboard;


