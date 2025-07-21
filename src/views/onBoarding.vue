<script setup lang="ts">
import { useBusinessOnboarding } from '@/composables/useBusinessOnboarding';

import { CALENDLY_LINK } from '@/constants/links.contant';

import OnboardingFormWizard from '@/components/wizards/OnboardingFormWizard.vue';
import HeroSection from '@/components/gastronomic/heroSection.vue';
import VideoSection from '@/components/gastronomic/videoSection.vue';
import BusinessInfoDisplay from '@/components/gastronomic/BusinessInfoDisplay.vue';
import CallToAction from '@/components/gastronomic/callToAction.vue';
import OnboardingActionBar from '@/components/shared/OnboardingActionBar.vue';
import PageFeedback from '@/components/shared/PageFeedback.vue';
import NotFound from '@/views/notFound.vue';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  businessId: {
    type: String,
    required: true,
  }
});
const {
  isLoading,
  businessData,
  businessNotFound,
  serverError,
  isAlreadySubmitted,
  refetch
} = useBusinessOnboarding(props);

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
            cta-target-id="comenzar"
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
          <CallToAction
            id="comenzar"
            :is-already-submitted="isAlreadySubmitted"
            :scheduling-url="CALENDLY_LINK"
          />
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

.confirmation-view,
.wizard-view {
  margin-top: 70px;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

:deep(.hero-title-gradient) {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(to right, $BAKANO-PINK, $BAKANO-PURPLE);
}
</style>