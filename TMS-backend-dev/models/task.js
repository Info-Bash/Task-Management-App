import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    maxlength: [100, 'Task title cannot exceed 100 characters'],
    trim: true
  },

  desc: {
    type: String,
    required: [true, 'Task description is required'],
    maxlength: [1000, 'Task description cannot exceed 1000 characters'],
    trim: true
  },

  status: {
    type: String,
    enum: ['pending', 'completed', 'verified'],
    default: 'pending',
  },

  dateCompleted: {
    type: Date,
    default: null
  },

  dateVerified: {
    type: Date,
    default: null
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

// Auto set completion date
taskSchema.pre("save", function () {
  if (this.isModified("status")) {
    if (this.status === "completed" && !this.dateCompleted) {
      this.dateCompleted = new Date();
    }

    if (this.status === "verified" && !this.dateVerified) {
      this.dateVerified = new Date();
    }
  }

});

taskSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  const status = update.status || update.$set?.status;

  if (status === "completed") {
    update.$set = { ...update.$set, dateCompleted: new Date() };
  }

  if (status === "verified") {
    update.$set = { ...update.$set, dateVerified: new Date() };
  }

});



// For faster filtering
taskSchema.index({ owner: 1, status: 1, title: 1, createdAt: -1 });

// Prevent duplicate task titles per user
taskSchema.index({ owner: 1, title: 1 }, { unique: true });

export default mongoose.model('Task', taskSchema);
