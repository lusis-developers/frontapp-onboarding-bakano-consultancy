// src/components/wizard/businessdata/Step3_FinancialDocs.vue
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';

interface FileStatus { name: string; uploaded: boolean; file?: File }

interface Props {
  formValues: {
    objetivoIdeal?: string;
    // Los campos de archivo no estarán directamente en formValues con File objects
    // pero los necesitamos para la validación de VeeValidate si se definen en el schema
  };
  errors: Record<string, string | undefined>;
  fileStatuses: Record<string, FileStatus>; // ej: { menuRestaurante: { name: 'menu.pdf', uploaded: true, file: FileObject } }
  skippedFiles: Record<string, boolean>; // ej: { menuRestaurante: true }
}
const props = defineProps<Props>();
const emit = defineEmits(['update:form-value', 'update-file']);

const handleInput = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:form-value', fieldName, target.value);
};

const handleFileChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  // Pasa el estado actual de 'skipped' para este archivo
  emit('update-file', fieldName, file, !!props.skippedFiles[fieldName]);
};

const handleSkipChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const isSkipped = target.checked;
  // Si se marca como skip, el 'file' es null
  emit('update-file', fieldName, null, isSkipped);
};
</script>

<template>
  <div class="form-step">
    <div class="form-field">
      <label for="objetivoIdeal" class="form-label">Objetivo ideal a lograr*</label>
      <Field name="objetivoIdeal" v-slot="{ field, meta }">
        <textarea
          id="objetivoIdeal"
          placeholder="Describe tu objetivo"
          :value="props.formValues.objetivoIdeal"
          @input="event => handleInput('objetivoIdeal', event)"
          class="form-textarea"
          :class="{ 'input-error': !meta.valid && meta.touched && errors.objetivoIdeal }"
          rows="4"
        ></textarea>
      </Field>
      <ErrorMessage name="objetivoIdeal" class="error-text" />
    </div>

    <div class="form-group-title">Documentos Financieros*</div>

    <div class="form-field file-field">
      <label for="menuRestaurante" class="form-label-file">Menú del Restaurante (PDF)</label>
      <p class="file-description">Sube tu menú actual en formato PDF</p>
      <div class="file-input-area">
        <Field name="menuRestaurante" v-slot="{ field, meta }">
           <input
            type="file"
            id="menuRestauranteFile"
            accept=".pdf"
            @change="event => handleFileChange('menuRestaurante', event)"
            class="form-input-file"
            :disabled="props.skippedFiles.menuRestaurante"
            :class="{ 'input-error': !meta.valid && meta.touched && errors.menuRestaurante && !props.skippedFiles.menuRestaurante }"
          />
        </Field>
         <div v-if="props.fileStatuses.menuRestaurante?.uploaded && !props.skippedFiles.menuRestaurante" class="file-status-chip">
          {{ props.fileStatuses.menuRestaurante.name }} <span class="checkmark">✓</span>
        </div>
      </div>
      <div class="skip-file-option">
        <input
            type="checkbox"
            :id="'skip_menuRestaurante'"
            :checked="props.skippedFiles.menuRestaurante"
            @change="event => handleSkipChange('menuRestaurante', event)"
            class="form-checkbox"
        />
        <label :for="'skip_menuRestaurante'" class="form-label-checkbox">No tengo este archivo</label>
      </div>
      <ErrorMessage name="menuRestaurante" v-if="!props.skippedFiles.menuRestaurante" class="error-text" />
    </div>

    <div class="form-field file-field">
      <label for="costoPorPlato" class="form-label-file">Costo por Plato (PDF o Excel)</label>
      <p class="file-description">Documento detallando el costo de producción de cada plato</p>
      <div class="file-input-area">
         <Field name="costoPorPlato" v-slot="{ field, meta }">
           <input
            type="file"
            id="costoPorPlatoFile"
            accept=".pdf,.xlsx,.xls"
            @change="event => handleFileChange('costoPorPlato', event)"
            class="form-input-file"
            :disabled="props.skippedFiles.costoPorPlato"
            :class="{ 'input-error': !meta.valid && meta.touched && errors.costoPorPlato && !props.skippedFiles.costoPorPlato }"
          />
        </Field>
        <div v-if="props.fileStatuses.costoPorPlato?.uploaded && !props.skippedFiles.costoPorPlato" class="file-status-chip">
          {{ props.fileStatuses.costoPorPlato.name }} <span class="checkmark">✓</span>
        </div>
      </div>
      <div class="skip-file-option">
         <input
            type="checkbox"
            :id="'skip_costoPorPlato'"
            :checked="props.skippedFiles.costoPorPlato"
            @change="event => handleSkipChange('costoPorPlato', event)"
            class="form-checkbox"
        />
        <label :for="'skip_costoPorPlato'" class="form-label-checkbox">No tengo este archivo</label>
      </div>
      <ErrorMessage name="costoPorPlato" v-if="!props.skippedFiles.costoPorPlato" class="error-text" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;
// Importa los estilos comunes de form-field, form-label, etc.
// Podrías crear un _forms.scss y hacer @use si se repiten mucho,
// o copiar los estilos relevantes de Step1/Step2. Por brevedad, los omito aquí,
// asumiendo que tendrás una forma consistente de estilizar.

.form-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  // Estilo base para cada grupo de input
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
  font-size: 1.1rem; // text-lg
  font-weight: 600; // font-semibold
  margin-bottom: 0.75rem; // mb-3 o mb-4
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
  min-height: 80px; // Para que no sea demasiado pequeño

  &::placeholder {
    color: $text-placeholder;
  }

  &:focus {
    outline: none;
    border-color: $BAKANO-PURPLE;
    box-shadow: 0 0 0 2px rgba($BAKANO-PURPLE, 0.2);
  }

  &.input-error {
    border-color: $BAKANO-PINK;

    &:focus {
      box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
    }
  }
}

// .file-field {
//   // Estilos específicos si un campo de archivo necesita más estructura
// }

.file-description {
  font-size: 1rem; // text-xs
  color: $text-placeholder;
  margin-bottom: 0.25rem; // mb-1
}

.file-input-area {
  position: relative; // Para el checkmark si se añade
}

.form-input-file {
  font-family: $font-secondary;
  font-size: 0.9rem;
  color: $BAKANO-DARK;
  padding: 0.5rem; // Ajusta según necesidad
  border: 1px dashed $BAKANO-LIGHT;
  border-radius: 8px;
  background-color: $BAKANO-LIGHT;
  cursor: pointer;
  width: 100%;

  &:hover {
    border-color: $BAKANO-PURPLE;
  }

  &::file-selector-button {
    // Estilizar el botón "Seleccionar archivo"
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

  &.input-error {
    border-color: $BAKANO-PINK;

    &:focus {
      box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
    }
  }

  &:disabled {
    background-color: $BAKANO-LIGHT;
    cursor: not-allowed;
    border-style: solid;

    &::file-selector-button {
      background-color: $BAKANO-LIGHT;
      cursor: not-allowed;
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
  // Copiado de Step2 para consistencia
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

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
  }
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
  background-color: lighten($BAKANO-GREEN, 45%); // Asume $BAKANO-GREEN de tus vars
  color: darken($BAKANO-GREEN, 15%);
  border-radius: 8px; // Asume 8px
  font-size: 0.8rem;
  margin-top: 0.5rem;

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