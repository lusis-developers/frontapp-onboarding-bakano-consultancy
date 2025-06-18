<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Business } from '@/types/business';

// Componentes
import CallToAction from '@/components/gastronomic/callToAction.vue';
import HeroSection from '@/components/gastronomic/heroSection.vue';
import VideoSection from '@/components/gastronomic/videoSection.vue';
// 1. Importa tu componente de "Página no encontrada"
import NotFound from '@/views/notFound.vue';
import { clientService } from '@/services/clientService.service';

const props = defineProps<{
  userId: string;
  businessId: string;
}>();

const isLoading = ref(true);
const businessData = ref<Business | null>(null);
// 2. Añadimos un nuevo estado para el error específico
const businessNotFound = ref(false);

onMounted(async () => {
  try {
    const response = await clientService.getClientAndBusiness(props.userId, props.businessId);
    const client = response.data.client;

    if (client && client.businesses) {
      const foundBusiness = client.businesses.find(b => b._id === props.businessId);
      if (foundBusiness) {
        businessData.value = foundBusiness;
      } else {
        // Si el array de negocios no contiene el ID, lo marcamos como no encontrado.
        console.error(`Negocio con ID ${props.businessId} no encontrado en la lista del cliente.`);
        businessNotFound.value = true;
      }
    }
  } catch (error: any) {
    // 3. Mejoramos el bloque CATCH para identificar el error 404
    console.error("Error al obtener datos:", error);
    // Tu httpBase lanza un objeto con `status`. ¡Usémoslo!
    // Si el status es 404 (Not Found), activamos nuestro estado.
    if (error && error.status === 404) {
      businessNotFound.value = true;
    }
    // Para cualquier otro error, podrías tener otro estado si quisieras (ej. serverError = true)
  } finally {
    isLoading.value = false;
  }
});

const isAlreadySubmitted = computed(() => {
  if (!businessData.value) return false;
  const data = businessData.value;
  const hasTextFields = data.instagram && data.tiktok && data.empleados && data.objetivoIdeal;
  const hasFilePaths = data.menuRestaurantePath || data.costoPorPlatoPath || data.ventasMovimientosPath || data.ventasProductosPath || data.ventasClientePath;
  return !!(hasTextFields && hasFilePaths);
});
</script>

<template>
  <div class="onboarding-page-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <p>Verificando información...</p>
    </div>
    <NotFound v-else-if="businessNotFound" />
    <main v-else class="main-content">
      <HeroSection />
      <VideoSection />
      <CallToAction :is-already-submitted="isAlreadySubmitted" />
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.onboarding-page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $white;
}

.main-content {
  flex-grow: 1;
}

.loading-overlay {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  font-family: $font-principal;
  font-size: 1.5rem;
  color: $BAKANO-DARK;
}
</style>