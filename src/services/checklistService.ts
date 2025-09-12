import APIBase from './httpBase'
import type { ChecklistProgressResponse } from '@/types/checklist'
import type { AxiosResponse } from 'axios'

class ChecklistService extends APIBase {
  /**
   * Obtiene el progreso del checklist para un negocio específico
   * @param businessId - ID del negocio
   * @returns Promise con el progreso del checklist
   */
  async getChecklistProgress(businessId: string): Promise<ChecklistProgressResponse> {
    try {
      const response: AxiosResponse<ChecklistProgressResponse> = await this.get<ChecklistProgressResponse>(
        `checklist/${businessId}/progress`
      )
      return response.data
    } catch (error) {
      console.error('Error obteniendo progreso del checklist:', error)
      throw error
    }
  }

  /**
   * Verifica si se puede agendar una reunión con un responsable específico
   * basado en el progreso actual del checklist
   * @param businessId - ID del negocio
   * @param responsible - Responsable con quien se quiere agendar ('denisse', 'luis', 'diego')
   * @returns Promise<boolean> - true si se puede agendar, false si no
   */
  async canScheduleMeeting(businessId: string, responsible: string): Promise<boolean> {
    try {
      const progressData = await this.getChecklistProgress(businessId)
      const { progress } = progressData
      
      // Lógica basada en el flujo del orden.txt:
      // - Denisse (Marketing): Fase 1 completada (Activación y Onboarding)
      // - Luis (Estratega): Fase 2 completada (Estrategia y Diseño de Funnel)
      // - Diego (Soporte): Fase 3 completada (Implementación y Lanzamiento)
      
      switch (responsible.toLowerCase()) {
        case 'denisse':
          // Puede agendar si la fase 1 (Activación y Onboarding) está completada
          return progress.completedPhases >= 1
        
        case 'luis':
          // Puede agendar si la fase 2 (Estrategia y Diseño) está completada
          return progress.completedPhases >= 2
        
        case 'diego':
          // Puede agendar si la fase 3 (Implementación) está completada
          return progress.completedPhases >= 3
        
        default:
          console.warn(`Responsable no reconocido: ${responsible}`)
          return false
      }
    } catch (error) {
      console.error('Error verificando disponibilidad de reunión:', error)
      return false
    }
  }

  /**
   * Obtiene la lista de responsables disponibles para agendar
   * basado en el progreso actual del checklist
   * @param businessId - ID del negocio
   * @returns Promise<string[]> - Array de responsables disponibles
   */
  async getAvailableResponsibles(businessId: string): Promise<string[]> {
    try {
      const progressData = await this.getChecklistProgress(businessId)
      const { progress } = progressData
      const availableResponsibles: string[] = []

      // Verificar cada responsable según las fases completadas
      if (progress.completedPhases >= 1) {
        availableResponsibles.push('denisse')
      }
      
      if (progress.completedPhases >= 2) {
        availableResponsibles.push('luis')
      }
      
      if (progress.completedPhases >= 3) {
        availableResponsibles.push('diego')
      }

      return availableResponsibles
    } catch (error) {
      console.error('Error obteniendo responsables disponibles:', error)
      return []
    }
  }
}

export default new ChecklistService()