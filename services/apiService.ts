
import { Prediction } from '../types';

// The backend server URL. For local dev, this will be localhost.
const API_BASE_URL = 'http://localhost:3001';

export const analyzeBatteryGuided = async (data: any, token: string): Promise<Prediction> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-guided`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const result: Prediction = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch battery analysis:", error);
    throw error;
  }
};
