<script setup lang="ts">
import { Field, ErrorMessage, useField } from 'vee-validate';
import { watch } from 'vue';

const { value: vendePorWhatsapp } = useField('vendePorWhatsapp');

const desafioOptions = [
  { value: "aumentar_clientes", label: "Aumentar el número de clientes" },
  { value: "aumentar_ingreso", label: "Aumentar el ingreso por Punto de venta" },
  { value: "apertura", label: "Aprender a hacer una apertura en punto de venta" },
  { value: "atencion_cliente", label: "Protocolos para atención al cliente estandarizada" },
  { value: "operaciones", label: "Protocolos de operaciones (administrativas, logística, inventario)" },
];

watch(vendePorWhatsapp, (val, oldVal) => {
  console.log('Checkbox "vendePorWhatsapp" cambió:', oldVal, '→', val);
});
</script>

<template>
  <div class="form-step">
    <div class="form-field">
      <label for="ingresoMensual" class="form-label">Ingreso mensual promedio*</label>
      <Field name="ingresoMensual" v-slot="{ field, meta }">
        <input
          v-bind="field"
          id="ingresoMensual"
          type="number"
          placeholder="$"
          class="form-input"
          :class="{ 'input-error': !meta.valid && meta.touched }"
        />
      </Field>
      <ErrorMessage name="ingresoMensual" class="error-text" />
    </div>

    <div class="form-field">
      <label for="ingresoAnual" class="form-label">Ingreso anual*</label>
      <Field name="ingresoAnual" v-slot="{ field, meta }">
        <input
          v-bind="field"
          id="ingresoAnual"
          type="number"
          placeholder="$"
          class="form-input"
          :class="{ 'input-error': !meta.valid && meta.touched }"
        />
      </Field>
      <ErrorMessage name="ingresoAnual" class="error-text" />
    </div>

    <div class="form-field form-field-checkbox">
      <Field
        name="vendePorWhatsapp"
        type="checkbox"
        :value="true"
        :unchecked-value="false"
        v-slot="{ field }"
      >
        <input
          v-bind="field"
          id="vendePorWhatsapp"
          type="checkbox"
          class="form-checkbox"
          :true-value="true"
          :false-value="false"
        />
      </Field>
      <label for="vendePorWhatsapp" class="form-label-checkbox">¿Vendes por WhatsApp?</label>
    </div>
    <ErrorMessage name="vendePorWhatsapp" class="error-text" />

    <div v-if="vendePorWhatsapp" class="form-field">
      <label for="gananciaWhatsapp" class="form-label">¿Cuánto ganas por WhatsApp? (mensual estimado)</label>
      <Field name="gananciaWhatsapp" v-slot="{ field, meta }">
        <input
          v-bind="field"
          id="gananciaWhatsapp"
          type="text"
          placeholder="$"
          class="form-input"
          :class="{ 'input-error': !meta.valid && meta.touched }"
        />
      </Field>
      <ErrorMessage name="gananciaWhatsapp" class="error-text" />
    </div>

    <div class="form-field">
      <label for="desafioPrincipal" class="form-label">Desafío principal*</label>
      <Field name="desafioPrincipal" v-slot="{ field, meta }">
        <select
          v-bind="field"
          id="desafioPrincipal"
          class="form-select"
          :class="{ 'input-error': !meta.valid && meta.touched }"
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
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' class='w-5 h-5'%3E%3Cpath fill-rule='evenodd' d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25em;
  padding-right: 2.5rem;
}

.form-field-checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 8px;
  border: 2px solid rgba($BAKANO-DARK, 0.3);
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
      left: 0.375rem;
      top: 0.125rem;
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
  margin-bottom: 0;
  cursor: pointer;
  font-weight: normal;
  color: $text-placeholder;
}

.error-text {
  font-size: 0.8rem;
  color: $BAKANO-PINK;
  margin-top: 0.1rem;
}
</style>