<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// --- Props y Emits (Sin cambios) ---
const props = defineProps<{
  modelValue: number | null;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

// --- Estado Interno y Formateadores (Sin cambios) ---
const displayValue = ref<string>('');
const isFocused = ref(false);

const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  maximumFractionDigits: 2,
});

// --- Lógica Principal de Input (Sin cambios) ---
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let rawValue = input.value;
  let numericString = rawValue.replace(/[^0-9.]/g, '');
  const parts = numericString.split('.');
  if (parts.length > 2) {
    numericString = parts[0] + '.' + parts.slice(1).join('');
  }
  displayValue.value = numericString;
  const numericValue = parseFloat(numericString);
  emit('update:modelValue', isNaN(numericValue) ? null : numericValue);
};
const onBlur = () => { /* ...sin cambios... */ };
const onFocus = () => { /* ...sin cambios... */ };
watch(() => props.modelValue, (newValue) => { /* ...sin cambios... */ });


// =======================================================
// ===== MEJORA DE LA GUÍA VISUAL INTELIGENTE =====
// =======================================================
const guidanceText = computed(() => {
  const value = props.modelValue;
  if (value === null || value < 1000) return '';

  // Usamos el API de Internacionalización con notación compacta.
  // Es la forma más robusta y profesional de abreviar números grandes.
  // 'es-EC' usa "mil" para miles y "M" para millones.
  const compactFormatter = new Intl.NumberFormat('es-EC', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1, // Ej: 1,5 M
    minimumFractionDigits: 0,  // Ej: 2 M (no 2,0 M)
  });

  // Reemplazamos las abreviaciones estándar por un texto más descriptivo.
  let formatted = compactFormatter.format(value);
  formatted = formatted.replace('mil', 'Mil').replace('M', 'Millones');

  return `${formatted} USD`;
});
// =======================================================

</script>

<template>
  <div class="form-field">
    <label class="form-label">{{ props.label }}<span v-if="props.required" class="required-star">*</span></label>
    <div class="input-wrapper">
      <span class="currency-symbol">$</span>
      <input
        :value="displayValue"
        @input="handleInput"
        @focus="onFocus"
        @blur="onBlur"
        type="text"
        inputmode="decimal"
        :placeholder="props.placeholder"
        class="form-input"
        :class="{ 'input-error': !!props.error }"
      />
    </div>
    <span v-if="guidanceText" class="guidance-text">{{ guidanceText }}</span>
    <span v-if="props.error" class="error-text">{{ props.error }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

// --- Contenedor Principal del Campo ---
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem; // Espacio reducido para un look más compacto
  width: 100%;
}

// --- Etiqueta (Label) ---
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

// --- Contenedor del Input ---
.input-wrapper {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-weight: 500;
  pointer-events: none; // Permite hacer clic a través del símbolo
}

.form-input {
  font-family: $font-secondary;
  // Padding izquierdo aumentado para que nunca se solape con el símbolo '$'
  padding: 0.85rem 1rem 0.85rem 2.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box; // Asegura que el padding no afecte el ancho total
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

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

// ==============================================================
// ===== NUEVO CONTENEDOR PARA TEXTOS DE AYUDA Y ERROR =====
// ==============================================================
// Este es el núcleo de la solución responsive.
.helper-wrapper {
  display: flex;
  justify-content: space-between; // Alinea los hijos a los extremos
  align-items: flex-start; // Alinea en la parte superior
  min-height: 1.2rem; // Altura mínima para evitar saltos de layout
  padding: 0 0.25rem;
}

.error-text {
  font-size: 0.8rem;
  color: $BAKANO-PINK;
  text-align: left;
  // Ocupa el espacio disponible, empujando la guía a la derecha
  flex-grow: 1;
}

.guidance-text {
  font-size: 0.8rem;
  font-family: $font-secondary;
  font-weight: 600;
  color: $BAKANO-PURPLE;
  text-align: right;
  white-space: nowrap; // CRÍTICO: Evita que la guía se parta en varias líneas
  flex-shrink: 0; // Evita que el texto se encoja
}

// ==============================================================</style>