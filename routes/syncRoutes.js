import express from 'express';
import { google } from 'googleapis';
import Product from '../models/Product.js';
import cron from 'node-cron';

const router = express.Router();

async function syncGoogleSheet() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:I',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return { success: true, message: 'No data found' };
    }

    let syncedCount = 0;

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue; // Skip empty ProductID

      const productData = {
        productID: row[0],
        title: row[1],
        description: row[2],
        price: parseFloat(row[3]) || 0,
        salePrice: row[4] ? parseFloat(row[4]) : null,
        images: row[5] ? row[5].split(',').map(url => url.trim()) : [],
        category: row[6],
        variants: row[7] || '',
        sku: row[8] || '',
        status: 'Active',
        updatedAt: new Date()
      };

      await Product.findOneAndUpdate(
        { productID: productData.productID },
        productData,
        { upsert: true, new: true }
      );
      syncedCount++;
    }

    console.log(`✅ Synced ${syncedCount} products successfully`);
    return { success: true, message: `Synced ${syncedCount} products` };
  } catch (error) {
    console.error('❌ Sync Error:', error.message);
    return { success: false, message: error.message };
  }
}

// Auto Sync every 2 minutes
cron.schedule('*/2 * * * *', async () => {
  console.log('🔄 Running scheduled Google Sheet sync...');
  await syncGoogleSheet();
});

// Manual Sync Endpoint
router.post('/manual', async (req, res) => {
  const result = await syncGoogleSheet();
  res.json(result);
});

// Get sync status
router.get('/status', (req, res) => {
  res.json({ message: 'Auto sync is running every 2 minutes' });
});

export default router;