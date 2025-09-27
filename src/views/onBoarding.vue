<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBusinessOnboarding } from '@/composables/useBusinessOnboarding';
import { useChecklistStore } from '@/stores/checklist';
import { CALENDLY_LINK } from '@/constants/links.contant';
import OnboardingFormWizard from '@/components/wizards/OnboardingFormWizard.vue';
import OnboardingFormForServicesWizard from '@/components/wizards/OnboardingFormForServicesWizard.vue';
import MeetingScheduler from '@/components/gastronomic/MeetingScheduler.vue';
import HeroSection from '@/components/gastronomic/heroSection.vue';
import VideoSection from '@/components/gastronomic/videoSection.vue';
import BusinessInfoDisplay from '@/components/gastronomic/BusinessInfoDisplay.vue';
import ServiceBusinessInfoDisplay from '@/components/services/ServiceBusinessInfoDisplay.vue';
import OnboardingActionBar from '@/components/shared/OnboardingActionBar.vue';
import PageFeedback from '@/components/shared/PageFeedback.vue';
import NotFound from '@/views/notFound.vue';


const route = useRoute();
const routeParams = computed(() => ({
  userId: route.params.userId as string,
  businessId: route.params.businessId as string,
}));
const originalTitle = document.title;

const {
  isLoading,
  businessData,
  businessNotFound,
  serverError,
  isAlreadySubmitted,
  refetch
} = useBusinessOnboarding(routeParams.value);

// Checklist store para controlar el progreso y las reuniones
const checklistStore = useChecklistStore();

// Computed para verificar si se puede agendar con Denisse (Marketing)
const canScheduleWithMarketing = computed(() => {
  return checklistStore.canScheduleWithDenisse;
});

// Computed para obtener el mensaje de estado del progreso
const progressStatusMessage = computed(() => {
  if (!checklistStore.hasProgress) {
    return 'Verificando tu progreso...';
  }

  if (!canScheduleWithMarketing.value) {
    return 'Completa el formulario de onboarding para poder agendar tu primera reunión con nuestro especialista en marketing.';
  }

  return checklistStore.getPhaseStatusMessage();
});

const handleFormCompletion = async () => {
  await refetch();
  // Actualizar el progreso del checklist después de completar el formulario
  if (routeParams.value.businessId) {
    await checklistStore.refreshProgress(routeParams.value.businessId);
  }
};

// Cargar el progreso del checklist cuando el componente se monta
onMounted(async () => {
  if (routeParams.value.businessId && isAlreadySubmitted.value) {
    try {
      await checklistStore.fetchProgress(routeParams.value.businessId);
    } catch (error) {
      console.error('Error loading checklist progress:', error);
    }
  }
});

// Observar cambios en isAlreadySubmitted para cargar el progreso
watch(isAlreadySubmitted, async (newValue) => {
  if (newValue && routeParams.value.businessId) {
    try {
      await checklistStore.fetchProgress(routeParams.value.businessId);
    } catch (error) {
      console.error('Error loading checklist progress:', error);
    }
  }
});

watch(businessData, (newBusinessData) => {
  if (newBusinessData && newBusinessData.name) {
    document.title = `Bienvenido, ${newBusinessData.name} | Bakano`;
  } else {
    document.title = originalTitle;
  }
});

onUnmounted(() => {
  document.title = originalTitle
})
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
          <!-- <OnboardingActionBar
            :is-submitted="isAlreadySubmitted"
            :scheduling-url="CALENDLY_LINK"
            cta-target-id="scheduler"
          /> -->
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

          <ServiceBusinessInfoDisplay 
            v-if="businessData.businessType === 'Tutoring Center'"
            :business="businessData" 
          />
          <BusinessInfoDisplay 
            v-else
            :business="businessData" 
          />

          <VideoSection
            v-if="businessData.businessType !== 'Tutoring Center'"
            title="Nuestra Estrategia, Siempre a tu Alcance"
            description="Sabemos que son muchos detalles. Si en algún momento olvidas los pasos que seguiremos para transformar tu negocio, este video es tu recordatorio."
            media-id="lpxrybfuh8"
            :aspect-ratio="1.7777777777777777"
          />

          <!-- Indicador de progreso del checklist -->
          <div class="progress-section">
            <div class="progress-card">
              <h3 class="progress-title">Tu Progreso en el Proceso</h3>
              
              <div v-if="checklistStore.isLoading" class="progress-loading">
                <div class="loading-spinner"></div>
                <p>Cargando tu progreso...</p>
              </div>
              
              <div v-else-if="checklistStore.hasProgress" class="progress-content">
                <div class="progress-bar-container">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{
                        width: `${checklistStore.overallProgress}%`,
                        backgroundColor: checklistStore.getProgressColor()
                      }"
                    ></div>
                  </div>
                  <span class="progress-percentage">{{ checklistStore.overallProgress }}%</span>
                </div>
                
                <div class="progress-details">
                  <p class="progress-phase">
                    <strong>Fase Actual:</strong> {{ checklistStore.currentPhaseName }}
                  </p>
                  <p class="progress-items">
                    {{ checklistStore.completedItems }} de {{ checklistStore.totalItems }} tareas completadas
                  </p>
                </div>
                
                <div class="progress-status">
                  <p>{{ progressStatusMessage }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- MeetingScheduler - Solo se muestra si se puede agendar con marketing -->
          <div v-if="canScheduleWithMarketing" class="meeting-section">
            <MeetingScheduler
              id="scheduler"
              :client-id="routeParams.userId"
              :business-id="routeParams.businessId"
            />
          </div>
          
          <!-- Mensaje cuando no se puede agendar aún -->
          <div v-else class="meeting-unavailable">
            <div class="unavailable-card">
              <h3>🚀 ¡Casi listo para tu primera reunión!</h3>
              <p>{{ progressStatusMessage }}</p>
              <div class="next-steps">
                <h4>Próximos pasos:</h4>
                <ul>
                  <li v-if="!checklistStore.hasProgress">Verificando tu progreso actual...</li>
                  <li v-else-if="checklistStore.completedPhases < 1">
                    Completa el proceso de activación y onboarding
                  </li>
                  <li v-else>
                    Una vez completada la primera fase, podrás agendar tu reunión con Denisse, nuestra especialista en marketing
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        <div v-else class="wizard-view">
          <OnboardingFormForServicesWizard 
            v-if="businessData.businessType === 'Tutoring Center'"
            @completed="handleFormCompletion" 
          />
          <OnboardingFormWizard 
            v-else
            @completed="handleFormCompletion" 
          />
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

// Estilos para la sección de progreso
.progress-section {
  margin: 2rem 0;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
}

.progress-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 767px) {
    padding: 1.5rem;
    border-radius: 12px;
  }
}

.progress-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $BAKANO-DARK;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 767px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
}

.progress-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;

  p {
    color: $BAKANO-DARK;
    margin: 0;
  }
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba($BAKANO-PURPLE, 0.2);
  border-top: 3px solid $BAKANO-PURPLE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.progress-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background-color: #f3f4f6;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease-in-out, background-color 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.progress-percentage {
  font-weight: 600;
  color: $BAKANO-DARK;
  font-size: 0.9rem;
  min-width: 40px;
  text-align: right;
}

.progress-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  p {
    margin: 0;
    color: $BAKANO-DARK;
    font-size: 0.9rem;
  }
}

.progress-phase strong {
  color: $BAKANO-DARK;
}

.progress-status {
  padding: 1rem;
  background: linear-gradient(135deg, rgba($BAKANO-PURPLE, 0.05), rgba($BAKANO-PINK, 0.05));
  border-radius: 8px;
  border-left: 4px solid $BAKANO-PURPLE;

  p {
    margin: 0;
    color: $BAKANO-DARK;
    font-weight: 500;
    line-height: 1.5;
  }
}

// Estilos para la sección de reunión no disponible
.meeting-unavailable {
  margin: 2rem 0;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
}

.unavailable-card {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid #f59e0b;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 767px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 1rem;

    @media (max-width: 767px) {
      font-size: 1.25rem;
    }
  }

  >p {
    color: #92400e;
    font-size: 1rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
}

.next-steps {
  text-align: left;
  background: rgba(255, 255, 255, 0.7);
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;

  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 1rem;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #92400e;

    li {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
  }
}

// Estilos para la sección de reunión disponible
.meeting-section {
  margin: 2rem 0;
}
</style>