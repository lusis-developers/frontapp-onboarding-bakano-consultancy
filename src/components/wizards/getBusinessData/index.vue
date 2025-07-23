<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { consultancyService } from '@/services/consultancyService';
import { useConsultancyForm } from '@/composables/useConsultancyForm';

// --- COMPONENTES ---
import Step1 from '../getBusinessData/step1.vue';
import Step2 from '../getBusinessData/step2.vue';
import Step3 from '../getBusinessData/step3.vue';
import Step4 from '../getBusinessData/step4.vue';
import Step5 from '../getBusinessData/step5.vue'; // 👈 1. IMPORTAR el nuevo Step5
import ConfirmCloseModal from '@/components/modal/confirmCloseModal.vue';
import OnboardingNextStep from '@/components/onBoardingNextStep.vue';

// --- PROPS Y EMITS (sin cambios) ---
interface BusinessDataOwnProps {
  open: boolean;
  isPreSubmitted?: boolean;
}
const props = withDefaults(defineProps<BusinessDataOwnProps>(), {
  isPreSubmitted: false,
});
const emit = defineEmits(['update:open']);

// --- ESTADO DEL WIZARD (con ajustes) ---
const currentStep = ref(1);
const totalSteps = ref(5); // 👈 2. ACTUALIZAR el número total de pasos
const isLoading = ref(false);
const isFormSubmitted = ref(props.isPreSubmitted);
const submissionError = ref<string>('');
const showConfirmClose = ref(false);

const route = useRoute();
const businessId = computed(() => route.params.businessId as string);
const clientIdFromUrl = route.params.userId as string;

// --- LÓGICA DEL FORMULARIO (desde el Composable, sin cambios) ---
const {
  values, errors, skippedFiles, menuRestauranteFiles, singleFileStatuses,
  handleFormValueUpdateFromChild, handleAddMenuFiles, handleRemoveMenuFile, updateFile,
  handleSubmit, validateField
} = useConsultancyForm();


// --- NAVEGACIÓN (con ajustes) ---
watch(() => props.open, (newVal) => {
  if (newVal && props.isPreSubmitted) isFormSubmitted.value = true;
});
const attemptCloseWizard = () => { if (!props.isPreSubmitted && !isLoading.value) showConfirmClose.value = true; };
const closeWizard = () => emit('update:open', false);
const handleConfirmedClose = (val: boolean) => { if (!val) closeWizard(); };
const prevStep = () => { if (currentStep.value > 1) currentStep.value--; };

// 👇 3. ACTUALIZAR los campos a validar por paso
const stepFields = {
  1: ['instagram', 'tiktok', 'empleados'],
  2: ['ingresoMensual', 'ingresoAnual', 'vendePorWhatsapp', 'gananciaWhatsapp', 'desafioPrincipal'],
  3: ['objetivoIdeal'],
  4: [], // El paso 4 ahora no valida nada, solo sube archivos
  5: ['acceptsPolicies'] // La validación de políticas se mueve al paso 5
};
const nextStep = async () => {
  submissionError.value = '';
  // @ts-ignore
  const fieldsToValidate = stepFields[currentStep.value] || [];
  let allStepFieldsValid = true;
  for (const fieldName of fieldsToValidate) {
    // @ts-ignore
    const result = await validateField(fieldName);
    if (!result.valid) allStepFieldsValid = false;
  }
  if (allStepFieldsValid) {
    if (currentStep.value < totalSteps.value) currentStep.value++;
  } else {
    submissionError.value = "Por favor, completa todos los campos requeridos.";
  }
};

// --- LÓGICA DE ENVÍO FINAL (sin cambios) ---
const finalSubmit = handleSubmit(async (formData) => {
  isLoading.value = true;
  submissionError.value = '';
  const dataToSend = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (!(value instanceof File) && !Array.isArray(value) && value !== undefined && value !== null) {
      dataToSend.append(key, String(value));
    }
  });

  if (!skippedFiles.value.menuRestaurante) {
    menuRestauranteFiles.value.forEach(status => dataToSend.append('menuRestaurante', status.file));
  }
  Object.entries(singleFileStatuses.value).forEach(([fieldName, status]) => {
    if (status && !skippedFiles.value[fieldName]) {
      dataToSend.append(fieldName, status.file);
    }
  });

  try {
    if (!businessId.value) throw new Error("ID del negocio no disponible");
    await consultancyService.submitConsultancyForm(businessId.value, dataToSend);
    isFormSubmitted.value = true;
  } catch (error: any) {
    submissionError.value = error.response?.data?.message || "Hubo un problema al enviar los datos.";
  } finally {
    isLoading.value = false;
  }
});

const stepComponentMap: Record<number, any> = { 1: Step1, 2: Step2, 3: Step3, 4: Step4, 5: Step5 };
const activeStepComponent = computed(() => stepComponentMap[currentStep.value] || null);
</script>

<template>
  <div v-if="props.open" class="dialog-overlay" @mousedown.self="attemptCloseWizard">
    <div class="dialog-panel wizard-dialog">
      <header class="dialog-header">
        <h2 class="wizard-title">
          {{ isFormSubmitted ? "¡Agenda tu Reunión!" : "Registro de Información" }}
        </h2>
        <button @click="attemptCloseWizard" class="close-button" aria-label="Cerrar diálogo">
          &times;
        </button>
      </header>

      <main class="dialog-content">
        <div v-if="isFormSubmitted" class="submitted-content-wrapper">
          <OnboardingNextStep v-if="clientIdFromUrl" :client-id="clientIdFromUrl" />
        </div>
        <form v-else @submit.prevent="finalSubmit" class="wizard-form">
          <div class="business-data-steps-container">
            <Transition name="step-transition" mode="out-in">
              
              <component
                  :is="activeStepComponent"
                  :key="currentStep"
                  v-if="activeStepComponent"
                  :values="values"
                  :errors="errors"
                  :skipped-files="skippedFiles"
                  
                  :menu-files="menuRestauranteFiles"
                  :single-file-statuses="singleFileStatuses"
                  
                  :business-id="businessId" @update:form-value="handleFormValueUpdateFromChild"
                  @update-file="updateFile"
                  @add-menu-files="handleAddMenuFiles"
                  @remove-menu-file="handleRemoveMenuFile"

                  class="step-component-wrapper" />
            </Transition>
          </div>

          <div v-if="submissionError" class="error-message-container" :class="{ 'global-error': currentStep === totalSteps && !isLoading, 'step-error': currentStep < totalSteps || isLoading }">
            <p v-if="currentStep === totalSteps && !isLoading" class="error-title">Error al enviar:</p>
            <p v-for="(line, index) in submissionError.split('\n')" :key="index" class="error-line">{{ line }}</p>
          </div>

          <div class="wizard-navigation">
            <button type="button" v-if="currentStep > 1 && !isLoading" @click="prevStep" class="nav-button prev-button">
              Anterior
            </button>
            <button type="button" v-if="currentStep < totalSteps && !isLoading" @click="nextStep" class="nav-button next-button">
              Siguiente
            </button>
            <button type="submit" v-if="currentStep === totalSteps" :disabled="isLoading" class="nav-button submit-button">
              <span v-if="isLoading" class="spinner"></span> {{ isLoading ? "Enviando..." : "Enviar" }}
            </button>
          </div>
        </form>
      </main>
    </div>
  </div>
  <ConfirmCloseModal
    v-model="showConfirmClose"
    @confirm="closeWizard" />
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *; // Tus variables globales SCSS

// --- Estilos para el Diálogo (Modal) ---
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; // Asegúrate de que esté por encima de otro contenido
  padding: 1rem;
}

.dialog-panel {
  background-color: $white;
  border-radius: 8px;
  padding: 1.5rem; // p-6
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 600px; // sm:max-w-[600px]
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; // Para el scroll interno del contenido
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem; // Espacio antes del contenido
  padding-bottom: 1rem;
  border-bottom: 1px solid $BAKANO-LIGHT;
}

.wizard-title {
  font-family: $font-principal;
  font-size: 1.5rem; // text-2xl
  font-weight: 700; // font-bold
  color: $BAKANO-DARK;
  text-align: center;
  flex-grow: 1; // Para centrar el título si el botón de cerrar es pequeño
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: $BAKANO-LIGHT;
  cursor: pointer;
  padding: 0.25rem;

  &:hover {
    color: $BAKANO-DARK;
  }
}

.dialog-content {
  overflow-y: auto; // Scroll para contenido largo
  padding-right: 0.5rem; // Espacio para la barra de scroll
  margin-right: -0.5rem; // Compensa el padding
  flex-grow: 1;
}

.wizard-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem; // Espacio entre el contenedor de pasos y la navegación/errores
}

// --- Estilos para el Contenedor de Pasos y Transiciones (tu código original) ---
.business-data-steps-container {
  position: relative;
  overflow-x: hidden;
  min-height: 280px; // Ajusta según la altura promedio de tus pasos
  padding-block: 0.5rem;
}

// .step-component-wrapper { /* ... */ }
.step-transition-enter-active {
  transition:
    opacity 0.4s ease-out,
    transform 0.4s ease-out;
}

.step-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.step-transition-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.step-transition-leave-active {
  transition:
    opacity 0.3s ease-in,
    transform 0.3s ease-in;
}

.step-transition-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.step-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// --- Estilos para Mensajes de Error y Navegación (adaptados de tu versión anterior) ---
.error-message-container {
  padding: 0.75rem 1rem;
  background-color: rgba($BAKANO-PINK, 0.07);
  border: 1px solid rgba($BAKANO-PINK, 0.2);
  border-radius: 8px;

  .error-title {
    color: $BAKANO-PINK;
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  .error-line {
    color: darken($BAKANO-PINK, 10%);
    font-size: 0.85rem;
    white-space: pre-line;
  }

  &.step-error {
    background-color: transparent;
    border: none;
    padding: 0 0 0.5rem 0;

    .error-line {
      color: $BAKANO-PINK;
      font-weight: 500;
    }
  }
}

.wizard-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 1px solid $BAKANO-LIGHT;
}

.nav-button {
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-family: $font-principal;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease,
    transform 0.1s ease;

  &.prev-button {
    background-color: $BAKANO-LIGHT;
    color: $BAKANO-DARK;

    &:hover {
      background-color: $BAKANO-LIGHT;
    }
  }

  &.next-button,
  &.submit-button {
    background-color: $BAKANO-PINK;
    color: $white;

    &:hover {
      background-color: darken($BAKANO-PINK, 7%);
    }
  }

  &.ml-auto {
    margin-left: auto;
  }

  &.submit-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
}

// Spinner simple (necesitarás un componente BaseSpinner o un SCSS más elaborado para esto)
.spinner {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-left-color: $white;
  border-radius: 50%;
  width: 1em;
  height: 1em;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.submitted-content-wrapper {
  text-align: center;
  padding: 2rem 0;
}
</style>
