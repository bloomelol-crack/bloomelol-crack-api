import mongoose from 'mongoose';

import leanDefaults from 'mongoose-lean-defaults';

export const account = mongoose.model(
  'Account',
  new mongoose.Schema(
    {
      UserName: { type: String, required: true },
      Password: { type: String, required: true },
      NewPassword: String,
      FromUrl: String,
      Email: String,
      EmailVerified: Boolean,
      NewEmail: String,
      LOL: {
        Region: String,
        BlueEssence: Number,
        Level: Number,
        RP: Number,
        Refunds: Number,
        Champs: Number,
        Skins: Number,
        Elo: String,
        Images: [String],
        LastPlay: Date
      },
      HasValorant: Boolean,
      Valorant: {},
      MachineIndex: Number,
      Price: Number,
      UserID: String,
      PaymentID: String,
      NotInRegions: [String]
    },
    { collection: 'Accounts', timestamps: true }
  ).plugin(leanDefaults)
);
