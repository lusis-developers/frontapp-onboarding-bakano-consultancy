<script setup lang="ts">
import { computed } from 'vue';
// 1. IMPORTAMOS useRoute DE VUE ROUTER
import { useRoute } from 'vue-router';

// --- Composables ---
import { useBusinessOnboarding } from '@/composables/useBusinessOnboarding';

// --- Constantes ---
import { CALENDLY_LINK } from '@/constants/links.contant';

// --- Componentes ---
import OnboardingFormWizard from '@/components/wizards/OnboardingFormWizard.vue';
import MeetingScheduler from '@/components/gastronomic/MeetingScheduler.vue';
import HeroSection from '@/components/gastronomic/heroSection.vue';
import VideoSection from '@/components/gastronomic/videoSection.vue';
import BusinessInfoDisplay from '@/components/gastronomic/BusinessInfoDisplay.vue';
import OnboardingActionBar from '@/components/shared/OnboardingActionBar.vue';
import PageFeedback from '@/components/shared/PageFeedback.vue';
import NotFound from '@/views/notFound.vue';

// --- Lógica del Componente ---

// 2. OBTENEMOS LOS PARÁMETROS DIRECTAMENTE DE LA RUTA
// Este método es más robusto que depender de props inyectadas por el router.
const route = useRoute();
const routeParams = computed(() => ({
  userId: route.params.userId as string,
  businessId: route.params.businessId as string,
}));

// 3. PASAMOS LOS PARÁMETROS OBTENIDOS AL COMPOSABLE
// Ahora estamos 100% seguros de que los IDs son correctos.
const {
  isLoading,
  businessData,
  businessNotFound,
  serverError,
  isAlreadySubmitted,
  refetch
} = useBusinessOnboarding(routeParams.value);

const handleFormCompletion = async () => {
  await refetch();
};
</script>

<template>
  <div class="onboarding-page-wrapper">
    <PageFeedback
      :is-loading="isLoading"
      :is-not-found="businessNotFound"
      :error-message="serverError!"
      loading-text="Verificando información..."
    >
      <main v-if="businessData" class="main-content">
        <div v-if="isAlreadySubmitted" class="confirmation-view">
          <OnboardingActionBar
            :is-submitted="isAlreadySubmitted"
            :scheduling-url="CALENDLY_LINK"
            cta-target-id="scheduler"
          />
          <HeroSection
            quote="Juntos analizaremos los datos y estrategias de tu negocio para que empieces a crecer con control y previsión."
            status="Tu pago ha sido exitosamente procesado"
          >
            <template #title>
              <span class="hero-title-gradient">¡Gracias por unirte</span> a nosotros!
            </template>
            <template #subtitle>
              Estamos entusiasmados de empezar a trabajar contigo para llevar tu negocio al siguiente nivel.
            </template>
          </HeroSection>

          <BusinessInfoDisplay :business="businessData" />

          <VideoSection
            title="Nuestra Estrategia, Siempre a tu Alcance"
            description="Sabemos que son muchos detalles. Si en algún momento olvidas los pasos que seguiremos para transformar tu negocio, este video es tu recordatorio."
            video-url="https://www.youtube.com/embed/dQw4w9WgXcQ"
          />

          <MeetingScheduler id="scheduler" :client-id="routeParams.userId" />
        </div>

        <div v-else class="wizard-view">
          <OnboardingFormWizard @completed="handleFormCompletion" />
        </div>
      </main>

      <template #not-found>
        <NotFound />
      </template>
    </PageFeedback>
  </div>
</template>

<style lang="scss" scoped>
/* Tus estilos no necesitan cambios. */
@use '@/styles/index.scss' as *;

.onboarding-page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $BAKANO-LIGHT;
}

.main-content {
  flex-grow: 1;
}

.confirmation-view,
.wizard-view {
  margin-top: 70px;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.hero-title-gradient) {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(to right, $BAKANO-PINK, $BAKANO-PURPLE);
}
</style>