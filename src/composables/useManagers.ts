import { ref, type Ref } from 'vue'
import { consultancyService } from '@/services/consultancyService' // Asumiendo que aquí pondrás tus llamadas a la API

// Definimos la interfaz para un manager, que coincide con tu backend
export interface IManager {
  _id?: string // El ID será asignado por la BBDD
  name: string
  email: string
  role: string
}

export function useManagers(businessId: Ref<string>) {
  // --- Estado ---
  const managers = ref<IManager[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // --- Acciones ---

  /**
   * Carga la lista inicial de managers desde el backend.
   */
  const fetchManagers = async () => {
    if (!businessId.value) return
    isLoading.value = true
    error.value = null
    try {
      // DEBERÁS IMPLEMENTAR ESTA FUNCIÓN EN TU SERVICIO
      const response = await consultancyService.getBusinessManagers(businessId.value)
      managers.value = response.data.data || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar los administradores.'
      console.error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Agrega un nuevo manager y actualiza la lista.
   * @param managerData - Datos del nuevo manager a agregar.
   */
  const addManager = async (managerData: Omit<IManager, '_id'>) => {
    if (!businessId.value) return
    isLoading.value = true
    error.value = null
    try {
      // DEBERÁS IMPLEMENTAR ESTA FUNCIÓN EN TU SERVICIO
      const response = await consultancyService.addManagerToBusiness(businessId.value, managerData)
      // Actualizamos la lista con la respuesta del backend para tener los IDs correctos.
      managers.value = response.data.data || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al agregar el administrador.'
      console.error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Elimina un manager por su ID y actualiza la lista.
   * @param managerId - El ID del manager a eliminar.
   */
  const removeManager = async (managerId: string) => {
    if (!businessId.value || !managerId) return

    // Confirmación del usuario para una mejor UX
    const confirmed = confirm('¿Estás seguro de que deseas eliminar a este administrador?')
    if (!confirmed) return

    isLoading.value = true
    error.value = null
    try {
      // DEBERÁS IMPLEMENTAR ESTA FUNCIÓN EN TU SERVICIO
      await consultancyService.removeManagerFromBusiness(businessId.value, managerId)
      // Actualizamos la lista localmente para una respuesta instantánea en la UI.
      managers.value = managers.value.filter((m) => m._id !== managerId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar el administrador.'
      console.error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  return {
    managers,
    isLoading,
    error,
    fetchManagers,
    addManager,
    removeManager,
  }
}
