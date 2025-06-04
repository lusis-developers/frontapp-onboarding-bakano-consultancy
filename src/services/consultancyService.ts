import APIBase from "./httpBase";

class ConsultancyService extends APIBase {
  async submitConsultancyForm(businessId: string, data: FormData) {
    return this.post<unknown>(`business/consultancy-data/${businessId}`, data, {
    })
  }
}

export const consultancyService = new ConsultancyService();
