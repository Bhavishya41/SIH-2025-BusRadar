const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  driverName: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  password: {
    type: "string",
    require: "true"
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastUpdate: { type: Date, default: Date.now },
});

BusSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Bus', BusSchema);
