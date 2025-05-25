# TravelPlanner – App

TravelPlanner è un'applicazione completa per organizzare viaggi personali con itinerari, checklist e caricamento immagini.

# Struttura

- `travelplanner-BE/` – Backend (Express, MongoDB, JWT, Cloudinary)
- `travelplanner-FE/` – Frontend React con dashboard, login, registrazione

# Avvio Locale

# Backend

```bash
cd travelplanner-BE
npm install
npm run dev
```
Crea un file `.env` con:

```
PORT=3001
MONGO_URL=mongodb+srv://<utente>:<password>@<cluster>.mongodb.net/travelplanner
JWT_SECRET=travelsecret
CLOUDINARY_NAME=xxx
CLOUDINARY_KEY=xxx
CLOUDINARY_KEY_SECRET=xxx
```

# Frontend

```bash
cd travelplanner-FE
npm install
npm start
```

# Deploy
- Backend su **Render** (Node)
- Frontend su **Vercel** (React)

# Funzionalità
- Registrazione/Login con JWT
- Dashboard viaggi personali
- Checklist + Itinerario per viaggio
- Upload immagini/documenti via Cloudinary