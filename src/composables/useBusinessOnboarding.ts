import { ref, onMounted, computed, type Ref } from 'vue'
import type { Business } from '@/types/business'
import { clientService } from '@/services/clientService.service'

/**
 * Interfaz que define la forma de las props que el composable espera recibir.
 * Esto hace que el composable sea fuertemente tipado e independiente del componente que lo usa.
 */
interface OnboardingProps {
  userId: string
  businessId: string
}

/**
 * Función interna para encapsular la lógica de la llamada a la API.
 * Puede ser reutilizada por la carga inicial y por la función de recarga.
 */
async function fetchBusinessData(
  props: OnboardingProps,
  businessDataRef: Ref<Business | null>,
  notFoundRef: Ref<boolean>,
  serverErrorRef: Ref<string | null>,
) {
  try {
    const response = await clientService.getClientAndBusiness(props.userId, props.businessId)
    const client = response.data.client
    const foundBusiness = client?.businesses?.find((b: Business) => b._id === props.businessId)

    if (foundBusiness) {
      businessDataRef.value = foundBusiness
      notFoundRef.value = false
      serverErrorRef.value = null
    } else {
      notFoundRef.value = true
    }
  } catch (error: any) {
    console.error('Error al obtener datos:', error)
    if (error?.status === 404) {
      notFoundRef.value = true
    } else {
      serverErrorRef.value = 'Ocurrió un error inesperado al cargar la información.'
    }
  }
}

/**
 * Composable para gestionar toda la lógica de estado y datos de la página de Onboarding.
 * @param props - Un objeto reactivo que contiene userId y businessId.
 */
export function useBusinessOnboarding(props: OnboardingProps) {
  // --- Estado Reactivo Interno ---
  const isLoading = ref(true)
  const businessData = ref<Business | null>(null)
  const businessNotFound = ref(false)
  const serverError = ref<string | null>(null)

  // --- Lógica de Obtención y Recarga de Datos ---
  const refetch = async () => {
    isLoading.value = true
    await fetchBusinessData(props, businessData, businessNotFound, serverError)
    isLoading.value = false
  }

  // Se ejecuta una vez cuando el componente se monta por primera vez.
  onMounted(refetch)

  // --- Propiedades Computadas (Lógica de Negocio) ---
  const isAlreadySubmitted = computed(() => {
    if (!businessData.value) return false
    const data = businessData.value

    // ** LÓGICA DE NEGOCIO CLAVE **
    // Define qué significa que un formulario esté "completado".
    // Esto debe coincidir con los campos mínimos requeridos en tu wizard.
    // AJUSTA ESTA REGLA SEGÚN TUS NECESIDADES.
    const hasRequiredTextFields =
      !!data.instagram &&
      !!data.empleados &&
      !!data.ingresoMensual &&
      !!data.ingresoAnual &&
      !!data.desafioPrincipal &&
      !!data.objetivoIdeal

    return hasRequiredTextFields
  })

  // --- Contrato del Composable ---
  // Exponemos el estado y las funciones que el componente necesita.
  return {
    isLoading,
    businessData,
    businessNotFound,
    serverError,
    isAlreadySubmitted,
    refetch, // Clave para la actualización sin recarga de página.
  }
}
