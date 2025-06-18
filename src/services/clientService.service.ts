import APIBase from './httpBase'
import type { Client } from '@/types/client'
import type { AxiosResponse } from 'axios'
import type { IMeetingStatusResponse } from '@/types/responses/IMeetingStatusResponse'

class ClientService extends APIBase {
  async getClientAndBusiness(clientId: string, businessId: string) {
    return this.get<{ client: Client }>(`client/${clientId}/business/${businessId}`)
  }

  async getClientMeetingStatus(clientId: string): Promise<AxiosResponse<IMeetingStatusResponse>> {
    return this.get<IMeetingStatusResponse>(`clients/${clientId}/meeting-status`)
  }
}

export const clientService = new ClientService()
