<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type { IMeetingDetails } from '@/types/responses/IMeetingStatusResponse';
import { MeetingStatus, MeetingType } from '@/anums/meetingStatus.enum';
// Importamos los enums para usarlos en nuestra lógica

const props = defineProps<{
  meeting: IMeetingDetails;
}>();

// Las computeds para title, subtitle y expertTitle ya son correctas.
const title = computed(() => {
  if (props.meeting.meetingType === MeetingType.DATA_STRATEGY) {
    return '¡Siguiente Paso: Sesión de Estrategia!';
  }
  return '¡Tu reunión de verificación está agendada!';
});

const subtitle = computed(() => {
  if (props.meeting.meetingType === MeetingType.DATA_STRATEGY) {
    // El subtítulo también cambia si la reunión ya fue agendada
    if (props.meeting.status === MeetingStatus.SCHEDULED) {
      return 'Tu sesión de estrategia con nuestro experto en análisis de datos está confirmada.';
    }
    return 'El acceso a tu portafolio ha sido verificado. Ahora puedes agendar tu sesión con nuestro experto.';
  }
  return 'Esta primera sesión es para asegurar que toda la configuración inicial sea un éxito.';
});

const expertTitle = computed(() => {
  if (props.meeting.meetingType === MeetingType.DATA_STRATEGY) {
    return 'Experto en Análisis de Datos:';
  }
  return 'Experta en Marketing:';
});


// --- ESTA ES LA PROPIEDAD COMPUTADA CON LA LÓGICA FINAL ---
const ctaButton = computed(() => {
  // Caso 1: Es la reunión de estrategia con Luis
  if (props.meeting.meetingType === MeetingType.DATA_STRATEGY) {
    // Si todavía está pendiente de agendar, mostramos el link al calendario
    if (props.meeting.status === MeetingStatus.PENDING_SCHEDULE) {
      return {
        text: 'Agendar Reunión de Estrategia',
        link: 'https://go.startfly.app/widget/booking/BIMx4yqxxREaV54bUObN'
      };
    }
    // Si ya fue agendada, mostramos el link de Google Meet para unirse
    return {
      text: 'Unirse a la Reunión de Estrategia',
      link: props.meeting.meetingLink || '#'
    };
  }

  // Caso 2 (por defecto): Es la reunión de portafolio con Denisse
  return {
    text: 'Unirse a la Reunión con Google Meet',
    link: props.meeting.meetingLink || '#'
  };
});

// Funciones de formato de fecha/hora (sin cambios)
const formattedDate = computed(() => {
  if (!props.meeting?.scheduledTime) return 'Pendiente de agendar';
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(new Date(props.meeting.scheduledTime));
});

const formattedTime = computed(() => {
  if (!props.meeting?.scheduledTime) return '';
  return new Intl.DateTimeFormat('es-ES', { timeStyle: 'short', hour12: true, timeZone: 'America/Guayaquil' }).format(new Date(props.meeting.scheduledTime));
});
</script>

<template>
  <div class="meeting-details-card">
    <div class="submitted-icon">
      {{ meeting.meetingType === 'data-strategy' ? '🚀' : '🗓️' }}
    </div>
    
    <h2 class="main-feedback-text">{{ title }}</h2>
    <p class="secondary-feedback-text">{{ subtitle }}</p>

    <div class="details-box" v-if="meeting.status === MeetingStatus.SCHEDULED">
      <p><strong>{{ expertTitle }}</strong> {{ meeting.assignedTo }}</p>
      <p><strong>Fecha:</strong> <span class="highlight">{{ formattedDate }}</span></p>
      <p><strong>Hora:</strong> <span class="highlight">{{ formattedTime }} (Hora de Ecuador)</span></p>
    </div>
    
    <div class="details-box" v-else-if="meeting.status === MeetingStatus.PENDING_SCHEDULE">
        <p><strong>{{ expertTitle }}</strong> {{ meeting.assignedTo }}</p>
        <p><strong>Estado:</strong> <span class="highlight">Listo para agendar</span></p>
    </div>

    <a
      :href="ctaButton.link"
      target="_blank"
      rel="noopener noreferrer"
      class="action-button primary"
    >
      {{ ctaButton.text }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
/* Tu bloque de <style> completo va aquí. No necesita cambios. */
@use '@/styles/index.scss' as *;

.meeting-details-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  padding: 1rem 0;
  width: 100%;
}

.details-box {
  background-color: #fcfcfd;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  width: 100%;
  max-width: 480px;
  text-align: left;
  line-height: 1.8;

  p {
    margin: 0.5rem 0;
    font-size: 0.95rem;
  }

  .highlight {
    color: $BAKANO-PINK;
    font-weight: 600;
  }
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
  color: #4A5568;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 0;
}

.action-button {
  margin-top: 0.5rem;
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
      box-shadow: 0 4px 12px rgba($BAKANO-PINK, .2);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
}
</style>