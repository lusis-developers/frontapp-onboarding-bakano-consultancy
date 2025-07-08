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

// === LA CORRECCIÓN ===
// Aquí definimos las props nuevas y separadas que el padre SÍ está enviando.
const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, string | undefined>;
  skippedFiles: Record<string, boolean>;

  // Props nuevas que corrigen el error
  menuFiles: FileStatus[];
  singleFileStatuses: Record<string, FileStatus | null>;
}>();
// === FIN DE LA CORRECCIÓN ===

const emit = defineEmits([
  'update:form-value', 'update-file', 'add-menu-files', 'remove-menu-file',
]);

const objetivoIdeal = computed({
  get: () => props.values.objetivoIdeal,
  set: (val) => emit('update:form-value', 'objetivoIdeal', val),
});

const MAX_SIZE_MB = 70;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const handleMenuFilesChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  const validFiles = Array.from(files).filter(file => {
    if (file.size > MAX_SIZE_BYTES) {
      alert(`El archivo "${file.name}" excede el tamaño máximo y no se añadirá.`);
      return false;
    }
    return true;
  });

  if (validFiles.length > 0) {
    emit('add-menu-files', validFiles);
  }
  target.value = '';
};

const handleSingleFileChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
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
        <label for="objetivoIdeal" class="form-label">Objetivo ideal a lograr*</label>
        <TooltipIcon text="Describe en detalle la meta principal que quieres alcanzar con nuestra ayuda." />
      </div>
      <textarea v-model="objetivoIdeal" id="objetivoIdeal" placeholder="Ej: Aumentar la rentabilidad de mi menú un 20% en 6 meses." class="form-textarea" :class="{ 'input-error': !!props.errors.objetivoIdeal }" rows="4"></textarea>
      <span v-if="props.errors.objetivoIdeal" class="error-text">{{ props.errors.objetivoIdeal }}</span>
    </div>

    <div class="form-group-title">Documentos Financieros*</div>

    <div class="form-field file-field">
      <div class="form-label-wrapper">
        <label for="menuRestauranteFile" class="form-label-file">Menú del Restaurante (PDF, hasta 5 archivos)</label>
        <TooltipIcon text="Necesitamos tu menú para analizar precios, variedad y estructura de la oferta." />
      </div>
      <p class="file-note">Tamaño máximo por archivo: 70MB.</p>
      <div class="file-input-area">
        <input type="file" id="menuRestauranteFile" accept=".pdf" multiple @change="handleMenuFilesChange" class="form-input-file" :disabled="props.skippedFiles.menuRestaurante"/>
      </div>
      
      <div v-if="props.menuFiles.length > 0 && !props.skippedFiles.menuRestaurante" class="file-list">
        <div v-for="(file, index) in props.menuFiles" :key="file.name + index" class="file-status-chip multi">
            <span class="file-info">{{ file.name }} ({{ formatBytes(file.size) }})</span>
            <button @click="emit('remove-menu-file', index)" class="remove-file-btn" type="button" aria-label="Quitar archivo">&times;</button>
        </div>
      </div>

      <div class="skip-file-option">
        <input type="checkbox" :id="'skip_menuRestaurante'" :checked="props.skippedFiles.menuRestaurante" @change="event => handleSkipChange('menuRestaurante', event)" class="form-checkbox"/>
        <label :for="'skip_menuRestaurante'" class="form-label-checkbox">No tengo este archivo</label>
      </div>
      <span v-if="props.errors.menuRestaurante && !props.skippedFiles.menuRestaurante" class="error-text">{{ props.errors.menuRestaurante }}</span>
    </div>

    <div class="form-field file-field">
      <div class="form-label-wrapper">
        <label for="costoPorPlatoFile" class="form-label-file">Costo por Plato (PDF o Excel)</label>
        <TooltipIcon text="El costeo de platos es clave para entender tu rentabilidad actual." />
      </div>
      <p class="file-note">Tamaño óptimo: 20MB (máx. 70MB).</p>
      <div class="file-input-area">
        <input type="file" id="costoPorPlatoFile" accept=".pdf,.xlsx,.xls" @change="event => handleSingleFileChange('costoPorPlato', event)" class="form-input-file" :disabled="props.skippedFiles.costoPorPlato"/>
        
        <div v-if="props.singleFileStatuses.costoPorPlato?.uploaded && !props.skippedFiles.costoPorPlato" class="file-status-chip">
          {{ props.singleFileStatuses.costoPorPlato.name }} <span class="checkmark">✓</span>
        </div>
      </div>
      <div class="skip-file-option">
        <input type="checkbox" :id="'skip_costoPorPlato'" :checked="props.skippedFiles.costoPorPlato" @change="event => handleSkipChange('costoPorPlato', event)" class="form-checkbox"/>
        <label :for="'skip_costoPorPlato'" class="form-label-checkbox">No tengo este archivo</label>
      </div>
      <span v-if="props.errors.costoPorPlato && !props.skippedFiles.costoPorPlato" class="error-text">{{ props.errors.costoPorPlato }}</span>
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

.form-textarea {
  font-family: $font-secondary;
  padding: 0.75rem 1rem;
  border: 1px solid $BAKANO-LIGHT;
  border-radius: 8px;
  font-size: 1rem;
  color: $BAKANO-DARK;
  background-color: $white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  min-height: 80px;
}

.form-textarea::placeholder {
  color: $text-placeholder;
}

.form-textarea:focus {
  outline: none;
  border-color: $BAKANO-PURPLE;
  box-shadow: 0 0 0 2px rgba($BAKANO-PURPLE, 0.2);
}

.form-textarea.input-error {
  border-color: $BAKANO-PINK;
}

.form-textarea.input-error:focus {
  box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
}

.file-description {
  font-size: 1rem;
  color: $text-placeholder;
  margin-bottom: 0.25rem;
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

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.file-status-chip.multi {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: lighten($BAKANO-PURPLE, 45%);
  color: darken($BAKANO-PURPLE, 20%);
  padding: 0.3rem 0.3rem 0.3rem 0.75rem;
}

.file-info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.85rem;
  padding-right: 0.5rem;
}

.remove-file-btn {
  background: darken($BAKANO-PURPLE, 10%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
}

.remove-file-btn:hover {
  background: $BAKANO-PINK;
}
</style>