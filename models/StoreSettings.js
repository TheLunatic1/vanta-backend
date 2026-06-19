import mongoose from 'mongoose';

const trustSignalSchema = new mongoose.Schema({
  text: { type: String, required: true },
  icon: { type: String, default: 'Check' }
});

const storeSettingsSchema = new mongoose.Schema({
  trustSignals: [trustSignalSchema]
}, { timestamps: true });

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

export default StoreSettings;
