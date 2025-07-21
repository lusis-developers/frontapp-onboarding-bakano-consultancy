import { ref, onMounted, computed, type Ref } from 'vue'
import type { Business } from '@/types/business'
import { clientService } from '@/services/clientService.service'

/**
 * Composable para gestionar la lógica de carga y estado del onboarding de un negocio.
 * @param userId - Ref del ID de usuario.
 * @param businessId - Ref del ID del negocio.
 */
export function useBusinessOnboarding(userId: Ref<string>, businessId: Ref<string>) {
  // --- Estado Reactivo ---
  const isLoading = ref(true)
  const businessData = ref<Business | null>(null)
  const businessNotFound = ref(false)
  const serverError = ref<string | null>(null)

  // --- Lógica de Carga de Datos ---
  onMounted(async () => {
    // Validaciones iniciales
    if (!userId.value || !businessId.value) {
      serverError.value = 'Los identificadores de usuario o negocio no son válidos.'
      isLoading.value = false
      return
    }

    try {
      const response = await clientService.getClientAndBusiness(userId.value, businessId.value)
      const client = response.data.client

      if (client?.businesses) {
        const foundBusiness = client.businesses.find((b) => b._id === businessId.value)
        if (foundBusiness) {
          businessData.value = foundBusiness
        } else {
          console.error(`Negocio con ID ${businessId.value} no encontrado en la lista del cliente.`)
          businessNotFound.value = true
        }
      } else {
        // El cliente no existe o no tiene negocios asociados
        businessNotFound.value = true
      }
    } catch (error: any) {
      console.error('Error al obtener datos:', error)
      if (error?.status === 404) {
        businessNotFound.value = true
      } else {
        // Para cualquier otro tipo de error, mostramos un mensaje genérico.
        serverError.value =
          'Ocurrió un error inesperado al cargar la información. Por favor, intenta de nuevo más tarde.'
      }
    } finally {
      isLoading.value = false
    }
  })

  // --- Propiedades Computadas ---
  const isAlreadySubmitted = computed(() => {
    if (!businessData.value) return false
    const data = businessData.value
    // La lógica de validación se mantiene, pero ahora está encapsulada aquí.
    const hasTextFields = data.instagram && data.tiktok && data.empleados && data.objetivoIdeal
    const hasFilePaths =
      data.menuRestaurantePath ||
      data.costoPorPlatoPath ||
      data.ventasMovimientosPath ||
      data.ventasProductosPath ||
      data.ventasClientePath
    return !!(hasTextFields && hasFilePaths)
  })

  // --- Exponemos el estado y las computadas ---
  return {
    isLoading,
    businessData,
    businessNotFound,
    serverError,
    isAlreadySubmitted,
  }
}
