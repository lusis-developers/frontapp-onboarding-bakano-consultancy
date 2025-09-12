import APIBase from './httpBase'
// Importamos las interfaces actualizadas
import { type IManager, type IHandoffData, type Business } from '@/types/business'

// Interfaz para los datos de consultoría que se pueden enviar
export interface ConsultancyFormData {
  // Campos básicos del negocio
  ruc?: string
  address?: string
  businessType?: string
  phone?: string
  email?: string
  instagram?: string
  tiktok?: string
  empleados?: string
  ingresoMensual?: string
  ingresoAnual?: string
  desafioPrincipal?: string
  objetivoIdeal?: string
  vendePorWhatsapp?: boolean
  gananciaWhatsapp?: string
  
  // Brand Identity Fields
  brandPrimaryColor?: string
  brandSecondaryColor?: string
  brandTypographyName?: string
  
  // Archivos se manejan por separado en FormData
  // brandLogo, brandTypography, brandUsageExamples
  // menuRestaurante, costoPorPlato, ventasCliente, ventasMovimientos, ventasProductos
}

class ConsultancyService extends APIBase {
  /**
   * Envía el formulario de consultoría con datos y archivos
   * Ruta actualizada según el controlador backend
   */
  async submitConsultancyForm(businessId: string, data: FormData) {
    return this.post<{
      message: string
      businessId: string
      updatedData: any
    }>(`business/consultancy-data/${businessId}`, data, {})
  }

  /**
   * Obtiene los administradores de un negocio
   */
  async getBusinessManagers(businessId: string) {
    return this.get<{ data: IManager[] }>(`business/${businessId}/managers`)
  }

  /**
   * Añade un administrador a un negocio
   */
  async addManagerToBusiness(businessId: string, managerData: Omit<IManager, '_id'>) {
    return this.post<{ data: IManager[] }>(`business/${businessId}/managers`, managerData)
  }

  /**
   * Elimina un administrador de un negocio
   */
  async removeManagerFromBusiness(businessId: string, managerId: string) {
    return this.delete<unknown>(`business/${businessId}/managers/${managerId}`)
  }

  /**
   * Actualiza datos específicos del negocio (sin archivos)
   */
  async updateBusinessData(businessId: string, data: Partial<ConsultancyFormData>) {
    return this.patch<{ data: Business }>(`business/edit/${businessId}`, data)
  }

  /**
   * Obtiene los datos completos de un negocio
   */
  async getBusinessDetails(businessId: string) {
    return this.get<{ data: Business }>(`business/${businessId}`)
  }

  /**
   * Actualiza datos de handoff (para uso interno)
   */
  async updateHandoffData(businessId: string, handoffData: Omit<IHandoffData, '_id'>) {
    return this.patch<{ data: Business }>(`business/${businessId}/handoff`, handoffData)
  }
}

export const consultancyService = new ConsultancyService()
