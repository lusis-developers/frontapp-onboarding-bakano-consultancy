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
    <div class="submitted-icon">✅</div>
    <h2 class="main-feedback-text">
      {{ props.isPreSubmitted ? "¡Todo listo para el siguiente paso!" : "¡Hemos recibido tu información!" }}
    </h2>
    <p class="secondary-feedback-text">
      Has completado el primer paso con éxito. Ahora, avancemos para asegurar que tu configuración sea perfecta.
    </p>

    <div class="preparation-step">
      <div class="step-header">
        <span class="step-number">1</span>
        <h3 class="step-title">Revisa la Documentación Enviada</h3>
      </div>
      <p class="step-description">
        En los próximos minutos, **recibirás un email con la documentación y guías necesarias** para la configuración inicial de tu portafolio. Por favor, revísala con atención para preparar todo antes de tu sesión.
      </p>
    </div>

    <div class="booking-step">
      <div class="step-header">
        <span class="step-number">2</span>
        <h3 class="step-title">Agenda tu Sesión de Verificación</h3>
      </div>
      <p class="step-description">
        El siguiente paso es agendar una reunión con nuestra <strong>experta en marketing, Denisse Quimi</strong>, quien te ayudará a verificar que todo esté configurado exitosamente y resolverá tus dudas.
      </p>
      <a
        href="https://go.startfly.app/widget/booking/aeOr41CGE77DzCcjD96Z"
        target="_blank"
        rel="noopener noreferrer"
        class="action-button primary"
      >
        Agendar Reunión con Denisse
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *; // Asegúrate de que esta ruta sea correcta

// --- LOS ESTILOS SON LOS MISMOS QUE LA VERSIÓN ANTERIOR ---
// No es necesario cambiarlos, la estructura se mantiene.

$text-gray-600: #4A5568;
$text-gray-800: #1A202C;
$border-radius-lg: 0.5rem;
$border-color: #E2E8F0;

.submitted-message-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 1rem 0;
}

.submitted-icon {
  font-size: 3.5rem;
  line-height: 1;
}

.main-feedback-text {
  font-family: $font-principal;
  font-size: 1.5rem;
  font-weight: 700;
  color: $BAKANO-DARK;
}

.secondary-feedback-text {
  font-family: $font-secondary;
  color: $text-gray-600;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 1rem;
}

.preparation-step,
.booking-step {
  width: 100%;
  padding: 1.5rem;
  border: 1px solid $border-color;
  border-radius: $border-radius-lg;
  background-color: #fcfcfd;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.preparation-step {
  gap: 0.5rem;
}


.step-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.step-number {
  background-color: $BAKANO-PINK;
  color: $white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.step-title {
  font-family: $font-principal;
  font-size: 1.125rem;
  font-weight: 600;
  color: $text-gray-800;
}

.step-description {
  font-family: $font-secondary;
  color: $text-gray-600;
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 90%;
}

.action-button {
  display: inline-block;
  font-family: $font-principal;
  font-weight: 600;
  padding: 0.75rem 1.75rem;
  border-radius: $border-radius-lg;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  font-size: 1rem;
  border: 1px solid transparent;
  width: fit-content;
  margin-top: 0.5rem;

  &.primary {
    background-color: $BAKANO-PINK;
    color: $white;

    &:hover {
      background-color: darken($BAKANO-PINK, 7%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($BAKANO-PINK, 0.2);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
}
</style>