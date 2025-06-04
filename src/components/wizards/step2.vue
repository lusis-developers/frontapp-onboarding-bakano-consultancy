// src/components/wizard/businessdata/Step2_FinancialDetails.vue
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';

interface Props {
  formValues: {
    ingresoMensual?: string;
    ingresoAnual?: string;
    vendePorWhatsapp?: boolean;
    gananciaWhatsapp?: string;
    desafioPrincipal?: string;
  };
  errors: Record<string, string | undefined>;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:form-value']);

const handleInput = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:form-value', fieldName, target.value);
};

const handleCheckboxChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:form-value', fieldName, target.checked);
};

const handleSelectChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:form-value', fieldName, target.value);
};

const desafioOptions = [
  { value: "aumentar_clientes", label: "Aumentar el número de clientes" },
  { value: "aumentar_ingreso", label: "Aumentar el ingreso por Punto de venta" },
  { value: "apertura", label: "Aprender a hacer una apertura en punto de venta" },
  { value: "atencion_cliente", label: "Protocolos para atención al cliente estandarizada" },
  { value: "operaciones", label: "Protocolos de operaciones (administrativas, logística, inventario)" },
];
</script>

<template>
  <div class="form-step">
    <div class="form-field">
      <label for="ingresoMensual" class="form-label">Ingreso mensual promedio*</label>
      <Field name="ingresoMensual" v-slot="{ field, meta }">
        <input
          id="ingresoMensual"
          type="number"
          placeholder="$"
          :value="props.formValues.ingresoMensual"
          @input="event => handleInput('ingresoMensual', event)"
          class="form-input"
          :class="{ 'input-error': !meta.valid && meta.touched && errors.ingresoMensual }"
        />
      </Field>
      <ErrorMessage name="ingresoMensual" class="error-text" />
    </div>

    <div class="form-field">
      <label for="ingresoAnual" class="form-label">Ingreso anual*</label>
      <Field name="ingresoAnual" v-slot="{ field, meta }">
        <input
          id="ingresoAnual"
          type="number"
          placeholder="$"
          :value="props.formValues.ingresoAnual"
          @input="event => handleInput('ingresoAnual', event)"
          class="form-input"
          :class="{ 'input-error': !meta.valid && meta.touched && errors.ingresoAnual }"
        />
      </Field>
      <ErrorMessage name="ingresoAnual" class="error-text" />
    </div>

    <div class="form-field form-field-checkbox">
      <Field name="vendePorWhatsapp" type="checkbox" v-slot="{ field }">
        <input
          type="checkbox"
          id="vendePorWhatsapp"
          :checked="props.formValues.vendePorWhatsapp"
          @change="event => handleCheckboxChange('vendePorWhatsapp', event)"
          class="form-checkbox"
        />
      </Field>
      <label for="vendePorWhatsapp" class="form-label-checkbox">¿Vendes por WhatsApp?</label>
    </div>
    <ErrorMessage name="vendePorWhatsapp" class="error-text" />

    <div v-if="props.formValues.vendePorWhatsapp" class="form-field">
      <label for="gananciaWhatsapp" class="form-label">¿Cuánto ganas por WhatsApp? (mensual estimado)</label>
      <Field name="gananciaWhatsapp" v-slot="{ field, meta }">
        <input
          id="gananciaWhatsapp"
          type="text"
          placeholder="$"
          :value="props.formValues.gananciaWhatsapp"
          @input="event => handleInput('gananciaWhatsapp', event)"
          class="form-input"
          :class="{ 'input-error': !meta.valid && meta.touched && errors.gananciaWhatsapp }"
        />
      </Field>
      <ErrorMessage name="gananciaWhatsapp" class="error-text" />
    </div>

    <div class="form-field">
      <label for="desafioPrincipal" class="form-label">Desafío principal*</label>
      <Field name="desafioPrincipal" v-slot="{ field, meta }">
        <select
          id="desafioPrincipal"
          :value="props.formValues.desafioPrincipal"
          @change="event => handleSelectChange('desafioPrincipal', event)"
          class="form-select"
          :class="{ 'input-error': !meta.valid && meta.touched && errors.desafioPrincipal }"
        >
          <option value="" disabled>Selecciona un desafío</option>
          <option v-for="option in desafioOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </Field>
      <ErrorMessage name="desafioPrincipal" class="error-text" />
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

.form-label {
  font-family: $font-secondary;
  font-weight: 500;
  color: $BAKANO-DARK;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.form-input,
.form-select {
  font-family: $font-secondary;
  padding: 0.75rem 1rem;
  border: 1px solid $gray-300; // Define $gray-300: #D1D5DB;
  border-radius: $border-radius-md; // Define $border-radius-md: 0.375rem;
  font-size: 1rem;
  color: $BAKANO-DARK;
  background-color: $white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &::placeholder {
    color: $gray-400; // Define $gray-400: #9CA3AF;
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

.form-select {
  appearance: none; // Para poder estilizar la flecha si se desea
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' class='w-5 h-5'%3E%3Cpath fill-rule='evenodd' d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25em; // Ajusta el tamaño de la flecha
  padding-right: 2.5rem; // Espacio para la flecha
}

.form-field-checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem; // Espacio entre checkbox y label
}

.form-checkbox {
  width: 1.25rem; // w-5
  height: 1.25rem; // h-5
  border-radius: $border-radius-sm; // Define $border-radius-sm: 0.25rem;
  border: 1px solid $gray-300;
  cursor: pointer;
  appearance: none;
  position: relative;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &:checked {
    background-color: $BAKANO-PINK;
    border-color: $BAKANO-PINK;

    &::after {
      // Estilo para el checkmark
      content: '';
      position: absolute;
      left: 0.375rem; // Ajusta para centrar
      top: 0.125rem; // Ajusta para centrar
      width: 0.3rem;
      height: 0.6rem;
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
  margin-bottom: 0; // Anular el margen del label normal
  cursor: pointer;
  font-weight: normal; // El label de checkbox no suele ser bold
  color: $text-gray-700; // Define $text-gray-700: #374151;
}

.error-text {
  font-size: 0.8rem;
  color: $BAKANO-PINK;
  margin-top: 0.1rem; // Pequeño espacio después del campo si hay error
}
</style>