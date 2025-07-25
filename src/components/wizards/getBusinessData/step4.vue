<script setup lang="ts">
import TooltipIcon from '@/components/shared/TooltipIcon.vue';

// Interfaz para el estado de los archivos
interface FileStatus {
  name: string;
  uploaded: boolean;
  file?: File;
}

const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, string | undefined>;
  skippedFiles: Record<string, boolean>;
  singleFileStatuses: Record<string, FileStatus | null>;
}>();

// --- EMITS MODIFICADOS ---
// Se elimina 'update:form-value' ya que no se manejan campos de formulario aquí, solo archivos.
const emit = defineEmits(['update-file']);

// --- HANDLERS ---
const handleFileChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;

  if (file) {
    const MAX_SIZE_MB = 70;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      alert(`El archivo es demasiado grande (máx. ${MAX_SIZE_MB}MB).`);
      target.value = '';
      return;
    }
  }
  emit('update-file', fieldName, file, false);
};

// --- FUNCIÓN ELIMINADA ---
// Se elimina `handlePolicyChange` ya que esa lógica se movió.

const handleSkipChange = (fieldName: string, event: Event) => {
  emit('update-file', fieldName, null, (event.target as HTMLInputElement).checked);
};

// Se mantiene la definición de los campos de archivo.
const fileFields = [
  { name: 'ventasMovimientos', label: 'Reporte de Movimientos (Excel)', description: 'Registro de transacciones del restaurante (Ej: Reporte de Datafast, Kushki).', note: 'Idealmente de los últimos 12 meses (máximo 18 meses).', accept: '.xlsx,.xls', skippable: false, tooltipText: 'Este es el reporte más importante. Contiene el detalle de cada transacción que procesas.' },
  { name: 'ventasProductos', label: 'Reporte de Ventas por Producto (Excel)', description: 'Detalle de ventas desglosado por cada producto (PMIX).', note: 'Tamaño óptimo: 20MB (máx. 70MB).', accept: '.xlsx,.xls', skippable: true, tooltipText: 'Nos ayuda a entender qué productos son tus estrellas y cuáles no, para optimizar tu menú.' },
  { name: 'ventasCliente', label: 'Reporte de Ventas por Cliente (Excel)', description: 'Análisis de ventas categorizado por cliente.', note: 'Tamaño óptimo: 20MB (máx. 70MB).', accept: '.xlsx,.xls', skippable: true, tooltipText: 'Si lo tienes, este reporte es oro. Permite identificar a tus clientes más leales y su frecuencia.' },
];
</script>

<template>
  <div class="form-step">
    <div class="form-group-title">Reportes de Ventas*</div>
    <div
      v-for="fField in fileFields"
      :key="fField.name"
      class="form-field file-field"
    >
      <div class="form-label-wrapper">
        <label :for="fField.name + 'File'" class="form-label-file">{{ fField.label }}</label>
        <TooltipIcon :text="fField.tooltipText" />
      </div>

      <p class="file-description">{{ fField.description }}</p>
      <p v-if="fField.note" class="file-note">{{ fField.note }}</p>
      <div class="file-input-area">
        <input
          type="file"
          :id="fField.name + 'File'"
          :accept="fField.accept"
          @change="event => handleFileChange(fField.name, event)"
          class="form-input-file"
          :disabled="props.skippedFiles[fField.name]"
          :class="{ 'input-error': !!props.errors[fField.name] && !props.skippedFiles[fField.name] }"
        />
        <div
          v-if="props.singleFileStatuses[fField.name]?.uploaded && !props.skippedFiles[fField.name]"
          class="file-status-chip"
        >
          {{ props.singleFileStatuses[fField.name]?.name }} <span class="checkmark">✓</span>
        </div>
      </div>
      <div v-if="fField.skippable" class="skip-file-option">
        <input
          type="checkbox"
          :id="'skip_' + fField.name"
          :checked="props.skippedFiles[fField.name]"
          @change="event => handleSkipChange(fField.name, event)"
          class="form-checkbox"
        />
        <label :for="'skip_' + fField.name" class="form-label-checkbox">No tengo este archivo</label>
      </div>
      <span v-if="props.errors[fField.name] && !props.skippedFiles[fField.name]" class="error-text">
        {{ props.errors[fField.name] }}
      </span>
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
  margin-bottom: 0; // Ajustado
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

  &:hover {
    border-color: $BAKANO-PURPLE;
  }

  &::file-selector-button {
    background-color: $BAKANO-PURPLE;
    color: $white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 1rem;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: darken($BAKANO-PURPLE, 10%);
    }
  }
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

  &:checked {
    background-color: $BAKANO-PINK;
    border-color: $BAKANO-PINK;

    &::after {
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
  }
}

.form-label-checkbox {
  font-size: 0.9rem;
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

.checkmark {
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