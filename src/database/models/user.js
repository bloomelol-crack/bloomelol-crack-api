import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

import { LANGUAGES } from '../../routes/schemas/user/constants';

export const user = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      Name: { type: String, required: true },
      Surname: { type: String, required: true },
      Email: { type: String, required: true },
      Password: { type: String, required: true },
      Language: { type: String, default: LANGUAGES.EN },
      EmailVerified: { type: Boolean, default: false },
      ConfirmID: String,
      Hacks: [
        {
          Code: String,
          Enabled: Boolean,
          AllowedSessions: Number,
          PaymentID: String,
          ExpirationDate: Date,
          Controls: [
            {
              Code: String,
              keys: String
            }
          ]
        }
      ],
      Permissions: {
        ViewLogins: { type: Boolean, default: false }
      }
    },
    { collection: 'Users' }
  ).plugin(leanDefaults)
);
