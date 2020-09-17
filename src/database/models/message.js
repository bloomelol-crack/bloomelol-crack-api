import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export const message = mongoose.model(
  'Message',
  new mongoose.Schema(
    {
      Uid: { type: String, required: true },
      UserID: { type: String, required: true },
      UserName: String,
      UserSurname: String,
      Text: { type: String, required: true },
      Status: {
        type: String,
        required: true,
        enum: ['Sent', 'Received']
      }
    },
    { collection: 'Messages', timestamps: true }
  ).plugin(leanDefaults)
);
