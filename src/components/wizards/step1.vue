// src/components/wizard/businessdata/Step1_BusinessInfo.vue
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';

interface Props {
  // `formValues` will come from the parent component's VeeValidate `values`
  formValues: {
    instagram?: string;
    tiktok?: string;
    empleados?: string;
    // Add other fields as needed if they are part of formValues
  };
  // `errors` will come from the parent component's VeeValidate `errors`
  errors: Record<string, string | undefined>;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:form-value']);

// Helper function to emit updates to the parent, which then calls setFieldValue
const handleInput = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:form-value', fieldName, target.value);
};
</script>

<template>
  <div class="form-step">
    <div class="form-field">
      <label for="instagram" class="form-label">Cuenta de Instagram*</label>
      <Field name="instagram" v-slot="{ field, meta }">
        <input
          id="instagram"
          type="text"
          placeholder="@turestaurante"
          :value="props.formValues.instagram"
          @input="event => handleInput('instagram', event)"
          class="form-input"
          :class="{ 'input-error': !meta.valid && meta.touched && errors.instagram }"
        />
      </Field>
      <ErrorMessage name="instagram" class="error-text" />
    </div>

    <div class="form-field">
      <label for="tiktok" class="form-label">Cuenta de TikTok</label>
      <Field name="tiktok" v-slot="{ field, meta }">
        <input
          id="tiktok"
          type="text"
          placeholder="@turestaurante"
          :value="props.formValues.tiktok"
          @input="event => handleInput('tiktok', event)"
          class="form-input"
          :class="{ 'input-error': !meta.valid && meta.touched && errors.tiktok }"
        />
      </Field>
      <ErrorMessage name="tiktok" class="error-text" />
    </div>

    <div class="form-field">
      <label for="empleados" class="form-label">Número de empleados*</label>
      <Field name="empleados" v-slot="{ field, meta }">
        <input
          id="empleados"
          type="number"
          placeholder="Ej: 5"
          :value="props.formValues.empleados"
          @input="event => handleInput('empleados', event)"
          class="form-input"
          :class="{ 'input-error': !meta.valid && meta.touched && errors.empleados }"
        />
      </Field>
      <ErrorMessage name="empleados" class="error-text" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *; // Tus variables globales SCSS

.form-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // Espaciado entre campos
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // Espacio entre label, input, y mensaje de error
}

.form-label {
  font-family: $font-secondary; // Asumiendo 'Inter' o similar
  font-weight: 500;
  color: $BAKANO-DARK;
  font-size: 0.9rem;
  margin-bottom: 0.25rem; // Pequeño espacio antes del input
}

.form-input {
  font-family: $font-secondary;
  padding: 0.75rem 1rem;
  border: 1px solid $BAKANO-LIGHT;
  border-radius: 8px;
  font-size: 1rem;
  color: $BAKANO-DARK;
  background-color: $white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &::placeholder {
    color: $text-placeholder;
  }

  &:focus {
    outline: none;
    border-color: $BAKANO-PURPLE; // O $BAKANO-PINK
    box-shadow: 0 0 0 2px rgba($BAKANO-PURPLE, 0.2);
  }

  &.input-error {
    border-color: $BAKANO-PINK; // Color de borde para error

    &:focus {
      box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
    }
  }

  // Estilos para input type="number" para ocultar flechas si se desea
  &[type="number"] {

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none; // Chrome, Safari, Edge, Opera
      margin: 0;
    }
  }
}

.error-text {
  font-size: 0.8rem;
  color: $BAKANO-PINK;
  margin-top: 0.1rem;
}
</style>