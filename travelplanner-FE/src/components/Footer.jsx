import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0">© {new Date().getFullYear()} TravelPlanner. Tutti i diritti riservati.</p>
        <small>Creato con ❤️ da Claudia</small>
      </div>
    </footer>
  );
}
