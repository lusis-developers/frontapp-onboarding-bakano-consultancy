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
  empleados: z.preprocess(
    v => (typeof v === "number" ? String(v) : v),
    z.string().min(1, "Número de empleados es requerido")
  ),
  ingresoMensual: z.preprocess(
    v => (typeof v === "number" ? String(v) : v),
    z.string().min(1, "Ingreso mensual es requerido")
  ),
  ingresoAnual: z.preprocess(
    v => (typeof v === "number" ? String(v) : v),
    z.string().min(1, "Ingreso anual es requerido")
  ),
  vendePorWhatsapp: z.boolean().optional(),
  gananciaWhatsapp: z.preprocess(
    v => (typeof v === "number" ? String(v) : v),
    z.string().optional()
  ),
  desafioPrincipal: z.string().min(1, "Desafío principal es requerido"),
  objetivoIdeal: z.string().min(1, "Objetivo ideal es requerido"),
  menuRestaurante: fileSchema,
  costoPorPlato: fileSchema,
  ventasMovimientos: fileSchema,
  ventasProductos: fileSchema,
  ventasCliente: optionalFileSchema,
}).refine(
  data =>
    !data.vendePorWhatsapp ||
    (data.vendePorWhatsapp && data.gananciaWhatsapp && data.gananciaWhatsapp.length > 0),
  {
    message: "Si vendes por WhatsApp, indica la ganancia estimada.",
    path: ["gananciaWhatsapp"],
  }
);
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
const stepFields: Record<number, (keyof FormValues)[]> = {
  1: ['instagram', 'tiktok', 'empleados'],
  2: ['ingresoMensual', 'ingresoAnual', 'vendePorWhatsapp', 'gananciaWhatsapp', 'desafioPrincipal'],
  3: ['objetivoIdeal'], // El objetivo ideal es el único campo de texto/select en el paso 3 de tu form React.
  // Los archivos se validarán con validateStepFiles.
  4: [], // El paso 4 de tu form React solo tiene cargas de archivos.
};

const validateStepFiles = (stepToCheck: number): { valid: boolean; message?: string } => {
  // No es necesario limpiar submissionError.value aquí, se hace en nextStep o finalSubmit
  let missingFileDisplayNames: string[] = [];

  // Helper para no repetir lógica
  const checkFile = (fieldName: keyof typeof fileStatuses.value, displayName: string) => {
    if (!fileStatuses.value[fieldName]?.uploaded && !skippedFiles.value[fieldName]) {
      missingFileDisplayNames.push(displayName);
    }
  };

  // Lógica basada en tu formulario React:
  if (stepToCheck === 3) {
    // En tu form React, el paso 3 incluye 'objetivoIdeal' (manejado por VeeValidate)
    // y los archivos 'menuRestaurante' y 'costoPorPlato'.
    // La validación de estos archivos se hacía al intentar pasar del paso 3.
    checkFile('menuRestaurante', 'Menú del Restaurante');
    checkFile('costoPorPlato', 'Costo por Plato');
  } else if (stepToCheck === 4) {
    // El paso 4 en tu form React es donde se suben los reportes de ventas.
    // La validación final de todos los archivos (incluyendo los opcionales no omitidos)
    // se hace en el 'onSubmit' general.
    // Para 'nextStep' desde el paso 3 (hacia el 4), solo validamos los del paso 3.
    // Para el 'finalSubmit' (que ocurre en el paso 4), validaremos todos globalmente.
    // Sin embargo, si quieres una validación *al intentar pasar del paso 4* (aunque sea el último antes de enviar),
    // podrías añadirla aquí. Pero es más común que la validación del último paso sea parte del 'finalSubmit'.
    // Por ahora, dejaremos que 'finalSubmit' maneje la validación completa de archivos del paso 4.

    // No obstante, si hubiera archivos obligatorios *solo* en el paso 4 que deben validarse *antes* de
    // permitir el intento de submit (aunque 'nextStep' no aplica aquí), los pondrías.
    // Según tu React, 'ventasMovimientos' y 'ventasProductos' son requeridos en el onSubmit final si no se omiten.
    // 'ventasCliente' es opcional.
  }
  // Esta función 'validateStepFiles' se usa principalmente para la lógica de 'nextStep'.
  // La validación exhaustiva de todos los archivos se hará en 'finalSubmit'.

  if (missingFileDisplayNames.length > 0) {
    // Construye el mensaje de error específico para los archivos faltantes de ESTE paso
    const filesErrorMessage = `Por favor, sube o marca "No tengo este archivo" para:\n${missingFileDisplayNames.join('\n')}`;
    return { valid: false, message: filesErrorMessage };
  }

  return { valid: true }; // Todos los archivos requeridos para este paso (si los hay) están o se omitieron.
};


const nextStep = async () => {
  submissionError.value = ''; // Limpiar errores de validación global del paso anterior
  const fieldsToValidate = stepFields[currentStep.value] || [];
  let allStepFieldsValid = true;

  // Valida cada campo de texto/select/checkbox del paso actual usando VeeValidate
  for (const fieldName of fieldsToValidate) {
    const result = await validateField(fieldName); // validateField es de useForm()
    if (!result.valid) {
      allStepFieldsValid = false;
    }
  }

  // Valida los archivos específicos de este paso (si los hay)
  // Según tu lógica React, la validación de archivos de menuRestaurante y costoPorPlato ocurre al final del paso 3.
  let fileValidation = { valid: true, message: '' };
  if (currentStep.value === 3) {
    fileValidation = validateStepFiles(currentStep.value) as { valid: boolean; message: string };
    if (!fileValidation.valid) {
      allStepFieldsValid = false;
      submissionError.value = fileValidation.message || "Faltan documentos financieros requeridos.";
    }
  }
  // No hay archivos que validar con validateStepFiles para pasar del paso 1 o 2.
  // Los archivos del paso 4 se validan en el finalSubmit.

  if (allStepFieldsValid) {
    if (currentStep.value < totalSteps) {
      currentStep.value++;
    }
  } else if (!submissionError.value) { // Si no hay un error específico de archivos, muestra uno genérico de campos
    submissionError.value = "Por favor, completa todos los campos requeridos y corrige los errores marcados.";
  }
};


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

const finalSubmit = handleSubmit(async (formDataValidatedByVeeValidate) => { // Cambié el nombre del parámetro para claridad
  // --- CONSOLE LOG AQUÍ ---
  console.log('🔴 finalSubmit EJECUTADO');
  console.log('BusinessData: Contenido del formulario validado por VeeValidate (antes de procesar archivos y enviar):', JSON.parse(JSON.stringify(formDataValidatedByVeeValidate)));
  // Usamos JSON.parse(JSON.stringify(...)) para obtener una copia limpia del objeto y evitar problemas con proxies de Vue al loguear.

  // También puedes loguear el estado de los archivos que manejas por separado:
  console.log('BusinessData: Estado de fileStatuses:', JSON.parse(JSON.stringify(fileStatuses.value)));
  console.log('BusinessData: Estado de skippedFiles:', JSON.parse(JSON.stringify(skippedFiles.value)));

  isLoading.value = true;
  submissionError.value = '';

  // Validación final de TODOS los archivos requeridos (tu lógica existente)
  let allFilesStillValid = true;
  let finalFileErrorMessages: string[] = [];
  const checkAllFilesForFinalSubmit = (key: string, displayName: string, isOptional: boolean = false, isSkippedInReactLogic: boolean = false) => {
    const canBeSkipped = isSkippedInReactLogic;
    if (!isOptional && !fileStatuses.value[key]?.uploaded && (!canBeSkipped || (canBeSkipped && !skippedFiles.value[key]))) {
      allFilesStillValid = false;
      finalFileErrorMessages.push(displayName);
    }
  };

  checkAllFilesForFinalSubmit('menuRestaurante', 'Menú del Restaurante', false, true);
  checkAllFilesForFinalSubmit('costoPorPlato', 'Costo por Plato', false, true);
  checkAllFilesForFinalSubmit('ventasMovimientos', 'Reporte de Movimientos', false, false);
  checkAllFilesForFinalSubmit('ventasProductos', 'Reporte de Ventas por Producto', false, true);
  checkAllFilesForFinalSubmit('ventasCliente', 'Reporte de Ventas por Cliente', true, true);

  if (!allFilesStillValid) {
    submissionError.value = `Documentos Faltantes Requeridos:\n${finalFileErrorMessages.join('\n')}`;
    isLoading.value = false;
    console.log('BusinessData: Envío detenido por archivos faltantes tras validación final.'); // Log adicional
    return;
  }

  // Construcción de dataToSend (tu lógica existente)
  const dataToSend = new FormData();
  (Object.keys(formDataValidatedByVeeValidate) as Array<keyof FormValues>).forEach(key => {
    const value = formDataValidatedByVeeValidate[key];
    if (key in fileStatuses.value) {
      const fileInfo = fileStatuses.value[key as keyof typeof fileStatuses.value];
      if (fileInfo.uploaded && fileInfo.file) {
        dataToSend.append(key, fileInfo.file);
      }
    } else if (value !== undefined && value !== null) {
      dataToSend.append(key, String(value));
    }
  });

  // Log del FormData final que se enviaría (para depurar qué se está añadiendo)
  console.log('BusinessData: FormData final a enviar (contenido aproximado):');
  for (let [key, value] of dataToSend.entries()) {
    if (value instanceof File) {
      console.log(key, { fileName: value.name, type: value.type, size: value.size });
    } else {
      console.log(key, value);
    }
  }

  try {
    if (!businessId.value) throw new Error("Business ID no disponible");
    // console.log('BusinessData: Intentando enviar al servicio...'); // Puedes descomentar este si quieres más logs
    await consultancyService.submitConsultancyForm(businessId.value, dataToSend);
    // console.log('BusinessData: Envío al servicio exitoso.'); // Puedes descomentar este
    isFormSubmitted.value = true;
  } catch (error: any) {
    console.error("BusinessData: Error en finalSubmit durante la llamada al servicio:", error);
    submissionError.value = error.response?.data?.message || error.message || "Hubo un problema al enviar los datos. Por favor, inténtalo de nuevo.";
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
            <div>currentStep: {{ currentStep }}</div>
            <Transition name="step-transition" mode="out-in">
              <component
                :is="activeStepComponent"
                :key="currentStep"
                v-if="activeStepComponent"
                :values="values"
                :file-statuses="fileStatuses"
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