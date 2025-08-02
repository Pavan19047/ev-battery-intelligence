
require('dotenv').config();
const { GoogleGenAI, Type } = require("@google/genai");

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set. The backend cannot start.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    rul: { type: Type.INTEGER, description: "Predicted Remaining Useful Life in charge cycles." },
    soh_score: { type: Type.INTEGER, description: "Overall battery State of Health (SoH) as a percentage, 0-100." },
    alert_level: { type: Type.STRING, enum: ['nominal', 'warning', 'critical'] },
    degradation_cause: { type: Type.STRING, description: "Human-readable analysis of the primary cause for battery degradation." },
    recommendation: { type: Type.STRING, description: "A single, actionable pro-tip for the user to extend battery life." },
    next_steps: { type: Type.STRING, description: "Crucial, detailed next steps for 'warning' or 'critical' alerts." },
    confidence: { type: Type.NUMBER, description: "Confidence score for the prediction, 0.0 to 1.0." }
  },
  required: ['rul', 'soh_score', 'alert_level', 'degradation_cause', 'recommendation', 'next_steps', 'confidence']
};

const getChargingHabitContext = (habit) => {
    switch (habit) {
        case 'Charge to 100%':
            return "The user reports a typical charging habit of 'Charge to 100%'. This behavior is known to induce higher stress on lithium-ion cells by keeping them at a high state-of-charge, which can accelerate capacity fade over time.";
        case 'Charge to 80%':
            return "The user follows the best practice of typically charging to 80% for daily use. This significantly reduces battery stress and is optimal for long-term health.";
        case 'Irregular':
            return "The user reports irregular charging habits. This could involve frequent deep discharges or leaving the battery at very high or very low states of charge for extended periods, which can be detrimental.";
        default:
            return "User charging habit not specified.";
    }
};

const getSimulatedMetrics = (odometerKm, originalCapacityKwh) => {
    const degradationFactor = Math.min(odometerKm / 150000, 0.5); // Assume max 50% degradation at 150k km for simulation
    const voltage = 380 - (degradationFactor * 40); // Simulate voltage drop with age
    const temperature = 28 + (degradationFactor * 10); // Simulate slightly higher temps in older batteries
    return { voltage, temperature };
}

const getBatteryPredictionFromGuidedInput = async (inputs) => {
  const { vehicleModel, originalCapacityKwh, odometerKm, chargingHabit } = inputs;
  
  const chargingContext = getChargingHabitContext(chargingHabit);
  const { voltage, temperature } = getSimulatedMetrics(odometerKm, originalCapacityKwh);

  const prompt = `
    You are an AI model simulating an EV battery's Predictive Digital Twin. Your task is to perform a comprehensive health and safety analysis based on user-provided vehicle history and simulated real-time data.

    **Vehicle Profile:**
    - Model: ${vehicleModel}
    - Original Capacity: ${originalCapacityKwh} kWh
    - Odometer: ${odometerKm} km. This suggests the vehicle has undergone a moderate number of charge-discharge cycles.
    - User Charging Habit Analysis: ${chargingContext}

    **Simulated Real-Time Sensor Data (for context):**
    - Voltage: ${voltage.toFixed(2)} V
    - Temperature: ${temperature.toFixed(1)} °C

    Analyze this complete profile and provide a structured JSON response.

    **Analysis Guidelines:**
    1.  **SOH & RUL:** A high odometer reading and stressful charging habits (like charging to 100%) should lead to a lower SOH and RUL. A low odometer and good habits (charging to 80%) should result in high SOH.
    2.  **Alert Level:**
        -   'critical': If odometer is very high (>120,000 km) AND charging habit is poor.
        -   'warning': If odometer is moderate-to-high (60,000-120,000 km) OR charging habit is poor.
        -   'nominal': For newer vehicles with good habits.
    3.  **Degradation Cause:** Explain the 'why'. Link the odometer and charging habits directly to the predicted SOH.
    4.  **Next Steps:** Must match the alert level. A 'critical' alert for an old battery needs to recommend a professional inspection.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
        temperature: 0.5,
      },
    });

    const jsonString = response.text.replace(/^```json\n?/, '').replace(/```$/, '');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error in getBatteryPrediction:", error);
    throw new Error("Failed to get or parse prediction from AI.");
  }
};

module.exports = { getBatteryPredictionFromGuidedInput };