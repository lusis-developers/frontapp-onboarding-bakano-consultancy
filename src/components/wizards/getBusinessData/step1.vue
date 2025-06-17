<script setup lang="ts">
// Paso 2.1: Cambiamos los imports. Ya no necesitamos Field/ErrorMessage.
import { computed, defineProps, defineEmits } from 'vue';

// Paso 2.2: Definimos las props que el padre ahora nos envía.
const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, string | undefined>;
}>();

// Paso 2.3: Definimos el evento que enviaremos al padre para actualizar datos.
const emit = defineEmits(['update:form-value']);

// Paso 2.4: Creamos "intermediarios" reactivos para cada campo.
// Esto es el corazón de la solución.
const instagram = computed({
  // GET: Siempre lee el valor MÁS RECIENTE desde las props del padre.
  get: () => props.values.instagram,
  // SET: Cuando el usuario escribe, emite un evento al padre para que actualice el estado.
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

    <div class="form-field">
      <label for="empleados" class="form-label">Número de empleados*</label>
      <input
        v-model="empleados"
        id="empleados"
        type="number"
        placeholder="Ej: 5"
        class="form-input"
        :class="{ 'input-error': !!props.errors.empleados }"
      />
      <span v-if="props.errors.empleados" class="error-text">{{ props.errors.empleados }}</span>
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