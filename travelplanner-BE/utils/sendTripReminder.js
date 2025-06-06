import sgMail from '@sendgrid/mail';
import Trip from '../models/Trip.js';
import User from '../models/User.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendTripReminder = async () => {
  const today = new Date();
  const in3Days = new Date(today);
  in3Days.setDate(today.getDate() + 3);

  const trips = await Trip.find({
    startDate: {
      $gte: in3Days.toISOString().slice(0, 10),
      $lte: new Date(in3Days.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  }).populate('user');

  for (const trip of trips) {
    if (!trip.user || !trip.user.email) continue;

    const msg = {
      to: trip.user.email,
      from: process.env.SENDGRID_SENDER,
      subject: `Promemoria viaggio: ${trip.title}`,
      text: `Ciao ${trip.user.name},\n\nHai un viaggio a ${trip.destination} che inizia tra 3 giorni!\n\nControlla itinerario e checklist su TravelPlanner.`,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Email inviata a ${trip.user.email}`);
    } catch (error) {
      console.error('❌ Errore invio email:', error.response?.body || error.message);
    }
  }
};

export default sendTripReminder;

