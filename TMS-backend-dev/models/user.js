import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [5, 'Name is too short'],
    maxLength: [50, 'Name is too long'],
    match: [
      /^[A-Za-z][A-Za-z'-]{1,}(?:\s[A-Za-z][A-Za-z'-]{0,}){1,2}$/,
      'Format: "First Last" or "First Middle Last"'],
    trim: true
  },

  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [4, 'Username too short'],
    maxlength: [20, 'Username too long'],
    match: [
      /^[a-zA-Z0-9](?!.*__)[a-zA-Z0-9_]{2,18}[a-zA-Z0-9]$/,
      'Username: 4–20 characters, letters/numbers only at start/end, underscores allowed but no __.'
    ],
    unique: true,
    trim: true,
    lowercase: true,
    immutable: true
  },

  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'You must be at least 18 years old'],
    max: [65, 'Age must not be above 65'],
    validate: {
      validator: Number.isInteger,
      message: 'Age must be a whole number'
    }
  },

  nationalid: {
    type: String,
    required: [true, 'ID number is required'],
    minlength: [11, 'ID must be exactly 11 characters'],
    maxlength: [11, 'ID must be exactly 11 characters'],
    match: [/^[a-zA-Z0-9]{11}$/, 'ID must be 11 alphanumeric characters'],
    unique: true,
    uppercase: true,
    trim: true,
    immutable: true
  },

  phonenumber: {
    type: String,
    unique: true,
    required: [true, 'Phone number is required'],
    match: [/^0\d{10}$/, 'Phone number must be 11 digits and start with 0'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      'Must be a valid email (e.g. user@example.com)'
    ],
    lowercase: true,
    trim: true,
    unique: true,
    immutable: true
  },

  gender: {
    type: String,
    required: [true, "Gender selection is required"],
    enum: ["male", "female", "other"],
    trim: true,
    immutable: true
  },

  maritalstatus: {
    type: String,
    required: [true, 'Marital status selection is required'],
    enum: ["single", "married", "divorced", "widowed", "separated"],
    trim: true
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password too short'],
    maxlength: [100, 'Password too long'],
    validate: {
      validator: function (value) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/.test(value);
      },
      message:
        'Password must contain an uppercase letter, a number, and a symbol'
    }
  },

  isActive: {
    type: String,
    enum: ['true', 'false'],
    default: 'true'
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });


// Hash password AFTER validation

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});


export default mongoose.model('User', userSchema);