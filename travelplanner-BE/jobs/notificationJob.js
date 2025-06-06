import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import sendTripReminder from '../utils/sendTripReminder.js';

// Avvia ogni giorno alle 8:00 di mattina
cron.schedule('0 8 * * *', async () => {
  console.log('🔔 Controllo viaggi in partenza tra 2 giorni...');
  await sendTripReminder();
});
