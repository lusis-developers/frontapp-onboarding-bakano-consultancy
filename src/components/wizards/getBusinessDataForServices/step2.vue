<script setup lang="ts">
import CurrencyInput from '@/forms/CurrencyInput.vue';
import { computed, defineProps, defineEmits } from 'vue';

// --- Props y Emits ---
// La estructura de comunicación con el padre (OnboardingFormWizard) se mantiene.
// Es robusta y está bien diseñada.
const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, string | undefined>;
}>();
const emit = defineEmits(['update:form-value']);

// --- Opciones para el Select ---
const desafioOptions = [
  { value: "aumentar_clientes", label: "Aumentar el número de clientes" },
  { value: "aumentar_ingreso", label: "Aumentar el ingreso por Punto de venta" },
  { value: "apertura", label: "Aprender a hacer una apertura en punto de venta" },
  { value: "atencion_cliente", label: "Protocolos para atención al cliente estandarizada" },
  { value: "operaciones", label: "Protocolos de operaciones (administrativas, logística, inventario)" },
];

// --- Modelo de Datos Reactivo ---
// Las propiedades computadas con get/set son la forma ideal de manejar el v-model
// con un estado que vive en el componente padre. No se necesita ningún cambio aquí.
const ingresoMensual = computed({
  get: () => props.values.ingresoMensual,
  set: (val) => emit('update:form-value', 'ingresoMensual', val),
});

const ingresoAnual = computed({
  get: () => props.values.ingresoAnual,
  set: (val) => emit('update:form-value', 'ingresoAnual', val),
});

const vendePorWhatsapp = computed<boolean>({
  get: () => !!props.values.vendePorWhatsapp,
  set: (val) => emit('update:form-value', 'vendePorWhatsapp', val),
});

const gananciaWhatsapp = computed({
  get: () => props.values.gananciaWhatsapp,
  set: (val) => emit('update:form-value', 'gananciaWhatsapp', val),
});

const desafioPrincipal = computed({
  get: () => props.values.desafioPrincipal,
  set: (val) => emit('update:form-value', 'desafioPrincipal', val),
});
</script>

<template>
  <div class="form-step">
    <CurrencyInput
      v-model="ingresoMensual"
      label="Ingreso mensual promedio (USD)"
      :error="props.errors.ingresoMensual"
      required
    />

    <CurrencyInput
      v-model="ingresoAnual"
      label="Ingreso anual (USD)"
      :error="props.errors.ingresoAnual"
      required
    />
    <div class="form-field form-field-checkbox">
      <input
        v-model="vendePorWhatsapp"
        id="vendePorWhatsapp"
        type="checkbox"
        class="form-checkbox"
      />
      <label for="vendePorWhatsapp" class="form-label-checkbox">¿Vendes por WhatsApp?</label>
    </div>
    <span v-if="props.errors.vendePorWhatsapp" class="error-text">{{ props.errors.vendePorWhatsapp }}</span>

    <CurrencyInput
      v-if="vendePorWhatsapp"
      v-model="gananciaWhatsapp"
      label="¿Cuánto ganas por WhatsApp? (mensual estimado en USD)"
      :error="props.errors.gananciaWhatsapp"
    />
    <div class="form-field">
      <label for="desafioPrincipal" class="form-label">Desafío principal*</label>
      <select
        v-model="desafioPrincipal"
        id="desafioPrincipal"
        class="form-select"
        :class="{ 'input-error': !!props.errors.desafioPrincipal }"
      >
        <option value="" disabled>Selecciona un desafío</option>
        <option v-for="option in desafioOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <span v-if="props.errors.desafioPrincipal" class="error-text">{{ props.errors.desafioPrincipal }}</span>
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
  text-align: left;
  margin-bottom: 0.25rem;
}

.form-input,
.form-select {
  font-family: $font-secondary;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: $BAKANO-DARK;
  background-color: $white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &::placeholder {
    color: #9ca3af;
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
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25em;
  padding-right: 2.5rem;
}

.form-field-checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 4px;
  border: 2px solid #cbd5e1;
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
  font-weight: 500;
  color: $BAKANO-DARK;
}

.error-text {
  font-size: 0.8rem;
  color: $BAKANO-PINK;
  margin-top: 0.1rem;
  text-align: left;
}
</style>