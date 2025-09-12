export interface IHandoffData {
  _id: string
  salesSummary: string
  clientExpectations: string
  billingSegment: string
  clientExpectedOutcome: string
  handoffBy: string
  handoffDate: Date
  notes?: string
  // Brand Identity Fields
  brandPrimaryColor?: string
  brandSecondaryColor?: string
  brandTypographyName?: string
}

export interface IManager {
  _id: string
  name: string
  email: string
  role?: string
}

export interface Business {
  _id: string
  name: string
  ruc?: string
  address?: string
  businessType: string
  phone?: string
  email?: string
  managers: IManager[]
  owner: string
  vendePorWhatsapp?: boolean
  createdAt: Date
  updatedAt: Date
  desafioPrincipal?: string
  empleados?: string
  gananciaWhatsapp?: string
  ingresoAnual?: string
  ingresoMensual?: string
  instagram?: string
  meetingReminder1hSent?: boolean
  meetingReminder24hSent?: boolean
  objetivoIdeal?: string
  onboardingStep: string
  tiktok?: string
  menuRestaurantePath?: string | string[]
  costoPorPlatoPath?: string
  ventasMovimientosPath?: string
  ventasProductosPath?: string
  ventasClientePath?: string
  dataSubmissionCompletedAt?: Date
  meetingScheduledAt?: Date
  meetingDateTime?: Date
  meetingLink?: string
  lastDataReminderSentAt?: Date
  lastScheduleMeetingReminderSentAt?: Date
  handoffData?: IHandoffData
  // Brand Identity Fields
  brandLogoPath?: string
  brandPrimaryColor?: string
  brandSecondaryColor?: string
  brandTypographyName?: string
  brandTypographyPath?: string
  brandUsageExamplesPath?: string
  // Checklist Reference
  checklistId?: string
}
