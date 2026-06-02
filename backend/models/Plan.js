import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  concern: {
    type: String,
    required: true
  },
  dietChart: {
    type: Object,
    required: true
  },
  workoutPlan: {
    type: Object,
    required: true
  }
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
