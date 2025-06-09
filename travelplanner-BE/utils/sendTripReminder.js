import dotenv from 'dotenv';
dotenv.config();

import sgMail from '@sendgrid/mail';
import Trip from '../models/Trip.js';
import User from '../models/User.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendTripReminder = async () => {
  const today = new Date();
  const in2Days = new Date(today);
  in2Days.setDate(today.getDate() + 2);

  const trips = await Trip.find({
    startDate: {
      $gte: new Date(in2Days.setHours(0, 0, 0, 0)),
      $lt: new Date(in2Days.setHours(23, 59, 59, 999)),
    },
  }).populate('user');

  // console.log("📬 Viaggi trovati:", trips.map(t => ({
  //   user: t.user?.email,
  //   title: t.title,
  //   start: t.startDate
  // })));

//   const allTrips = await Trip.find().populate('user');
// console.log("📋 Tutti i viaggi:", allTrips.map(t => ({
//   title: t.title,
//   email: t.user?.email,
//   start: t.startDate
// })));


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

