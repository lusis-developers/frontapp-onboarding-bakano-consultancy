<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { consultancyService } from '@/services/consultancyService';
import { useConsultancyForm } from '@/composables/useConsultancyForm';

// --- COMPONENTES DEL WIZARD ---
import Step1 from './getBusinessDataForServices/step1.vue';
import Step2 from './getBusinessDataForServices/step2.vue';
import Step3 from './getBusinessDataForServices/step3.vue';
import Step4 from './getBusinessDataForServices/step4.vue'; // Identidad de marca
import Step5 from './getBusinessData/step5.vue'; // Reutilizamos el Step5 existente

// --- EMITS ---
const emit = defineEmits(['completed']);

// --- ESTADO DEL WIZARD ---
const currentStep = ref(1);
const totalSteps = ref(5);
const isLoading = ref(false);
const submissionError = ref<string | null>(null);

// --- LÓGICA DEL FORMULARIO (Composable) ---
const route = useRoute();
const businessId = computed(() => route.params.businessId as string);
const {
  values, errors, skippedFiles, singleFileStatuses,
  handleFormValueUpdateFromChild, updateFile,
  handleSubmit, validateField
} = useConsultancyForm();

// --- NAVEGACIÓN ENTRE PASOS ---
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// Mapeo de campos a validar por cada paso.
const stepFields: Record<number, (keyof typeof values)[]> = {
  1: ['instagram', 'empleados'],
  2: ['ingresoMensual', 'ingresoAnual', 'desafioPrincipal', 'vendePorWhatsapp', 'gananciaWhatsapp'],
  3: ['objetivoIdeal', 'serviceDescription'],
  4: [], // Step4 - Identidad de marca (todos los campos son opcionales)
  5: ['acceptsPolicies'] // Step5 requiere aceptación de políticas
};

const nextStep = async () => {
  submissionError.value = null;
  const fieldsToValidate = stepFields[currentStep.value] || [];
  let isStepValid = true;

  for (const field of fieldsToValidate) {
    const result = await validateField(field);
    if (!result.valid) {
      isStepValid = false;
    }
  }

  if (isStepValid) {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++;
    }
  } else {
    submissionError.value = "Por favor, completa todos los campos requeridos para continuar.";
  }
};

// --- ENVÍO FINAL DEL FORMULARIO ---
const finalSubmit = handleSubmit(async (formData) => {
  console.log('🚀 [DEBUG] finalSubmit ejecutado - Iniciando envío del formulario de servicios');
  console.log('📋 [DEBUG] formData recibida:', formData);
  console.log('🏢 [DEBUG] businessId:', businessId.value);

  isLoading.value = true;
  submissionError.value = null;

  // Construimos el FormData para el envío de datos de servicios
  const dataToSend = new FormData();

  // Agregar todos los campos del formulario de servicios
  Object.entries(formData).forEach(([key, value]) => {
    if (!(value instanceof File) && !Array.isArray(value) && value !== undefined && value !== null) {
      dataToSend.append(key, String(value));
      console.log(`📝 [DEBUG] Agregando campo de servicio: ${key} = ${value}`);
    }
  });

  // Agregar archivos de identidad de marca (si existen y no están omitidos)
  Object.entries(singleFileStatuses.value).forEach(([fieldName, status]) => {
    if (status && !skippedFiles.value[fieldName]) {
      dataToSend.append(fieldName, status.file);
      console.log(`📎 [DEBUG] Agregando archivo de marca: ${fieldName} = ${status.file.name}`);
    } else if (skippedFiles.value[fieldName]) {
      console.log(`⏭️ [DEBUG] Archivo de marca ${fieldName} omitido por el usuario`);
    }
  });

  console.log('📦 [DEBUG] FormData de servicios construido, enviando al servicio...');

  try {
    if (!businessId.value) throw new Error("ID del negocio no disponible. Por favor, recarga la página.");

    // Enviar formulario al servicio
    console.log('🌐 [DEBUG] Llamando a consultancyService.submitConsultancyForm...');
    await consultancyService.submitConsultancyForm(businessId.value, dataToSend);

    console.log('✅ [DEBUG] Formulario de servicios enviado exitosamente');
    emit('completed'); // Notificamos al padre que el proceso terminó con éxito.
  } catch (error: any) {
    console.error('❌ [DEBUG] Error al enviar formulario de servicios:', error);
    console.error('❌ [DEBUG] Error response:', error.response);
    submissionError.value = error.response?.data?.message || "Ocurrió un error inesperado al enviar tus datos. Por favor, inténtalo de nuevo.";
  } finally {
    console.log('🏁 [DEBUG] finalSubmit de servicios terminado, isLoading = false');
    isLoading.value = false;
  }
});

// --- FUNCIÓN AUXILIAR PARA SUBMIT ---
const handleFormSubmit = (event: Event) => {
  console.log('📝 [DEBUG] Evento submit del formulario ejecutado');
  console.log('📝 [DEBUG] Event:', event);
  console.log('📝 [DEBUG] Valores del formulario:', values);
  console.log('📝 [DEBUG] Errores del formulario:', errors);
  console.log('📝 [DEBUG] Llamando a finalSubmit...');
  finalSubmit(event);
  console.log('📝 [DEBUG] Después de finalSubmit - Si no aparecen logs de finalSubmit, hay errores de validación');
};

// Función de bypass para probar envío directo sin validación
const directSubmit = async () => {
  console.log('🔥 [DEBUG] BYPASS - Envío directo sin validación');
  console.log('🔥 [DEBUG] Valores actuales:', values);
  
  isLoading.value = true;
  submissionError.value = null;

  const dataToSend = new FormData();
  
  // Agregar todos los campos del formulario de servicios
  Object.entries(values).forEach(([key, value]) => {
    if (!(value instanceof File) && !Array.isArray(value) && value !== undefined && value !== null) {
      dataToSend.append(key, String(value));
      console.log(`🔥 [DEBUG] BYPASS - Agregando campo: ${key} = ${value}`);
    }
  });

  try {
    if (!businessId.value) throw new Error("ID del negocio no disponible");
    
    console.log('🔥 [DEBUG] BYPASS - Enviando al servicio...');
    await consultancyService.submitConsultancyForm(businessId.value, dataToSend);
    
    console.log('✅ [DEBUG] BYPASS - Formulario enviado exitosamente');
    emit('completed');
  } catch (error: any) {
    console.error('❌ [DEBUG] BYPASS - Error:', error);
    submissionError.value = error.response?.data?.message || "Error en envío directo";
  } finally {
    isLoading.value = false;
  }
};

// --- RENDERIZADO DINÁMICO DE PASOS ---
const stepComponentMap: Record<number, any> = { 1: Step1, 2: Step2, 3: Step3, 4: Step4, 5: Step5 };
const activeStepComponent = computed(() => stepComponentMap[currentStep.value] || null);
</script>

<template>
  <section class="wizard-section">
    <div class="wizard-container">
      <header class="wizard-header">
        <h2 class="wizard-title">Comienza tu Diagnóstico</h2>
        <p class="wizard-subtitle">
          Necesitamos algunos datos y documentos para preparar tu estrategia.
          <span class="step-counter">Paso {{ currentStep }} de {{ totalSteps }}</span>
        </p>
      </header>

      <main class="wizard-content">
        <form @submit.prevent="handleFormSubmit" class="wizard-form">
          <div class="steps-container">
            <Transition name="step-transition" mode="out-in">
              <component
                :is="activeStepComponent"
                v-if="activeStepComponent"
                :key="currentStep"
                :values="values"
                :errors="errors"
                :skipped-files="skippedFiles"
                :single-file-statuses="singleFileStatuses"
                :business-id="businessId"
                @update:form-value="handleFormValueUpdateFromChild"
                @update-file="updateFile"
              />
            </Transition>
          </div>

          <div v-if="submissionError" class="error-message-container">
            <p>{{ submissionError }}</p>
          </div>

          <div class="wizard-navigation">
            <button
              type="button"
              v-if="currentStep > 1"
              :disabled="isLoading"
              @click="prevStep"
              class="nav-button prev-button"
            >
              Anterior
            </button>
            <button
              type="button"
              v-if="currentStep < totalSteps"
              :disabled="isLoading"
              @click="nextStep"
              class="nav-button next-button"
            >
              Siguiente
            </button>
            <button
              type="submit"
              v-if="currentStep === totalSteps"
              :disabled="isLoading"
              @click="() => console.log('🔘 [DEBUG] Botón Finalizar y Enviar presionado')"
              class="nav-button submit-button"
            >
              <span v-if="isLoading" class="spinner"></span>
              {{ isLoading ? "Enviando Información..." : "Finalizar y Enviar" }}
            </button>
            
            <!-- Botón temporal de bypass para debug -->
            <button
              type="button"
              v-if="currentStep === totalSteps"
              :disabled="isLoading"
              @click="directSubmit"
              class="nav-button"
              style="background-color: #ff6b6b; margin-left: 10px;"
            >
              🔥 BYPASS (Debug)
            </button>
          </div>
        </form>
      </main>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.wizard-section {
  padding: 2rem 1rem;
  background-color: $white;

  @media (min-width: 768px) {
    padding: 4rem 1.5rem;
  }
}

.wizard-container {
  max-width: 750px;
  margin: 0 auto;
  background-color: $white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(48, 55, 120, 0.08);
  border: 1px solid #eef0f3;
  overflow: hidden;
}

.wizard-header {
  text-align: center;
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #eef0f3;
}

.wizard-title {
  font-family: $font-principal;
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 700;
  color: $BAKANO-DARK;
}

.wizard-subtitle {
  font-family: $font-secondary;
  font-size: clamp(0.95rem, 2.5vw, 1.05rem);
  color: rgba($BAKANO-DARK, 0.7);
  margin-top: 0.5rem;
  position: relative;
}

.step-counter {
  display: block;
  font-weight: 600;
  color: $BAKANO-PURPLE;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.wizard-content {
  padding: 2rem 1.5rem;

  @media (min-width: 768px) {
    padding: 2.5rem;
  }
}

.wizard-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.steps-container {
  min-height: 350px;
  position: relative;
}

.error-message-container {
  padding: 1rem;
  background-color: rgba($BAKANO-PINK, 0.08);
  border: 1px solid rgba($BAKANO-PINK, 0.2);
  color: darken($BAKANO-PINK, 15%);
  font-weight: 500;
  border-radius: 8px;
  text-align: center;
}

.wizard-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 1px solid #eef0f3;
}

.nav-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: $font-principal;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;

  &.prev-button {
    background-color: #f3f4f6;
    color: $BAKANO-DARK;

    &:hover:not(:disabled) {
      background-color: #e5e7eb;
    }
  }

  &.next-button,
  &.submit-button {
    background-color: $BAKANO-PINK;
    color: $white;

    &:hover:not(:disabled) {
      background-color: darken($BAKANO-PINK, 8%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($BAKANO-PINK, 0.3);
    }
  }

  &:not(:first-child) {
    margin-left: auto;
  }

  &:first-child:not(:last-child) {
    margin-right: auto;
  }

  &.submit-button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-left-color: $white;
  border-radius: 50%;
  width: 1.2em;
  height: 1.2em;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.step-transition-enter-active,
.step-transition-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.step-transition-enter-from,
.step-transition-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
