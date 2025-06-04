import APIBase from './httpBase';
import type { Client } from '@/types/client';

class ClientService extends APIBase {
  async getClientAndBusiness(clientId: string, businessId: string) {
    return this.get<{ client: Client }>(`client/${clientId}/business/${businessId}`);
  }
}

export const clientService = new ClientService();
