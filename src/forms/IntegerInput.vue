<script setup lang="ts">
import { computed } from 'vue';

// --- Props y Emits (Sin cambios) ---
const props = defineProps<{
  modelValue: number | null; // Acepta el valor a través de v-model
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

// --- Lógica del Input (Mejorada y Blindada) ---
const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (val === null || val === 0) {
      emit('update:modelValue', null);
      return;
    }

    const sanitizedValue = String(val).replace(/\D/g, '');

    if (sanitizedValue === '') {
      emit('update:modelValue', null);
      return;
    }
    const integerValue = parseInt(sanitizedValue, 10);
    emit('update:modelValue', integerValue);
  },
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (['.', 'e', '+', '-'].includes(event.key)) {
    event.preventDefault();
  }
};
</script>

<template>
  <div class="form-field">
    <label class="form-label">{{ props.label }}<span v-if="props.required" class="required-star">*</span></label>
    <div class="input-wrapper">
      <input
        v-model="value"
        type="text"
        inputmode="numeric"
        :placeholder="props.placeholder"
        @keydown="handleKeyDown"
        class="form-input"
        :class="{ 'input-error': !!props.error }"
      />
    </div>
    <span v-if="props.error" class="error-text">{{ props.error }}</span>
  </div>
</template>

<style lang="scss" scoped>
/* Los estilos son consistentes y no necesitan cambios. */
@use '@/styles/index.scss' as *;

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-family: $font-secondary;
  font-weight: 500;
  color: $BAKANO-DARK;
  font-size: 0.9rem;
  text-align: left;
}

.required-star {
  color: $BAKANO-PINK;
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
}

.form-input {
  font-family: $font-secondary;
  padding: 0.85rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: $BAKANO-PURPLE;
    box-shadow: 0 0 0 3px rgba($BAKANO-PURPLE, 0.15);
  }

  &.input-error {
    border-color: $BAKANO-PINK;

    &:focus {
      box-shadow: 0 0 0 3px rgba($BAKANO-PINK, 0.15);
    }
  }
}

.error-text {
  font-size: 0.8rem;
  color: $BAKANO-PINK;
  text-align: left;
  min-height: 1.2rem;
}
</style>