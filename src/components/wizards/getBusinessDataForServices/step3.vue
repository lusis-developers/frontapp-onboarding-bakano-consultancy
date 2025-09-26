<script setup lang="ts">
import { computed } from 'vue';
import TooltipIcon from '@/components/shared/TooltipIcon.vue';

// Interfaz para el estado de los archivos
interface FileStatus {
  name: string;
  size: number;
  uploaded: boolean;
  file?: File;
}

// Props que recibe el componente
const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, string | undefined>;
  skippedFiles: Record<string, boolean>;
  singleFileStatuses: Record<string, FileStatus | null>;
}>();

const emit = defineEmits([
  'update:form-value', 'update-file'
]);

const objetivoIdeal = computed({
  get: () => props.values.objetivoIdeal,
  set: (val) => emit('update:form-value', 'objetivoIdeal', val),
});

const serviceDescription = computed({
  get: () => props.values.serviceDescription,
  set: (val) => emit('update:form-value', 'serviceDescription', val),
});

const serviceType = computed({
  get: () => props.values.serviceType,
  set: (val) => emit('update:form-value', 'serviceType', val),
});

const MAX_SIZE_MB = 70;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const handleSingleFileChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  
  if (file && file.size > MAX_SIZE_BYTES) {
    alert(`El archivo "${file.name}" excede el tamaño máximo de ${MAX_SIZE_MB}MB y no se añadirá.`);
    target.value = '';
    return;
  }
  
  emit('update-file', fieldName, file, false);
};

const handleSkipChange = (fieldName: string, event: Event) => {
  const isSkipped = (event.target as HTMLInputElement).checked;
  emit('update-file', fieldName, null, isSkipped);
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
</script>

<template>
  <div class="form-step">
    <div class="form-field">
      <div class="form-label-wrapper">
        <label for="serviceType" class="form-label">Tipo de Servicio*</label>
        <TooltipIcon text="Especifica el tipo de servicio que ofreces (ej: Consultoría, Diseño, Marketing, etc.)" />
      </div>
      <input 
        v-model="serviceType" 
        id="serviceType" 
        type="text"
        placeholder="Ej: Consultoría en Marketing Digital" 
        class="form-input" 
        :class="{ 'input-error': !!props.errors.serviceType }" 
        maxlength="100"
      />
      <span v-if="props.errors.serviceType" class="error-text">{{ props.errors.serviceType }}</span>
    </div>

    <div class="form-field">
      <div class="form-label-wrapper">
        <label for="objetivoIdeal" class="form-label">Objetivo ideal a lograr*</label>
        <TooltipIcon text="Describe en detalle la meta principal que quieres alcanzar con nuestra ayuda." />
      </div>
      <textarea 
        v-model="objetivoIdeal" 
        id="objetivoIdeal" 
        placeholder="Ej: Aumentar la eficiencia operativa de mi negocio un 25% en 6 meses." 
        class="form-textarea" 
        :class="{ 'input-error': !!props.errors.objetivoIdeal }" 
        rows="4"
      ></textarea>
      <span v-if="props.errors.objetivoIdeal" class="error-text">{{ props.errors.objetivoIdeal }}</span>
    </div>

    <div class="form-field">
      <div class="form-label-wrapper">
        <label for="serviceDescription" class="form-label">Descripción detallada de tu servicio*</label>
        <TooltipIcon text="Explica qué servicios ofreces, a qué tipo de clientes te diriges y cuál es tu propuesta de valor." />
      </div>
      <textarea 
        v-model="serviceDescription" 
        id="serviceDescription" 
        placeholder="Ej: Ofrezco consultoría en marketing digital para pequeñas empresas, especializado en redes sociales y estrategias de contenido..." 
        class="form-textarea" 
        :class="{ 'input-error': !!props.errors.serviceDescription }" 
        rows="4"
      ></textarea>
      <span v-if="props.errors.serviceDescription" class="error-text">{{ props.errors.serviceDescription }}</span>
    </div>

    <div class="form-group-title">Documentos Financieros</div>

    <div class="form-field file-field">
      <div class="form-label-wrapper">
        <label for="monthlyTransactionsPathFile" class="form-label-file">Reporte de Transacciones Mensuales (PDF o Excel)</label>
        <TooltipIcon text="Necesitamos un reporte de tus transacciones mensuales para analizar el flujo de ingresos y patrones de tu negocio." />
      </div>
      <p class="file-note">Tamaño óptimo: 20MB (máx. 70MB).</p>
      <div class="file-input-area">
        <input 
          type="file" 
          id="monthlyTransactionsPathFile" 
          accept=".pdf,.xlsx,.xls" 
          @change="event => handleSingleFileChange('monthlyTransactionsPath', event)" 
          class="form-input-file" 
          :disabled="props.skippedFiles.monthlyTransactionsPath"
        />
        
        <div v-if="props.singleFileStatuses.monthlyTransactionsPath?.uploaded && !props.skippedFiles.monthlyTransactionsPath" class="file-status-chip">
          {{ props.singleFileStatuses.monthlyTransactionsPath.name }} <span class="checkmark">✓</span>
        </div>
      </div>
      <div class="skip-file-option">
        <input 
          type="checkbox" 
          :id="'skip_monthlyTransactionsPath'" 
          :checked="props.skippedFiles.monthlyTransactionsPath" 
          @change="event => handleSkipChange('monthlyTransactionsPath', event)" 
          class="form-checkbox"
        />
        <label :for="'skip_monthlyTransactionsPath'" class="form-label-checkbox">No tengo este archivo</label>
      </div>
      <span v-if="props.errors.monthlyTransactionsPath && !props.skippedFiles.monthlyTransactionsPath" class="error-text">{{ props.errors.monthlyTransactionsPath }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.form-label-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-note {
  font-size: 0.85rem;
  color: $BAKANO-PURPLE;
  font-weight: 500;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

.form-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label,
.form-label-file,
.form-group-title {
  font-family: $font-secondary;
  font-weight: 500;
  color: $BAKANO-DARK;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.form-group-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid $BAKANO-LIGHT;
  margin-top: 1rem;
}

.form-input,
.form-textarea {
  font-family: $font-secondary;
  padding: 0.75rem 1rem;
  border: 1px solid $BAKANO-LIGHT;
  border-radius: 8px;
  font-size: 1rem;
  color: $BAKANO-DARK;
  background-color: $white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-textarea {
  min-height: 80px;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: $text-placeholder;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: $BAKANO-PURPLE;
  box-shadow: 0 0 0 2px rgba($BAKANO-PURPLE, 0.2);
}

.form-input.input-error,
.form-textarea.input-error {
  border-color: $BAKANO-PINK;
}

.form-input.input-error:focus,
.form-textarea.input-error:focus {
  box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
}

.file-input-area {
  position: relative;
}

.form-input-file {
  font-family: $font-secondary;
  font-size: 0.9rem;
  color: $BAKANO-DARK;
  padding: 0.5rem;
  border: 1px dashed $BAKANO-LIGHT;
  border-radius: 8px;
  background-color: $BAKANO-LIGHT;
  cursor: pointer;
  width: 100%;
}

.form-input-file:hover {
  border-color: $BAKANO-PURPLE;
}

.form-input-file::file-selector-button {
  background-color: $BAKANO-PURPLE;
  color: $white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 1rem;
  transition: background-color 0.2s ease;
}

.form-input-file::file-selector-button:hover {
  background-color: darken($BAKANO-PURPLE, 10%);
}

.form-input-file.input-error {
  border-color: $BAKANO-PINK;
}

.form-input-file.input-error:focus {
  box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
}

.form-input-file:disabled {
  background-color: $BAKANO-LIGHT;
  cursor: not-allowed;
  border-style: solid;
}

.form-input-file:disabled::file-selector-button {
  background-color: $BAKANO-LIGHT;
  cursor: not-allowed;
}

.skip-file-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.form-checkbox {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 8px;
  border: 2px solid $BAKANO-LIGHT;
  cursor: pointer;
  appearance: none;
  position: relative;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.form-checkbox:checked {
  background-color: $BAKANO-PINK;
  border-color: $BAKANO-PINK;
}

.form-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 0.325rem;
  top: 0.075rem;
  width: 0.25rem;
  height: 0.55rem;
  border: solid $white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.form-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
}

.form-label-checkbox {
  font-size: 1rem;
  color: $text-placeholder;
  cursor: pointer;
  font-weight: normal;
}

.file-status-chip {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: lighten($BAKANO-GREEN, 45%);
  color: darken($BAKANO-GREEN, 15%);
  border-radius: 8px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.file-status-chip .checkmark {
  color: darken($BAKANO-GREEN, 15%);
  font-weight: bold;
  margin-left: 0.25rem;
}

.error-text {
  font-size: 0.8rem;
  color: $BAKANO-PINK;
  margin-top: 0.1rem;
}
</style>