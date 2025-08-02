
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { getBatteryPredictionFromGuidedInput } = require('./geminiService');

// IMPORTANT: Create this file in your backend folder
const serviceAccount = require('./firebase-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify Firebase ID token
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: No token provided.');
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).send('Forbidden: Invalid token.');
  }
};

// --- AUTH ROUTES ---
// Note: Registration and Login are handled by the Firebase Client SDK on the frontend.
// The backend's role is to protect routes by verifying the token the client sends.

// --- API ROUTES ---

// Protected route for guided analysis
app.post('/api/analyze-guided', authenticate, async (req, res) => {
  const { vehicleModel, originalCapacityKwh, odometerKm, chargingHabit } = req.body;
  const userId = req.user.uid; // User ID from authenticated token

  if (!vehicleModel || !originalCapacityKwh || !odometerKm || !chargingHabit) {
    return res.status(400).send('Missing required analysis parameters.');
  }

  try {
    console.log(`[${userId}] Starting analysis for ${vehicleModel}...`);
    const analysisResult = await getBatteryPredictionFromGuidedInput({
      vehicleModel,
      originalCapacityKwh,
      odometerKm,
      chargingHabit,
    });
    
    // In a real app, you would save this result to a database (e.g., Firestore)
    // await db.collection('users').doc(userId).collection('analyses').add(analysisResult);
    
    res.status(200).json(analysisResult);

  } catch (error) {
    console.error('Error during guided analysis:', error);
    res.status(500).send('An error occurred while analyzing the battery data.');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});