<script setup lang="ts">
import CallToAction from '@/components/gastronomic/callToAction.vue';
import HeroSection from '@/components/gastronomic/heroSection.vue';
import VideoSection from '@/components/gastronomic/videoSection.vue';
import BusinessData from '@/components/wizards/businessData.vue';
import { ref } from 'vue';


// Si tenías ProcessSteps y lo necesitas, también lo importarías aquí
// import ProcessSteps from '@/components/ProcessSteps.vue';


const isRegistrationModalVisible = ref(false);

const openRegistrationModal = () => {
  console.log('Onboarding: Recibida solicitud para abrir modal.'); // Log para depuración
  isRegistrationModalVisible.value = true;
};
</script>

<template>
  <div class="onboarding-page-wrapper">
    <main class="main-content">
      <HeroSection />
      <VideoSection />
      <CallToAction @request-open-registration-modal="openRegistrationModal" />
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

// Puedes agregar más estilos específicos para el layout de esta página si es necesario.
// Por ejemplo, si necesitas espaciado uniforme entre las secciones principales:
.main-content> :deep(section) {
  // Si tus componentes raíz son <section>
  margin-bottom: 3rem; // Ejemplo de espaciado
}
</style>