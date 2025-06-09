<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Business } from '@/types/business';
import CallToAction from '@/components/gastronomic/callToAction.vue';
import HeroSection from '@/components/gastronomic/heroSection.vue';
import VideoSection from '@/components/gastronomic/videoSection.vue';
import { clientService } from '@/services/clientService.service';

const props = defineProps<{
  userId: string;
  businessId: string;
}>();

const isLoading = ref(true);
const businessData = ref<Business | null>(null);

onMounted(async () => {
  try {
    const response = await clientService.getClientAndBusiness(props.userId, props.businessId);
    const client = response.data.client;
    if (client && client.businesses) {
      const foundBusiness = client.businesses.find(b => b._id === props.businessId);
      if (foundBusiness) {
        businessData.value = foundBusiness;
      }
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
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
    <main v-else class="main-content">
      <HeroSection />
      <VideoSection />
      <CallToAction :is-already-submitted="isAlreadySubmitted" />
    </main>
    <Footer />
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
</style>