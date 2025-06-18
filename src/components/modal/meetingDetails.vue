<script setup lang="ts">
import type { IMeetingDetails } from '@/types/responses/IMeetingStatusResponse';
import { computed, defineProps } from 'vue';

const props = defineProps<{
  meeting: IMeetingDetails;
}>();

const formattedDate = computed(() => {
  if (!props.meeting?.scheduledTime) return '';
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
  }).format(new Date(props.meeting.scheduledTime));
});

const formattedTime = computed(() => {
  if (!props.meeting?.scheduledTime) return '';
  // Usamos la hora actual de Ecuador como referencia
  const currentTime = new Date();
  const timeZone = 'America/Guayaquil';

  return new Intl.DateTimeFormat('es-ES', {
    timeStyle: 'short',
    hour12: true,
    timeZone: timeZone,
  }).format(new Date(props.meeting.scheduledTime));
});
</script>

<template>
  <div class="meeting-details-card">
    <div class="submitted-icon">🗓️</div>
    <h2 class="main-feedback-text">¡Tu reunión de verificación está agendada!</h2>
    <p class="secondary-feedback-text">
      Esta primera sesión es para asegurar que toda la configuración inicial sea un éxito.
    </p>

    <div class="details-box">
      <p><strong>Experta en Marketing:</strong> {{ meeting.assignedTo }}</p>
      <p><strong>Fecha:</strong> <span class="highlight">{{ formattedDate }}</span></p>
      <p><strong>Hora:</strong> <span class="highlight">{{ formattedTime }} (Hora de Ecuador)</span></p>
    </div>

    <div class="next-step-info">
      <p>
        <strong>Próximo Paso:</strong> Una vez finalizada esta sesión con <strong>Denisse</strong> y que nuestro equipo confirme los accesos a tu portafolio, se habilitará la agenda para tu reunión principal con nuestro <strong>Experto en Estrategia</strong>.
      </p>
    </div>

    <a
      :href="meeting.meetingLink"
      target="_blank"
      rel="noopener noreferrer"
      class="action-button primary"
    >
      Unirse a la Reunión con Google Meet
    </a>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.meeting-details-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem; // Espacio reducido ligeramente
  padding: 1rem 0;
  width: 100%;
}

.details-box {
  background-color: #fcfcfd;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  padding: 8px;
  width: 90%;
  max-width: 480px; // Un poco más ancho
  text-align: left;
  line-height: 1.8;

  p {
    margin: 0.5rem 0;
  }

  .highlight {
    color: $BAKANO-PINK;
    font-weight: 600;
  }
}

// --- ESTILOS PARA LA NUEVA SECCIÓN ---
.next-step-info {
  max-width: 480px;
  padding: 1rem;
  background-color: $overlay-purple; // Usamos tu variable de overlay
  border-left: 4px solid $BAKANO-PURPLE;
  border-radius: 4px;
  margin-top: 1rem;

  p {
    margin: 0;
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: darken($BAKANO-PURPLE, 15%);
    line-height: 1.6;
    text-align: left;
  }
}


// --- ESTILOS EXISTENTES ---
.submitted-icon {
  font-size: 3.5rem;
  line-height: 1
}

.main-feedback-text {
  font-family: $font-principal;
  font-size: 1.5rem;
  font-weight: 700;
  color: $BAKANO-DARK
}

.secondary-feedback-text {
  font-family: $font-secondary;
  color: #4A5568;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 0
}

.action-button {
  margin-top: 0.5rem; // Margen reducido
  display: inline-block;
  font-family: $font-principal;
  font-weight: 600;
  padding: .75rem 1.75rem;
  border-radius: .5rem;
  text-decoration: none;
  transition: all .2s ease-in-out;
  font-size: 1rem;
  border: 1px solid transparent;
  width: fit-content;

  &.primary {
    background-color: $BAKANO-PINK;
    color: $white;

    &:hover {
      background-color: darken($BAKANO-PINK, 7%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($BAKANO-PINK, .2)
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: none
  }
}
</style>