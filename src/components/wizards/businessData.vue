<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { consultancyService } from '@/services/consultancyService'; // Ajusta la ruta

// Componentes de Paso (los que ya tienes)
import Step1 from './step1.vue';
import Step2 from './step2.vue';
import Step3 from './step3.vue';
import Step4 from './step4.vue';
import SubmittedMessage from './submittedMessage.vue'; // Asumiendo esta ruta

// --- 1. Props que BusinessData.vue (el modal/mago) ESPERA de Onboarding.vue ---
interface BusinessDataOwnProps {
  open: boolean;
  isPreSubmitted?: boolean;
}
const props = withDefaults(defineProps<BusinessDataOwnProps>(), {
  isPreSubmitted: false,
});

// --- Emits para comunicarse con Onboarding.vue ---
const emit = defineEmits(['update:open']);

// --- 2. Estado INTERNO y Lógica del Mago ---
const currentStep = ref(1);
const totalSteps = 4;
const isLoading = ref(false);
const isFormSubmitted = ref(props.isPreSubmitted);
const submissionError = ref<string>('');

const route = useRoute(); // Si necesitas businessId
const businessId = computed(() => route.params.businessId as string || 'SOME_DEFAULT_ID'); // Provee un fallback

// Zod Schema (el mismo que definimos antes)
const fileSchema = z.instanceof(File).optional();
const optionalFileSchema = z.instanceof(File).optional();
const registrationFormSchema = z.object({
  instagram: z.string().min(1, "Cuenta de Instagram es requerida"),
  tiktok: z.string().min(1, "Cuenta de TikTok es requerida"),
  empleados: z.string().min(1, "Número de empleados es requerido"),
  ingresoMensual: z.string().min(1, "Ingreso mensual es requerido"),
  ingresoAnual: z.string().min(1, "Ingreso anual es requerido"),
  vendePorWhatsapp: z.boolean().optional(),
  gananciaWhatsapp: z.string().optional(),
  desafioPrincipal: z.string().min(1, "Desafío principal es requerido"),
  objetivoIdeal: z.string().min(1, "Objetivo ideal es requerido"),
  menuRestaurante: fileSchema,
  costoPorPlato: fileSchema,
  ventasMovimientos: fileSchema,
  ventasProductos: fileSchema,
  ventasCliente: optionalFileSchema,
}).refine(data => !data.vendePorWhatsapp || (data.vendePorWhatsapp && data.gananciaWhatsapp && data.gananciaWhatsapp.length > 0), {
  message: "Si vendes por WhatsApp, indica la ganancia estimada.",
  path: ["gananciaWhatsapp"],
});
type FormValues = z.infer<typeof registrationFormSchema>;

const { handleSubmit, values, errors, setFieldValue, validateField, meta, resetForm } = useForm<FormValues>({
  validationSchema: toTypedSchema(registrationFormSchema),
  initialValues: {
    instagram: '', tiktok: '', empleados: '', ingresoMensual: '', ingresoAnual: '',
    vendePorWhatsapp: false, gananciaWhatsapp: '', desafioPrincipal: '', objetivoIdeal: '',
  },
});

// Estado de archivos
interface FileStatus { name: string; uploaded: boolean; file?: File }
const fileStatuses = ref<Record<string, FileStatus>>({
  menuRestaurante: { name: "", uploaded: false }, costoPorPlato: { name: "", uploaded: false },
  ventasMovimientos: { name: "", uploaded: false }, ventasProductos: { name: "", uploaded: false },
  ventasCliente: { name: "", uploaded: false },
});
const skippedFiles = ref<Record<string, boolean>>({
  menuRestaurante: false, costoPorPlato: false, ventasMovimientos: false,
  ventasProductos: false, ventasCliente: false,
});

// Watchers para props
watch(() => props.open, (newVal) => {
  if (newVal && props.isPreSubmitted) isFormSubmitted.value = true;
  if (!newVal && !isLoading.value && !props.isPreSubmitted) { // Evitar reset si está cargando o es presubmitted
    // resetForm({ values: { ...initialValues... } }); // Opcional: resetear con valores iniciales
    // currentStep.value = 1;
    // isFormSubmitted.value = false;
    // submissionError.value = '';
    // Object.keys(fileStatuses.value).forEach(key => fileStatuses.value[key] = { name: "", uploaded: false });
    // Object.keys(skippedFiles.value).forEach(key => skippedFiles.value[key] = false);
  }
});
watch(() => props.isPreSubmitted, (newVal) => { if (newVal) isFormSubmitted.value = true; });

// Métodos del diálogo y navegación
const handleDialogClose = () => {
  if (!props.isPreSubmitted && !isLoading.value) { // No cerrar si es pre-enviado o está cargando
    emit('update:open', false);
  }
};
const stepFields: Record<number, (keyof FormValues)[]> = { /* ... (como antes) ... */ };
const validateStepFiles = (step: number): { valid: boolean, message?: string } => { /* ... (como antes) ... */ return { valid: true }; }; // Implementa esta lógica

const nextStep = async () => { /* ... (tu lógica de nextStep como antes) ... */ currentStep.value < totalSteps ? currentStep.value++ : null; };
const prevStep = () => { /* ... (tu lógica de prevStep como antes) ... */ currentStep.value > 1 ? currentStep.value-- : null; };

const updateFileStatusFromChild = (fieldName: string, file: File | null, isSkipped: boolean) => {
  skippedFiles.value[fieldName] = isSkipped;
  const fieldKey = fieldName as keyof FormValues;
  if (isSkipped || !file) {
    fileStatuses.value[fieldName] = { name: '', uploaded: false, file: undefined };
    setFieldValue(fieldKey, undefined);
  } else {
    fileStatuses.value[fieldName] = { name: file.name, uploaded: true, file: file };
    setFieldValue(fieldKey, file);
  }
};
const handleFormValueUpdateFromChild = (fieldName: keyof FormValues, value: any) => {
  setFieldValue(fieldName, value);
};

const finalSubmit = handleSubmit(async (formData) => {
  isLoading.value = true;
  submissionError.value = '';
  // Validaciones de archivo aquí...
  const allFilesValidation = validateStepFiles(totalSteps); // O una validación global de archivos
  if (!allFilesValidation.valid) {
    submissionError.value = allFilesValidation.message || `Documentos Faltantes`;
    isLoading.value = false;
    return;
  }

  const dataToSend = new FormData();
  // Llenar FormData...
  // ... (tu lógica para construir FormData) ...
  Object.keys(formData).forEach(keyStr => {
    const key = keyStr as keyof FormValues;
    const value = formData[key];
    if (key in fileStatuses.value) {
      const fileInfo = fileStatuses.value[key as keyof typeof fileStatuses.value];
      if (fileInfo.uploaded && fileInfo.file) dataToSend.append(key, fileInfo.file);
    } else if (value !== undefined && value !== null) {
      dataToSend.append(key, String(value));
    }
  });


  try {
    if (!businessId.value) throw new Error("Business ID no disponible");
    await consultancyService.submitConsultancyForm(businessId.value, dataToSend);
    isFormSubmitted.value = true;
  } catch (error) {
    submissionError.value = "Hubo un problema al enviar. Inténtalo de nuevo.";
  } finally {
    isLoading.value = false;
  }
});

// Mapeo de componentes de paso (tu código original)
const stepComponentMap: Record<number, any> = { 1: Step1, 2: Step2, 3: Step3, 4: Step4 };
const activeStepComponent = computed(() => stepComponentMap[currentStep.value] || null);

</script>

<template>
  <div v-if="props.open" class="dialog-overlay" @mousedown.self="handleDialogClose">
    <div class="dialog-panel wizard-dialog">
      <header class="dialog-header">
        <h2 class="wizard-title">
          {{ isFormSubmitted ? "¡Agenda tu Reunión!" : "Registro de Información" }}
        </h2>
        <button @click="handleDialogClose" class="close-button" aria-label="Cerrar diálogo">&times;</button>
      </header>

      <main class="dialog-content">
        <div v-if="isFormSubmitted" class="submitted-content-wrapper">
          <SubmittedMessage :is-pre-submitted="props.isPreSubmitted" />
        </div>
        <form v-else @submit.prevent="finalSubmit" class="wizard-form">
          <div class="business-data-steps-container">
            <Transition name="step-transition" mode="out-in">
              <component
                :is="activeStepComponent"
                :key="currentStep"
                v-if="activeStepComponent"
                :form-values="values" :errors="errors"     :file-statuses="fileStatuses"
                :skipped-files="skippedFiles"
                @update:form-value="handleFormValueUpdateFromChild"
                @update-file="updateFileStatusFromChild"
                class="step-component-wrapper"
              />
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
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
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
  transition: opacity 0.3s ease-in, transform 0.3s ease-in;
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
  transition: background-color 0.2s ease, opacity 0.2s ease, transform 0.1s ease;

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
  /* Estilos para tu SubmittedMessage.vue */
  text-align: center;
  padding: 2rem 0;
}
</style>