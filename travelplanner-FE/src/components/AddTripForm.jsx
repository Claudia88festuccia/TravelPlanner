import React, { useState } from "react";

export default function AddTripForm({ onTripAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/trips`,
         {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Errore durante la creazione del viaggio");

      alert("Viaggio creato con successo!");
      setFormData({ title: "", destination: "", startDate: "", endDate: "", notes: "" });
      if (onTripAdded) onTripAdded();
    } catch (err) {
      console.error(err);
      alert("Errore durante la creazione del viaggio.");
    }
  };

  return (
    <div className="mt-4">
      <h4>➕ Aggiungi un nuovo viaggio</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Titolo"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="destination"
            className="form-control"
            placeholder="Destinazione"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <input
            type="date"
            name="endDate"
            className="form-control"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <textarea
            name="notes"
            className="form-control"
            placeholder="Note"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crea Viaggio
        </button>
      </form>
    </div>
  );
}
