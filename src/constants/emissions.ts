/**
 * Emission calculation factors and thresholds.
 * Centralized for easy auditing and country-specific overrides.
 */

export const EMISSIONS_FACTORS = {
  // Transport factors (CO2 kg per km by mode)
  TRANSPORT_MODES: {
    CAR: 1.0,
    CARPOOL: 0.75,
    PUBLIC_TRANSIT: 0.5,
    BIKE: 0.15,
    ELECTRIC: 0.1,
    WALKING: 0.0,
  },
  
  // Rideshare frequency (kg CO2 per week)
  RIDESHARE: {
    NEVER: 0,
    WEEKLY: 0.8,
    BIWEEKLY: 2.0,
    DAILY: 4.5,
  },
  
  // Flight factors (kg CO2 per passenger-km)
  FLIGHTS: {
    SHORT_HAUL: 0.255,
    LONG_HAUL: 0.195,
    SHORT_HAUL_DISTANCE_KM: 800,
    LONG_HAUL_DISTANCE_KM: 4000,
    SHORT_HAUL_DISTANCE_MILES: 500,
    LONG_HAUL_DISTANCE_MILES: 2500,
  },
  
  // Energy factors
  ENERGY: {
    HEATING_BILL_FRACTION: 0.3,
    HEATING_FUEL_MULTIPLIERS: {
      OIL: 1.0,
      GAS: 0.6,
      ELECTRIC: 1.5,
      RENEWABLE: 0.05,
    },
  },
  
  // Diet base (kg CO2 per year)
  DIET: {
    VEGAN: 1500,
    VEGETARIAN: 1900,
    PESCATARIAN: 2500,
    MEAT_MODERATE: 2500,
    MEAT_HEAVY: 3300,
    LOCAL_MULTIPLIERS: { HIGH: 0.85, MEDIUM: 1.0, LOW: 1.2 },
    WASTE_MULTIPLIERS: { LOW: 0.85, MEDIUM: 1.0, HIGH: 1.3 },
  },
  
  // Waste factors
  WASTE: {
    GARBAGE_BAG_CO2_PER_YEAR: 2.5,
    RECYCLING_MULTIPLIERS: { HIGH: 0.4, MEDIUM: 0.7, NONE: 1.0 },
    SHOPPING_BASE_KG: { HIGH: 2500, MEDIUM: 1500, LOW: 800 },
  },
  
  // Time conversion
  WEEKS_PER_YEAR: 52,
  PUBLIC_TRANSIT_SAVING_PER_HOUR: 0.5,
  
  // Unit conversion
  MILES_TO_KM: 1.609,
} as const;
