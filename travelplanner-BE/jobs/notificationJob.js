import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import sendTripReminder from '../utils/sendTripReminder.js';
import connectDB from '../db.js'; 


connectDB().then(() => {
  console.log("✅ Job connesso a MongoDB");

  cron.schedule('* * * * *', async () => {
    console.log('🔔 Esecuzione job promemoria viaggi');
    await sendTripReminder();
  });
});

