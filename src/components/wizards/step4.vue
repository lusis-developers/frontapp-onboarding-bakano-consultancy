// src/components/wizard/businessdata/Step4_SalesReports.vue
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Field, ErrorMessage } from 'vee-validate'; // No se usa Field directamente para inputs tipo file si manejamos el estado externamente

interface FileStatus { name: string; uploaded: boolean; file?: File }

interface Props {
  formValues: {}; // No hay otros campos de texto en este paso según el original
  errors: Record<string, string | undefined>;
  fileStatuses: Record<string, FileStatus>;
  skippedFiles: Record<string, boolean>;
}
const props = defineProps<Props>();
const emit = defineEmits(['update-file']); // Solo 'update-file' si no hay otros campos de texto

const handleFileChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  emit('update-file', fieldName, file, !!props.skippedFiles[fieldName]);
};

const handleSkipChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const isSkipped = target.checked;
  emit('update-file', fieldName, null, isSkipped);
};

const fileFields = [
  { name: 'ventasMovimientos', label: 'Reporte de Movimientos (Excel)', description: 'Registro de movimientos y transacciones del restaurante', accept: '.xlsx,.xls', skippable: false },
  { name: 'ventasProductos', label: 'Reporte de Ventas por Producto (Excel)', description: 'Detalle de ventas desglosado por cada producto', accept: '.xlsx,.xls', skippable: true },
  { name: 'ventasCliente', label: 'Reporte de Ventas por Cliente (Excel)', description: 'Análisis de ventas categorizado por cliente', accept: '.xlsx,.xls', skippable: true },
];
</script>

<template>
  <div class="form-step">
    <div class="form-group-title">Reportes de Ventas*</div>

    <div v-for="fField in fileFields" :key="fField.name" class="form-field file-field">
      <label :for="fField.name + 'File'" class="form-label-file">{{ fField.label }}</label>
      <p class="file-description">{{ fField.description }}</p>
      <div class="file-input-area">
        <input
          type="file"
          :id="fField.name + 'File'"
          :accept="fField.accept"
          @change="event => handleFileChange(fField.name, event)"
          class="form-input-file"
          :disabled="props.skippedFiles[fField.name]"
          :class="{ 'input-error': errors[fField.name] && !props.skippedFiles[fField.name] }"
        />
        <div v-if="props.fileStatuses[fField.name]?.uploaded && !props.skippedFiles[fField.name]" class="file-status-chip">
          {{ props.fileStatuses[fField.name].name }} <span class="checkmark">✓</span>
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
      <ErrorMessage :name="fField.name" v-if="!props.skippedFiles[fField.name]" class="error-text" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

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
  margin-bottom: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid $gray-200; // Define $gray-200
  margin-top: 1rem;
}

// .file-field {
//   /* specific styles if needed */
// }

.file-description {
  font-size: 0.8rem;
  color: $text-gray-500; // Define $text-gray-500
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
  border: 1px dashed $gray-300; // Define $gray-300
  border-radius: $border-radius-md; // Define $border-radius-md
  background-color: $gray-50; // Define $gray-50
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
    border-radius: $border-radius-sm; // Define $border-radius-sm
    cursor: pointer;
    margin-right: 1rem;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: darken($BAKANO-PURPLE, 10%);
    }
  }

  &.input-error {
    border-color: $BAKANO-PINK;

    &:focus {
      box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
    }
  }

  &:disabled {
    background-color: $gray-100; // Define $gray-100
    cursor: not-allowed;
    border-style: solid;

    &::file-selector-button {
      background-color: $gray-400;
      cursor: not-allowed;
    }

    // Define $gray-400
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
  border-radius: $border-radius-sm;
  border: 1px solid $gray-300;
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

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
  }
}

.form-label-checkbox {
  font-size: 0.9rem;
  color: $text-gray-700;
  cursor: pointer;
  font-weight: normal; // Define $text-gray-700
}

.file-status-chip {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: lighten($BAKANO-GREEN, 45%);
  color: darken($BAKANO-GREEN, 15%);
  border-radius: $border-radius-lg;
  font-size: 0.8rem;
  margin-top: 0.5rem; // Define $border-radius-lg

  .checkmark {
    color: darken($BAKANO-GREEN, 15%);
    font-weight: bold;
    margin-left: 0.25rem;
  }
}

.error-text {
  font-size: 0.8rem;
  color: $BAKANO-PINK;
  margin-top: 0.1rem;
}
</style>