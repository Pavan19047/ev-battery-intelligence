export interface BatteryMetrics {
  voltage: number; // Volts
  current: number; // Amperes
  temperature: number; // Celsius
}

export interface Battery {
  id: string;
  name: string;
  model: string;
  initialMetrics: BatteryMetrics;
}

export interface Prediction {
  rul: number; // Remaining Useful Life in cycles
  soh_score: number; // State of Health Score, 0-100
  alert_level: 'nominal' | 'warning' | 'critical';
  degradation_cause: string;
  recommendation: string;
  next_steps: string; // Detailed instructions for warning/critical alerts
  confidence: number; // 0-1
}

export interface HistoricalData {
  cycle: number;
  health: number;
}
