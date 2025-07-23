import APIBase from './httpBase'
import type { Client } from '@/types/client'
import type { AxiosResponse } from 'axios'
import type { IMeetingStatusResponse } from '@/types/responses/IMeetingStatusResponse'

class ClientService extends APIBase {
  async getClientAndBusiness(clientId: string, businessId: string) {
    return this.get<{ client: Client }>(`client/${clientId}/business/${businessId}`)
  }

  public async getClientMeetingStatus(
    clientId: string,
    businessId?: string,
  ): Promise<AxiosResponse<IMeetingStatusResponse>> {
    let url = `clients/${clientId}/meeting-status`

    if (businessId) {
      url += `?businessId=${businessId}`
    }
    return this.get<IMeetingStatusResponse>(url)
  }
}

export const clientService = new ClientService()
