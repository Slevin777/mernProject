import { User as IUser } from '@/interfaces/usersInterface';
import { Schema, model, Document } from 'mongoose';

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      default: 'Employee',
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

const userModel = model<IUser & Document>('User', userSchema);

export default userModel;
