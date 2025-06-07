import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import it from "date-fns/locale/it";
import parseISO from "date-fns/parseISO";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button } from "react-bootstrap";

const locales = { it };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView({ trips }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());


  const events = trips.map((trip) => ({
    title: trip.title,
    start: parseISO(trip.startDate),
    end: parseISO(trip.endDate || trip.startDate),
    allDay: true,
    resource: trip._id,
  }));

  
  const handleSelectEvent = (event) => {
    const selectedId = event.resource;
    const matchedTrip = trips.find((t) => t._id === selectedId);
    if (matchedTrip) {
      setSelectedTrip(matchedTrip);
    } else {
      console.warn("Trip non trovato per ID:", selectedId);
    }
  };

  return (
    <div className="mt-4">
      <h5>📅 Calendario Viaggi</h5>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectEvent={handleSelectEvent}
        style={{ height: 500 }}
        popup
      />

      <Modal show={!!selectedTrip} onHide={() => setSelectedTrip(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTrip?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Destinazione:</strong> {selectedTrip?.destination}</p>
          {selectedTrip?.startDate && (
            <p><strong>Periodo:</strong> {new Date(selectedTrip.startDate).toLocaleDateString()} → {new Date(selectedTrip.endDate).toLocaleDateString()}</p>
          )}
          {selectedTrip?.notes && <p><strong>Note:</strong> {selectedTrip.notes}</p>}
          <p><strong>Checklist:</strong> {selectedTrip?.checklist?.length || 0} voci</p>
          <p><strong>Itinerario:</strong> {selectedTrip?.itinerary?.length || 0} giorni</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedTrip(null)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

