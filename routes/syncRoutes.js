// routes/syncRoutes.js
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
      range: 'Sheet1!A:J',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return { success: true, message: 'No data found in sheet' };
    }

    const sheetProductIDs = new Set();
    let syncedCount = 0;
    let deletedCount = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue;

      const productID = row[0];

      // Skip special rows (HERO-BG, TRUST-*)
      if (productID === 'HERO-BG' || productID.startsWith('TRUST-')) {
        continue;
      }

      sheetProductIDs.add(productID);

      const productData = {
        productID: productID,
        title: row[1],
        description: row[2],
        price: parseFloat(row[3]) || 0,
        salePrice: row[4] ? parseFloat(row[4]) : null,
        images: row[5] ? row[5].split(',').map(url => url.trim()) : [],
        category: row[6],
        subcategory: row[7] || '',
        variants: row[8] || '',
        sku: row[9] || '',
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

    // Delete products removed from sheet
    const allProducts = await Product.find({});
    for (const product of allProducts) {
      if (!sheetProductIDs.has(product.productID)) {
        await Product.findOneAndDelete({ productID: product.productID });
        deletedCount++;
      }
    }

    console.log(`✅ Synced ${syncedCount} products | Deleted ${deletedCount} old products`);
    return { success: true, message: `Synced ${syncedCount} | Deleted ${deletedCount}` };

  } catch (error) {
    console.error('❌ Sync Error:', error.message);
    return { success: false, message: error.message };
  }
}

// Auto Sync (Local only)
if (process.env.NODE_ENV !== 'production') {
  cron.schedule('*/2 * * * *', async () => {
    console.log('🔄 Running scheduled Google Sheet sync...');
    await syncGoogleSheet();
  });
}

// Manual Sync
router.get('/manual', async (req, res) => {
  const result = await syncGoogleSheet();
  res.json(result);
});

router.post('/manual', async (req, res) => {
  const result = await syncGoogleSheet();
  res.json(result);
});

export default router;