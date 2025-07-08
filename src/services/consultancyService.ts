import APIBase from './httpBase'
// Importamos la interfaz que ya definimos en el composable para mantener consistencia.
import { type IManager } from '@/composables/useManagers'

class ConsultancyService extends APIBase {
  async submitConsultancyForm(businessId: string, data: FormData) {
    return this.post<unknown>(`business/consultancy-data/${businessId}`, data, {})
  }

  async getBusinessManagers(businessId: string) {
    return this.get<{ data: IManager[] }>(`business/${businessId}/managers`)
  }

  async addManagerToBusiness(businessId: string, managerData: Omit<IManager, '_id'>) {
    return this.post<{ data: IManager[] }>(`business/${businessId}/managers`, managerData)
  }

  async removeManagerFromBusiness(businessId: string, managerId: string) {
    return this.delete<unknown>(`business/${businessId}/managers/${managerId}`)
  }
}

export const consultancyService = new ConsultancyService()
