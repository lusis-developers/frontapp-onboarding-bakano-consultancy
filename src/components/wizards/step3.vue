<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';

interface FileStatus { name: string; uploaded: boolean; file?: File }

const props = defineProps<{
  values: Record<string, any>;
  fileStatuses: Record<string, FileStatus>;
  skippedFiles: Record<string, boolean>;
}>();

const emit = defineEmits(['update:form-value', 'update-file']);

const handleFileChange = (fieldName: string, event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0] || null;
  emit('update-file', fieldName, file, !!props.skippedFiles[fieldName]);
};

const handleSkipChange = (fieldName: string, event: Event) => {
  emit('update-file', fieldName, null, (event.target as HTMLInputElement).checked);
};
</script>

<template>
  <div class="form-step">
    <div class="form-field">
      <label for="objetivoIdeal" class="form-label">Objetivo ideal a lograr*</label>
      <Field name="objetivoIdeal" v-slot="{ field, meta }">
        <textarea
          v-bind="field"
          id="objetivoIdeal"
          placeholder="Describe tu objetivo"
          class="form-textarea"
          :class="{ 'input-error': !meta.valid && meta.touched }"
          rows="4"
        ></textarea>
      </Field>
      <ErrorMessage name="objetivoIdeal" class="error-text" />
    </div>

    <div class="form-group-title">Documentos Financieros*</div>

    <!-- Menú del Restaurante -->
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
            :class="{ 'input-error': !meta.valid && meta.touched && !props.skippedFiles.menuRestaurante }"
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

    <!-- Costo por Plato -->
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
            :class="{ 'input-error': !meta.valid && meta.touched && !props.skippedFiles.costoPorPlato }"
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
  background-color: lighten($BAKANO-GREEN, 45%);
  color: darken($BAKANO-GREEN, 15%);
  border-radius: 8px;
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
