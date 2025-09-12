import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Business, type IManager, type IHandoffData } from '@/types/business'
import { consultancyService, type ConsultancyFormData } from '@/services/consultancyService'

export const useBusinessStore = defineStore('business', () => {
  // Estado reactivo
  const currentBusiness = ref<Business | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const managers = ref<IManager[]>([])
  const isSubmittingForm = ref(false)
  const formSubmissionSuccess = ref(false)

  // Computed properties
  const hasBusinessData = computed(() => currentBusiness.value !== null)
  const businessId = computed(() => currentBusiness.value?._id || '')
  const businessName = computed(() => currentBusiness.value?.name || '')
  const onboardingStep = computed(() => currentBusiness.value?.onboardingStep || '')
  const hasBrandIdentity = computed(() => {
    const business = currentBusiness.value
    return business && (
      business.brandLogoPath ||
      business.brandPrimaryColor ||
      business.brandSecondaryColor ||
      business.brandTypographyName ||
      business.brandTypographyPath ||
      business.brandUsageExamplesPath
    )
  })
  const hasHandoffData = computed(() => currentBusiness.value?.handoffData !== undefined)

  // Actions
  async function loadBusiness(businessId: string) {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Implementar endpoint GET /business/{businessId} en el backend
      // const response = await consultancyService.getBusinessDetails(businessId)
      // currentBusiness.value = response.data.data
      
      // Temporalmente comentado hasta que se implemente el endpoint
      console.warn('loadBusiness temporalmente deshabilitado - falta endpoint GET /business/{businessId}')
    } catch (err: any) {
      error.value = err.message || 'Error al cargar los datos del negocio'
      console.error('Error loading business:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function submitConsultancyForm(businessId: string, formData: FormData) {
    isSubmittingForm.value = true
    error.value = null
    formSubmissionSuccess.value = false
    
    try {
      const response = await consultancyService.submitConsultancyForm(businessId, formData)
      formSubmissionSuccess.value = true
      
      // Recargar los datos del negocio después del envío exitoso
      await loadBusiness(businessId)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al enviar el formulario de consultoría'
      console.error('Error submitting consultancy form:', err)
      throw err
    } finally {
      isSubmittingForm.value = false
    }
  }

  async function updateBusinessData(businessId: string, data: Partial<ConsultancyFormData>) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await consultancyService.updateBusinessData(businessId, data)
      currentBusiness.value = response.data.data
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar los datos del negocio'
      console.error('Error updating business data:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function loadManagers(businessId: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await consultancyService.getBusinessManagers(businessId)
      managers.value = response.data.data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar los administradores'
      console.error('Error loading managers:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function addManager(businessId: string, managerData: Omit<IManager, '_id'>) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await consultancyService.addManagerToBusiness(businessId, managerData)
      managers.value = response.data.data
      
      // Actualizar también los managers en el negocio actual
      if (currentBusiness.value) {
        currentBusiness.value.managers = response.data.data
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al añadir administrador'
      console.error('Error adding manager:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function removeManager(businessId: string, managerId: string) {
    isLoading.value = true
    error.value = null
    
    try {
      await consultancyService.removeManagerFromBusiness(businessId, managerId)
      
      // Actualizar la lista local de managers
      managers.value = managers.value.filter(manager => manager._id !== managerId)
      
      // Actualizar también los managers en el negocio actual
      if (currentBusiness.value) {
        currentBusiness.value.managers = managers.value
      }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar administrador'
      console.error('Error removing manager:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateHandoffData(businessId: string, handoffData: Omit<IHandoffData, '_id'>) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await consultancyService.updateHandoffData(businessId, handoffData)
      currentBusiness.value = response.data.data
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar datos de handoff'
      console.error('Error updating handoff data:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearFormSubmissionSuccess() {
    formSubmissionSuccess.value = false
  }

  function resetStore() {
    currentBusiness.value = null
    managers.value = []
    isLoading.value = false
    error.value = null
    isSubmittingForm.value = false
    formSubmissionSuccess.value = false
  }

  return {
    // Estado
    currentBusiness,
    isLoading,
    error,
    managers,
    isSubmittingForm,
    formSubmissionSuccess,
    
    // Computed
    hasBusinessData,
    businessId,
    businessName,
    onboardingStep,
    hasBrandIdentity,
    hasHandoffData,
    
    // Actions
    loadBusiness,
    submitConsultancyForm,
    updateBusinessData,
    loadManagers,
    addManager,
    removeManager,
    updateHandoffData,
    clearError,
    clearFormSubmissionSuccess,
    resetStore
  }
})