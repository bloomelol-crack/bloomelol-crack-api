import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export interface ServerDoc {
  _id?: string;
  Url: string;
  PageNumber: string;
  InitialPageNumber: string;
}

export default mongoose.model(
  'Server',
  new mongoose.Schema(
    {
      Url: { type: String, required: true },
      PageNumber: { type: Number, required: true },
      InitialPageNumber: { type: Number, required: true }
    },
    { collection: 'Servers' }
  ).plugin(leanDefaults)
);
