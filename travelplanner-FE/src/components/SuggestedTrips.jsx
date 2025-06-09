import React from "react";

const suggestions = [
    {
        title: "Weekend a Parigi",
        destination: "Parigi, Francia",
        description: "Visita la Torre Eiffel, Montmartre e i musei.",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
    },
    {
        title: "Relax sul Lago di Como",
        destination: "Lago di Como, Italia",
        description: "Paesaggi mozzafiato e cibo delizioso.",
        image: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg"
    },
    {
        title: "Avventura a Berlino",
        destination: "Berlino, Germania",
        description: "Scopri arte, storia e vita notturna.",
        image: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg"
    }
];

export default function SuggestedTrips({ onTripAdded }) {
    const handleAddTrip = async (trip) => {
        const token = localStorage.getItem("token");
         const now = new Date().toISOString();

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/trips`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: trip.title,
                    destination: trip.destination,
                    startDate: now,
                    endDate: now,

                    notes: trip.description
                })
            });

            if (!res.ok) throw new Error("Errore durante l'aggiunta del viaggio");

            alert(`Viaggio "${trip.title}" aggiunto con successo!`);

            if (onTripAdded) onTripAdded(); 
        } catch (error) {
            console.error(error);
            alert("Errore nell'aggiunta del viaggio.");
        }
    };

    return (
        <div className="mt-5">
            <h4>🌍 Viaggi consigliati</h4>
            <div className="row">
                {suggestions.map((sug, i) => (
                    <div key={i} className="col-md-4 mb-3">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={sug.image}
                                className="card-img-top"
                                alt={sug.title}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{sug.title}</h5>
                                <p className="card-text">{sug.description}</p>
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleAddTrip(sug)}
                                >
                                    ➕ Aggiungi ai miei viaggi
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

