<script setup lang="ts">
import { ref, nextTick } from 'vue';

defineProps<{
  text: string;
}>();

// Refs para acceder a los elementos del DOM
const containerRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);

// Ref para controlar los estilos del tooltip dinámicamente
const tooltipStyle = ref({
  opacity: 0,
  top: '0px',
  left: '0px',
  transform: 'translateX(-50%)', // Mantenemos el centrado horizontal
});

const showTooltip = async () => {
  if (!containerRef.value || !tooltipRef.value) return;

  // Hacemos el tooltip invisible pero presente para medirlo
  tooltipStyle.value.opacity = 0;
  await nextTick(); // Esperamos a que Vue actualice el DOM

  const iconRect = containerRef.value.getBoundingClientRect();
  const tooltipHeight = tooltipRef.value.offsetHeight;

  // Calculamos la posición
  const top = iconRect.top - tooltipHeight - 10; // 10px de margen superior
  const left = iconRect.left + (iconRect.width / 2);

  // Aplicamos la posición y lo hacemos visible
  tooltipStyle.value = {
    ...tooltipStyle.value,
    opacity: 1,
    top: `${top}px`,
    left: `${left}px`,
  };
};

const hideTooltip = () => {
  tooltipStyle.value.opacity = 0;
};
</script>

<template>
  <div
    class="tooltip-container"
    ref="containerRef"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <i class="tooltip-icon fa-solid fa-circle-info"></i>
    <span class="tooltip-text" ref="tooltipRef" :style="tooltipStyle">
      {{ text }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.tooltip-container {
  // Ya no necesita z-index, es solo el disparador.
  display: inline-flex;
  cursor: help;
}

.tooltip-icon {
  font-size: 1.1rem;
  color: $text-placeholder;
}

.tooltip-text {
  // --- CAMBIOS DE POSICIONAMIENTO ---

  // 1. Posición FIJA a la ventana del navegador. Ignora el 'overflow: hidden' del padre.
  position: fixed;

  // 2. La opacidad y posición ahora se controlan desde el script.
  opacity: 0;

  // 3. Transición suave para la aparición/desaparición.
  transition: opacity 0.2s ease-in-out;

  // --- Estilos visuales (sin cambios) ---
  background-color: $BAKANO-DARK;
  color: $white;
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  z-index: 9999;
  white-space: normal;
  max-width: 280px;
  text-align: left;
  line-height: 1.4;

  // La flecha sigue funcionando igual, pero ahora se posiciona relativa al tooltip.
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%); // Centra la flecha bajo el tooltip
    border-width: 5px;
    border-style: solid;
    border-color: $BAKANO-DARK transparent transparent transparent;
  }
}
</style>