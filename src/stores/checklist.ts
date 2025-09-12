import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ChecklistProgress, ChecklistProgressResponse, OnboardingPhase, MeetingResponsible } from '@/types/checklist'
import checklistService from '@/services/checklistService'

export const useChecklistStore = defineStore('checklist', () => {
  // Estado reactivo
  const progress = ref<ChecklistProgress | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const availableResponsibles = ref<string[]>([])

  // Computed properties
  const hasProgress = computed(() => progress.value !== null)
  const currentPhase = computed(() => progress.value?.currentPhase ?? 0)
  const currentPhaseName = computed(() => progress.value?.currentPhaseName ?? 'Desconocida')
  const overallProgress = computed(() => progress.value?.overallProgress ?? 0)
  const completedPhases = computed(() => progress.value?.completedPhases ?? 0)
  const totalPhases = computed(() => progress.value?.totalPhases ?? 0)
  const completedItems = computed(() => progress.value?.completedItems ?? 0)
  const totalItems = computed(() => progress.value?.totalItems ?? 0)

  // Computed para verificar disponibilidad de reuniones
  const canScheduleWithDenisse = computed(() => completedPhases.value >= 1)
  const canScheduleWithLuis = computed(() => completedPhases.value >= 2)
  const canScheduleWithDiego = computed(() => completedPhases.value >= 3)

  // Computed para obtener el siguiente responsable disponible
  const nextAvailableResponsible = computed(() => {
    if (canScheduleWithDiego.value) return 'diego'
    if (canScheduleWithLuis.value) return 'luis'
    if (canScheduleWithDenisse.value) return 'denisse'
    return null
  })

  // Computed para verificar si el onboarding está completo
  const isOnboardingComplete = computed(() => {
    return progress.value ? progress.value.overallProgress === 100 : false
  })

  // Actions
  async function fetchProgress(businessId: string, forceRefresh = false) {
    // Evitar llamadas innecesarias si ya tenemos datos recientes
    if (!forceRefresh && progress.value && lastUpdated.value) {
      const timeDiff = Date.now() - lastUpdated.value.getTime()
      const fiveMinutes = 5 * 60 * 1000
      if (timeDiff < fiveMinutes) {
        return progress.value
      }
    }

    isLoading.value = true
    error.value = null

    try {
      const response: ChecklistProgressResponse = await checklistService.getChecklistProgress(businessId)
      progress.value = response.progress
      lastUpdated.value = new Date()
      
      // Actualizar responsables disponibles
      await updateAvailableResponsibles(businessId)
      
      return response.progress
    } catch (err: any) {
      error.value = err.message || 'Error al obtener el progreso del checklist'
      console.error('Error fetching checklist progress:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateAvailableResponsibles(businessId: string) {
    try {
      availableResponsibles.value = await checklistService.getAvailableResponsibles(businessId)
    } catch (err: any) {
      console.error('Error updating available responsibles:', err)
    }
  }

  async function canScheduleMeeting(businessId: string, responsible: MeetingResponsible): Promise<boolean> {
    try {
      return await checklistService.canScheduleMeeting(businessId, responsible)
    } catch (err: any) {
      console.error('Error checking meeting availability:', err)
      return false
    }
  }

  // Función para obtener el mensaje de estado según la fase actual
  function getPhaseStatusMessage(): string {
    if (!progress.value) return 'Cargando progreso...'
    
    const { currentPhase, currentPhaseName, overallProgress } = progress.value
    
    if (overallProgress === 100) {
      return '¡Felicitaciones! Has completado todo el proceso de onboarding.'
    }
    
    const phaseMessages = {
      0: 'Iniciando el proceso de handoff con nuestro equipo.',
      1: 'En proceso de activación y onboarding. Completa tu formulario para continuar.',
      2: 'Desarrollando la estrategia y diseño del funnel de ventas.',
      3: 'Implementando y lanzando las campañas publicitarias.',
      4: 'Optimizando el rendimiento y preparando la transición.'
    }
    
    return phaseMessages[currentPhase as keyof typeof phaseMessages] || 
           `Fase actual: ${currentPhaseName} (${overallProgress}% completado)`
  }

  // Función para obtener el color del progreso
  function getProgressColor(): string {
    const progressValue = overallProgress.value
    
    if (progressValue >= 80) return '#10B981' // Verde
    if (progressValue >= 60) return '#F59E0B' // Amarillo
    if (progressValue >= 40) return '#EF4444' // Rojo
    return '#6B7280' // Gris
  }

  // Función para limpiar el estado
  function clearProgress() {
    progress.value = null
    error.value = null
    lastUpdated.value = null
    availableResponsibles.value = []
  }

  // Función para refrescar datos
  async function refreshProgress(businessId: string) {
    return await fetchProgress(businessId, true)
  }

  return {
    // Estado
    progress,
    isLoading,
    error,
    lastUpdated,
    availableResponsibles,
    
    // Computed
    hasProgress,
    currentPhase,
    currentPhaseName,
    overallProgress,
    completedPhases,
    totalPhases,
    completedItems,
    totalItems,
    canScheduleWithDenisse,
    canScheduleWithLuis,
    canScheduleWithDiego,
    nextAvailableResponsible,
    isOnboardingComplete,
    
    // Actions
    fetchProgress,
    updateAvailableResponsibles,
    canScheduleMeeting,
    getPhaseStatusMessage,
    getProgressColor,
    clearProgress,
    refreshProgress
  }
})