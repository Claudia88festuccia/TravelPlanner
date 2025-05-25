import React, { useState } from "react";

export default function TripList({ trips, onTripsUpdated }) {
  const [editingTripId, setEditingTripId] = useState(null);
  const [editData, setEditData] = useState({ title: "", destination: "", notes: "" });
  const [newChecklistItems, setNewChecklistItems] = useState({});
  const [itineraryState, setItineraryState] = useState({});
  const [newActivities, setNewActivities] = useState({});

  const token = localStorage.getItem("token");

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/trips/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      alert("Viaggio eliminato.");
      onTripsUpdated();
    } catch (err) {
      console.error(err);
      alert("Errore durante l'eliminazione.");
    }
  };

  const handleEditClick = (trip) => {
    setEditingTripId(trip._id);
    setEditData({
      title: trip.title,
      destination: trip.destination,
      notes: trip.notes,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/trips/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Errore durante la modifica");
      alert("Viaggio modificato.");
      setEditingTripId(null);
      onTripsUpdated();
    } catch (err) {
      console.error(err);
      alert("Errore durante la modifica.");
    }
  };

  const handleFileUpload = async (e, tripId) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("document", e.target.files[0]);

    try {
      const res = await fetch(`http://localhost:3001/trips/${tripId}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Errore durante l'upload");
      alert("Documento caricato!");
      onTripsUpdated();
    } catch (err) {
      console.error(err);
      alert("Errore nell'upload");
    }
  };

  const handleDeleteDocument = async (tripId, docUrl) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3001/trips/${tripId}/documents`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documentUrl: docUrl }),
      });

      if (!res.ok) throw new Error("Errore eliminazione documento");
      alert("Documento eliminato!");
      onTripsUpdated();
    } catch (err) {
      console.error(err);
      alert("Errore durante l'eliminazione.");
    }
  };

  const handleAddChecklistItem = async (e, tripId) => {
    e.preventDefault();
    const newItem = newChecklistItems[tripId]?.trim();
    if (!newItem) return;

    const trip = trips.find((t) => t._id === tripId);
    const updatedChecklist = [
      ...(trip.checklist || []),
      { item: newItem, done: false },
    ];

    try {
      await fetch(`http://localhost:3001/trips/${tripId}/checklist`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ checklist: updatedChecklist }),
      });
      setNewChecklistItems({ ...newChecklistItems, [tripId]: "" });
      onTripsUpdated();
    } catch (err) {
      alert("Errore aggiunta checklist");
    }
  };


  const handleRemoveChecklistItem = async (tripId, index) => {
    const trip = trips.find((t) => t._id === tripId);
    const updatedChecklist = [...trip.checklist];
    updatedChecklist.splice(index, 1);

    try {
      await fetch(`http://localhost:3001/trips/${tripId}/checklist`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ checklist: updatedChecklist }),
      });
      onTripsUpdated();
    } catch (err) {
      alert("Errore rimozione checklist");
    }
  };

  const toggleChecklistItem = async (tripId, index, newValue) => {
    const trip = trips.find((t) => t._id === tripId);
    const updatedChecklist = [...trip.checklist];
    updatedChecklist[index].done = newValue;

    try {
      await fetch(`http://localhost:3001/trips/${tripId}/checklist`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ checklist: updatedChecklist }),
      });
      onTripsUpdated();
    } catch (err) {
      alert("Errore aggiornamento checklist");
    }
  };

  const handleAddItineraryActivity = (tripId, dayIndex, activity) => {
    setItineraryState((prev) => {
      const tripItinerary = prev[tripId] || [...(trips.find((t) => t._id === tripId)?.itinerary || [])];
      const updated = [...tripItinerary];

      if (!updated[dayIndex]) updated[dayIndex] = { day: dayIndex + 1, activities: [] };
      updated[dayIndex].activities.push(activity);

      return { ...prev, [tripId]: updated };
    });
  };

  const handleRemoveItineraryActivity = (tripId, dayIndex, activityIndex) => {
    setItineraryState((prev) => {
      const updated = [...(prev[tripId] || [])];
      if (updated[dayIndex]) {
        updated[dayIndex].activities.splice(activityIndex, 1);
      }
      return { ...prev, [tripId]: updated };
    });
  };

  const handleUpdateItinerary = async (tripId) => {
    const updatedItinerary = itineraryState[tripId];
    try {
      const res = await fetch(`http://localhost:3001/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itinerary: updatedItinerary }),
      });
      if (!res.ok) throw new Error("Errore salvataggio itinerario");
      alert("Itinerario salvato!");
      onTripsUpdated();
    } catch (err) {
      alert("Errore aggiornamento itinerario");
    }
  };

  const handleAddNewDay = (tripId) => {
    setItineraryState((prev) => {
      const currentItinerary = prev[tripId] || trips.find(t => t._id === tripId)?.itinerary || [];
      const newDayNumber = currentItinerary.length + 1;
      const updated = [...currentItinerary, { day: newDayNumber, activities: [] }];
      return { ...prev, [tripId]: updated };
    });
  };

  const handleRemoveDay = (tripId, dayIndex) => {
    setItineraryState((prev) => {
      const updated = [...(prev[tripId] || trips.find(t => t._id === tripId)?.itinerary || [])];
      updated.splice(dayIndex, 1);
      // Riassegna i numeri dei giorni
      const reindexed = updated.map((day, i) => ({ ...day, day: i + 1 }));
      return { ...prev, [tripId]: reindexed };
    });
  };



  return (
    <div className="row">
      {trips.map((trip) => (
        <div key={trip._id} className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              {editingTripId === trip._id ? (
                <>
                  <input
                    className="form-control mb-2"
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                  />
                  <input
                    className="form-control mb-2"
                    name="destination"
                    value={editData.destination}
                    onChange={handleEditChange}
                  />
                  <textarea
                    className="form-control mb-2"
                    name="notes"
                    value={editData.notes}
                    onChange={handleEditChange}
                  />
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditSubmit(trip._id)}>
                    Salva
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditingTripId(null)}>
                    Annulla
                  </button>
                </>
              ) : (
                <>
                  <h5 className="card-title">{trip.title}</h5>
                  <p className="card-text">
                    <strong>Destinazione:</strong> {trip.destination}<br />
                    {trip.startDate && trip.endDate && (
                      <small className="text-muted">
                        Dal {new Date(trip.startDate).toLocaleDateString()} al{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </small>
                    )}
                    <br />
                    {trip.notes}
                  </p>

                  {/* Checklist */}
                  {trip.checklist && (
                    <div className="mt-3">
                      <strong>Checklist:</strong>
                      <ul className="list-unstyled">
                        {trip.checklist.map((entry, i) => (
                          <li key={i} className="d-flex align-items-center mb-1">
                            <input
                              type="checkbox"
                              className="form-check-input me-2"
                              checked={entry.done}
                              onChange={() => toggleChecklistItem(trip._id, i, !entry.done)}
                            />
                            <span className={entry.done ? "text-decoration-line-through text-muted" : ""}>
                              {entry.item}
                            </span>
                            <button
                              className="btn btn-sm btn-link text-danger ms-auto"
                              onClick={() => handleRemoveChecklistItem(trip._id, i)}
                            >
                              🗑️
                            </button>
                          </li>
                        ))}
                      </ul>

                      <form
                        onSubmit={(e) => handleAddChecklistItem(e, trip._id)}
                        className="d-flex"
                      >
                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder="Aggiungi voce"
                          value={newChecklistItems[trip._id] || ""}
                          onChange={(e) =>
                            setNewChecklistItems({
                              ...newChecklistItems,
                              [trip._id]: e.target.value,
                            })
                          }
                        />
                        <button type="submit" className="btn btn-sm btn-success">+</button>
                      </form>
                    </div>
                  )}

                  {((itineraryState[trip._id] && itineraryState[trip._id].length > 0)
                    ? itineraryState[trip._id]
                    : (trip.itinerary && trip.itinerary.length > 0)
                      ? trip.itinerary
                      : [{ day: 1, activities: [] }]
                  ).map((day, dayIndex) => (

                    <div key={dayIndex} className="mt-3">
                      <strong>Giorno {day.day}:</strong>
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => handleRemoveDay(trip._id, dayIndex)}
                      >
                        🗑️ Elimina Giorno
                      </button>

                      <ul className="list-unstyled">
                        {day.activities.map((activity, aIndex) => (
                          <li key={aIndex} className="d-flex align-items-center mb-1">
                            <span>{activity}</span>

                            <button
                              className="btn btn-sm btn-link text-danger ms-auto"
                              onClick={() => handleRemoveItineraryActivity(trip._id, dayIndex, aIndex)}
                            >🗑️</button>
                          </li>
                        ))}
                      </ul>
                      <form
                        className="d-flex"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddItineraryActivity(trip._id, dayIndex, newActivities[`${trip._id}-${dayIndex}`]);
                        }}
                      >
                        <input
                          type="text"
                          className="form-control form-control-sm me-2"
                          placeholder="Nuova attività"
                          value={newActivities[`${trip._id}-${dayIndex}`] || ""}
                          onChange={(e) =>
                            setNewActivities({ ...newActivities, [`${trip._id}-${dayIndex}`]: e.target.value })
                          }
                        />
                        <button type="submit" className="btn btn-sm btn-success">+</button>
                      </form>
                    </div>
                  ))}
                  <button
                    className="btn btn-sm btn-outline-secondary mt-2"
                    onClick={() => handleAddNewDay(trip._id)}
                  >
                    ➕ Aggiungi Giorno
                  </button>

                  <button
                    className="btn btn-sm btn-outline-success mt-2"
                    onClick={() => handleUpdateItinerary(trip._id)}
                  >
                    💾 Salva Itinerario
                  </button>


                  {trip.documents && trip.documents.length > 0 && (
                    <div className="mt-2">
                      <strong>Documenti:</strong>
                      <ul className="list-unstyled">
                        {trip.documents.map((docUrl, index) => (
                          <li key={index} className="d-flex align-items-center mb-2">
                            {/\.(jpe?g|png)$/i.test(docUrl) ? (
                              <img
                                src={docUrl}
                                alt={`doc-${index}`}
                                style={{ width: "80px", height: "auto", marginRight: "10px" }}
                              />
                            ) : (
                              <a href={docUrl} target="_blank" rel="noopener noreferrer" className="me-2">
                                📎 Documento {index + 1}
                              </a>
                            )}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteDocument(trip._id, docUrl)}
                            >
                              🗑️
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}


                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditClick(trip)}>
                    ✏️ Modifica
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(trip._id)}>
                    🗑️ Elimina
                  </button>


                  <input
                    type="file"
                    className="form-control form-control-sm mt-2"
                    onChange={(e) => handleFileUpload(e, trip._id)}

                  />

                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

