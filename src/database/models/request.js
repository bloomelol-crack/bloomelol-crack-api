import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export const request = mongoose.model(
  'Request',
  new mongoose.Schema(
    {
      uid: { type: String, required: true },
      env: String,
      url: { type: String, required: true },
      method: { type: String, required: true },
      failed: { type: Boolean, default: false },
      headers: {},
      body: {},
      params: {},
      response: {
        status: { type: String, default: 'unknown' },
        body: {},
        headers: {}
      },
      createdAt: { type: Date, default: Date.now }
    },
    { collection: 'Requests' }
  ).plugin(leanDefaults)
);
