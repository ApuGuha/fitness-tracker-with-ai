import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { generatePlan, getPlans, getPlanById, getAvailableModels } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/ai/models', getAvailableModels);

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Profile routes (protected)
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

// AI Plan routes (protected)
router.post('/ai/generate-plan', requireAuth, generatePlan);
router.get('/plans', requireAuth, getPlans);
router.get('/plans/:id', requireAuth, getPlanById);

export default router;
