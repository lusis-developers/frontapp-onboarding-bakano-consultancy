export interface IMeetingDetails {
  id: string
  status: string
  meetingType: string
  assignedTo: string
  scheduledTime: string // Viene como string ISO
  meetingLink: string
}

export interface IMeetingStatusResponse {
  hasScheduledMeeting: boolean
  meeting?: IMeetingDetails
  message?: string
}
