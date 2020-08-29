import mongoose from 'mongoose';
import leanDefaults from 'mongoose-lean-defaults';

export interface UserDoc {
  _id?: string;
  Name: string;
  Surname: string;
  Email: string;
  Password: string;
}

export default mongoose.model(
  'User',
  new mongoose.Schema(
    {
      Name: { type: String, required: true },
      Surname: { type: String, required: true },
      Email: { type: String, required: true },
      Password: { type: String, required: true }
    },
    { collection: 'Users' }
  ).plugin(leanDefaults)
);
