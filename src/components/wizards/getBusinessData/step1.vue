<script setup lang="ts">
import IntegerInput from '@/forms/IntegerInput.vue';
import { computed, defineProps, defineEmits } from 'vue';


// --- Props y Emits ---
// La lógica existente es correcta y no necesita cambios. El padre (OnboardingFormWizard)
// nos sigue pasando los valores y los errores.
const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, string | undefined>;
}>();
const emit = defineEmits(['update:form-value']);

// --- Modelo de Datos Reactivo ---
// Las propiedades computadas con get/set son la forma ideal de conectar el estado
// del padre con los componentes hijos. ¡Excelente implementación!
const instagram = computed({
  get: () => props.values.instagram,
  set: (val) => emit('update:form-value', 'instagram', val),
});

const tiktok = computed({
  get: () => props.values.tiktok,
  set: (val) => emit('update:form-value', 'tiktok', val),
});

const empleados = computed({
  get: () => props.values.empleados,
  set: (val) => emit('update:form-value', 'empleados', val),
});
</script>

<template>
  <div class="form-step">
    <div class="form-field">
      <label for="instagram" class="form-label">Cuenta de Instagram*</label>
      <input
        v-model="instagram"
        id="instagram"
        type="text"
        placeholder="@turestaurante"
        class="form-input"
        :class="{ 'input-error': !!props.errors.instagram }"
      />
      <span v-if="props.errors.instagram" class="error-text">{{ props.errors.instagram }}</span>
    </div>

    <div class="form-field">
      <label for="tiktok" class="form-label">Cuenta de TikTok</label>
      <input
        v-model="tiktok"
        id="tiktok"
        type="text"
        placeholder="@turestaurante"
        class="form-input"
        :class="{ 'input-error': !!props.errors.tiktok }"
      />
      <span v-if="props.errors.tiktok" class="error-text">{{ props.errors.tiktok }}</span>
    </div>

    <IntegerInput
      v-model="empleados"
      label="Número de empleados"
      placeholder="Ej: 5"
      :error="props.errors.empleados"
      required
    />
    </div>
</template>

<style lang="scss" scoped>
/* Los estilos no necesitan cambios, ya que los nuevos componentes
   utilizan las mismas clases y variables para mantener la consistencia visual. */
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

.form-input {
  font-family: $font-secondary;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  /* Cambiado de $BAKANO-LIGHT para mayor consistencia */
  border-radius: 8px;
  font-size: 1rem;
  color: $BAKANO-DARK;
  background-color: $white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &::placeholder {
    color: #9ca3af;
    /* Cambiado de $text-placeholder */
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

  &[type="number"] {
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
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