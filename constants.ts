import { Battery } from './types';

export const MOCK_BATTERIES: Battery[] = [
  {
    id: 'B-001-A',
    name: 'Tesla Model S - Unit 734 (Normal)',
    model: 'Panasonic 18650',
    initialMetrics: {
      voltage: 400.2,
      current: 15.5,
      temperature: 28.5,
    },
  },
  {
    id: 'B-005-E',
    name: 'Hyundai Ioniq 5 - Unit 101 (New)',
    model: 'E-GMP Platform Battery',
    initialMetrics: {
      voltage: 653.0,
      current: -10.0, // charging
      temperature: 24.0,
    },
  },
  {
    id: 'B-002-C',
    name: 'Nissan Leaf - Fleet 12 (Worn)',
    model: 'AESC 33Ah',
    initialMetrics: {
      voltage: 355.8,
      current: 45.2, // High discharge
      temperature: 38.1,
    },
  },
  {
    id: 'B-003-B',
    name: 'Chevy Bolt - Commuter 5 (Critical)',
    model: 'LG Chem 65kWh',
    initialMetrics: {
      voltage: 340.1, // Low voltage for state
      current: 55.8, // Very high current
      temperature: 55.0, // Dangerously high temp
    },
  },
    {
    id: 'B-004-D',
    name: 'Ford Mustang Mach-E - Exec 1 (Idle)',
    model: 'SK Innovation 98kWh',
    initialMetrics: {
      voltage: 450.0,
      current: -0.1, 
      temperature: 22.8,
    },
  },
];
