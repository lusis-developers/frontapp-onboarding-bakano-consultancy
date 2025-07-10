import type { MeetingStatus, MeetingType } from '@/anums/meetingStatus.enum'
import type { Business } from './business'
import type { Client } from './client'

export interface IMeeting {
  client?: string | Client
  business?: string | Business
  assignedTo: string
  status: MeetingStatus
  meetingType: MeetingType
  scheduledTime: Date
  endTime: Date
  meetingLink?: string
  source: string
  sourceId: string
  createdAt: Date
  attendeeEmail?: string
  attendeePhone?: string
}
