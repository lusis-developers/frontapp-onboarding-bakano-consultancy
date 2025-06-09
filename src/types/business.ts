export interface Business {
  _id: string
  name: string
  owner: string
  vendePorWhatsapp: boolean
  createdAt: Date
  updatedAt: Date
  desafioPrincipal: string
  empleados: string
  gananciaWhatsapp: string
  ingresoAnual: string
  ingresoMensual: string
  instagram: string
  meetingReminder1hSent: boolean
  meetingReminder24hSent: boolean
  objetivoIdeal: string
  onboardingStep: string
  tiktok: string
  menuRestaurantePath?: string
  costoPorPlatoPath?: string
  ventasMovimientosPath?: string
  ventasProductosPath?: string
  ventasClientePath?: string

  // agrega otros campos que necesites
}
