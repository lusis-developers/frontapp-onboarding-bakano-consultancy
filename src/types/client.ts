// src/types/client.ts

import type { Business } from './business'

export interface PaymentInfo {
  preferredMethod: string
  lastPaymentDate: string | null
  cardType?: string
  cardInfo?: string
  bank?: string
}

export interface Client {
  _id: string
  name: string
  email: string
  phone: string
  country: string
  city: string
  dateOfBirth: string
  businesses: Business[]
  transactions: string[]
  paymentInfo: PaymentInfo
}
