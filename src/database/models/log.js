import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export const log = mongoose.model(
  'Log',
  new mongoose.Schema(
    {
      IP: String,
      Data: { type: mongoose.SchemaTypes.Mixed, required: true }
    },
    { collection: 'Logs', timestamps: true }
  ).plugin(leanDefaults)
);
