import express from "express";
import Trip from "../models/Trip.js";
import authenticateToken from "../middleware/authMiddleware.js";
import cloudinaryUploader from "../utils/cloudinary.js";
import sendTripReminder from '../utils/sendTripReminder.js';

const router = express.Router();

//  Rotta di test invio email
router.get('/test-notifica', async (req, res) => {
  try {
    await sendTripReminder();
    res.status(200).send('✅ Email di test inviata (se ci sono viaggi tra 3 giorni)');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Errore durante l’invio');
  }
});

// GET /trips
// Restituisce tutti i viaggi dell'utente autenticato
router.get("/", authenticateToken, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id });
    res.json(trips);
  } catch (err) {
    console.error("Errore fetch viaggi:", err);
    res.status(500).json({ error: "Errore durante il recupero dei viaggi" });
  }
});


// POST /trips
// Crea un nuovo viaggio
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, destination, startDate, endDate, notes, checklist, itinerary } = req.body;
    const newTrip = new Trip({
      title,
      destination,
      startDate,
      endDate,
      notes,
      checklist: checklist || [],
      itinerary: itinerary || [],
      documents: [],
      user: req.user._id
    });
    const saved = await newTrip.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Errore creazione viaggio:", err);
    res.status(400).json({ error: "Errore durante la creazione del viaggio" });
  }
});

// PUT /trips/:id
// Aggiorna un viaggio esistente
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updates = { ...req.body };
    const updated = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Viaggio non trovato" });
    res.json(updated);
  } catch (err) {
    console.error("Errore aggiornamento viaggio:", err);
    res.status(400).json({ error: "Errore durante l'aggiornamento del viaggio" });
  }
});

// DELETE /trips/:id
// Elimina un viaggio
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!deleted) return res.status(404).json({ error: "Viaggio non trovato" });
    res.json({ message: "Viaggio eliminato con successo" });
  } catch (err) {
    console.error("Errore eliminazione viaggio:", err);
    res.status(500).json({ error: "Errore durante la cancellazione del viaggio" });
  }
});

// POST /:id/upload
// Crea un nuovo upload
router.post("/:id/upload", authenticateToken, cloudinaryUploader.single("document"), async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
//     console.log("Upload richiesto per trip ID:", req.params.id);
// console.log("Trip trovato:", trip);
// console.log("Path file:", req.file?.path);

    if (!trip) return res.status(404).json({ error: "Viaggio non trovato" });

    trip.documents.push(req.file.path); 
    await trip.save();

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/documents", authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    // console.log("Documenti attuali:", trip.documents);

    if (!trip) return res.status(404).json({ error: "Viaggio non trovato" });

    const { documentUrl } = req.body;
    if (!documentUrl) return res.status(400).json({ error: "URL documento mancante" });

    trip.documents = trip.documents.filter((url) => url !== documentUrl);
    await trip.save();

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /trips/:id/checklist
router.patch("/:id/checklist", authenticateToken, async (req, res) => {
  try {
    const { checklist } = req.body;
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { checklist },
      { new: true }
    );
    if (!trip) return res.status(404).json({ error: "Viaggio non trovato" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: "Errore aggiornamento checklist" });
  }
});

// GET /trips/:id
// Restituisce un singolo viaggio
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!trip) return res.status(404).json({ error: "Viaggio non trovato" });
    res.json(trip);
  } catch (err) {
    console.error("Errore fetch viaggio:", err);
    res.status(500).json({ error: "Errore nel recupero del viaggio" });
  }
});






export default router;
