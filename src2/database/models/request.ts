import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export interface RequestDoc {
  _id?: string;
  uid: string;
  env?: string;
  url: string;
  method: string;
  failed?: boolean;
  headers: any;
  body: any;
  params: any;
  response: {
    status?: string;
    body?: any;
    headers?: any;
  };
  createdAt?: Date;
}

export default mongoose.model(
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
