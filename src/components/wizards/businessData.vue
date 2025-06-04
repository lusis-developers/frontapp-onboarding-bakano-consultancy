<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  isPreSubmitted?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isPreSubmitted: false,
});
</script>

<template>
  <div class="submitted-message-content">
    <div class="submitted-icon">🎉</div>
    <p class="main-feedback-text">
      {{ props.isPreSubmitted ? "Ya tenemos toda tu información registrada." : "¡Hemos recibido tus datos correctamente!" }}
    </p>
    <p class="secondary-feedback-text">
      {{ props.isPreSubmitted ? "Ahora puedes agendar tu reunión de consultoría." : "Nuestro equipo revisará la información y es momento de agendar tu reunión." }}
    </p>
    <div class="booking-action-area">
      <p class="booking-prompt-text">
        Para agendar tu reunión de consultoría, haz clic en el siguiente enlace:
      </p>
      <a
        href="https://go.startfly.app/widget/booking/weNnVgCDhQ37y5r7TTE6"
        target="_blank"
        rel="noopener noreferrer"
        class="booking-link-button"
      >
        Agendar Reunión
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *; // Tus variables globales SCSS

// Variables locales (si no están definidas globalmente o necesitas overrides)
$text-gray-600: #718096; // Ejemplo, usa tu variable global si existe
$border-radius-md: 0.375rem; // Ejemplo, usa tu variable global si existe

.submitted-message-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem; // Espacio entre elementos
  padding: 2rem 1rem; // Espaciado interno general
}

.submitted-icon {
  font-size: 3.5rem; // text-6xl es usualmente 3.75rem, ajusta si es necesario
  margin-bottom: 0.5rem; // Un poco menos de espacio que mb-4
}

.main-feedback-text {
  font-family: $font-principal; // O la fuente que uses para títulos/destacados
  font-size: 1.25rem; // text-lg
  font-weight: 600; // Un poco más de énfasis
  color: $BAKANO-DARK;
  margin-bottom: 0.25rem; // Espacio ajustado
}

.secondary-feedback-text {
  font-family: $font-secondary;
  color: $text-gray-600; // Usando la variable definida localmente o global
  font-size: 1rem;
  line-height: 1.6;
  max-width: 480px; // Para que no sea demasiado ancho en pantallas grandes
  margin-bottom: 1rem; // Espacio antes del área de agendamiento
}

.booking-action-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem; // Espacio entre el texto y el botón
  margin-top: 1rem; // Espacio adicional arriba
}

.booking-prompt-text {
  font-family: $font-secondary;
  color: $BAKANO-DARK;
  font-weight: 500; // font-medium
  font-size: 0.95rem;
}

.booking-link-button {
  display: inline-block;
  background-color: $BAKANO-PINK;
  color: $white;
  font-family: $font-principal;
  font-weight: 500; // font-medium
  padding: 0.75rem 1.5rem; // px-6 py-3
  border-radius: $border-radius-md; // rounded-md
  text-decoration: none;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease;
  font-size: 1rem;

  &:hover {
    background-color: darken($BAKANO-PINK, 7%); // Simula hover:bg-bakano-pink/90
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>