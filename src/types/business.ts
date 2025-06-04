// types/business.ts
export interface Business {
  _id: string;
  name: string;
  menuRestaurantePath?: string;
  costoPorPlatoPath?: string;
  ventasMovimientosPath?: string;
  ventasProductosPath?: string;
  ventasClientePath?: string;
  // agrega otros campos que necesites
}
