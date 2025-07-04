<script setup lang="ts">
import { defineProps } from 'vue';
import { DOCUMENTATION_URL } from '@/constants/links.contant';

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
        En los próximos minutos, **recibirás un email con la documentación y guías necesarias**. Para no esperar, puedes acceder directamente y preparar todo antes de tu sesión.
      </p>
      <a
        :href="DOCUMENTATION_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="action-button secondary"
      >
        Ver Documentación de Preparación
      </a>
      </div>

    <div class="booking-step">
      <div class="step-header">
        <span class="step-number">2</span>
        <h3 class="step-title">Agenda tu Sesión de Verificación</h3>
      </div>
      <p class="step-description">
        El siguiente paso es agendar una reunión con nuestra <strong>experta en marketing, Denisse Quimi</strong>, quien te ayudará a verificar que todo esté configurado exitosamente y resolverá tus dudas.
      </p>
      <div class="booking-warning">
        <span class="warning-icon">⚠️</span>
        <p class="warning-text">
          <strong>Importante:</strong> La persona encargada del portafolio comercial debe estar presente en la reunión.
        </p>
      </div>
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
@use '@/styles/index.scss' as *;

$text-gray-600: #4A5568;
$text-gray-800: #1A202C;
$border-radius-lg: 0.5rem;
$border-color: #E2E8F0;
$warning-bg-light: #FFFBEB; // Un amarillo pálido
$warning-border-color: #FBBF24; // Un color ámbar
$warning-text-color: #92400E; // Un marrón oscuro para el texto

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

// --- ESTILO AÑADIDO: Estilos para el contenedor de la advertencia ---
.booking-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  max-width: 90%;
  padding: 1rem;
  border-radius: $border-radius-lg;
  border: 1px solid $warning-border-color;
  background-color: $warning-bg-light;
  margin-top: 0.5rem; // Espacio antes del botón

  .warning-icon {
    font-size: 1.25rem;
    line-height: 1.6; // Alinear con el texto
  }

  .warning-text {
    font-family: $font-secondary;
    color: $warning-text-color;
    font-size: 0.875rem;
    line-height: 1.6;
    text-align: left;
    margin: 0;

    strong {
      font-weight: 600;
    }
  }
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

  &.secondary {
    background-color: transparent;
    color: $BAKANO-PINK;
    border-color: $BAKANO-PINK;

    &:hover {
      background-color: rgba($BAKANO-PINK, 0.05);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($BAKANO-PINK, 0.1);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
}
</style>