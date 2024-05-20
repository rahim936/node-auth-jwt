import { Schema, model } from 'mongoose';

const UserModelSchema = new Schema(
  {
    username: {
      type: String,
      index: true,
      lowercase: true,
      unique: [true, 'Username already in use'],
      required: [true, 'Username is required.'],
      maxLength: [12, 'Username is too long/'],
      minLenght: [4, 'Username must be 4 characters long'],
      match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username can't start or end with . or _ and must be 4 characters long."],
    },
    email: {
      type: String,
      index: true,
      lowecase: true,
      unique: [true, 'Email already exists.'],
      required: [true, 'Email is required.'],
      match: [/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Please provie a valid email address.'],
    },
    password: {
      type: String,
      index: true,
      unique: true,
      required: [true, 'Password is required.'],
      minLength: [8, 'Password must be at-least 8 characters long'],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[~`'"\[{\]}!@#$%^&*(=+-_)\\<,.?>\/])[a-zA-Z\d~`'"\[{\]}!@#$%^&*(=+-_)\\<,.?>\/]{8,}$/,
        'Password must contain one uppercase letter, one lowecase letter, one digit, one special character and must be 8 characters long',
      ],
    },
    refreshToken: {
      type: String,
      unique: true,
      index: true,
    },
    accessToken: {
      type: String,
      unique: true,
      index: true,
    },
    jwtID: {
      type: String,
      unique: true,
    },

  },
  { timestamps: true }
);

const UserModel = model('User', UserModelSchema);

export default UserModel;
