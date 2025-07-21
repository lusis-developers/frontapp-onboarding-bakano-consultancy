// Este componente podría llamarse "DataStrategyNextStep.vue"
<script setup lang="ts">
import { computed } from 'vue';
import ActionCard from '@/components/shared/ActionCard.vue';
import { DATA_STRATEGY_MEETING_URL } from '@/constants/links.contant';
import type { IMeetingDetails } from '@/types/responses/IMeetingStatusResponse';
import { MeetingStatus } from '@/anums/meetingStatus.enum';

const props = defineProps<{ meeting: IMeetingDetails }>();

// 1. La lógica ahora genera OBJETOS de configuración para las props de ActionCard.
const cardConfig = computed(() => {
  const isScheduled = props.meeting.status === MeetingStatus.SCHEDULED;

  const details = {
    expertTitle: 'Experto en Análisis de Datos:',
    assignedTo: props.meeting.assignedTo,
    date: isScheduled ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(new Date(props.meeting.scheduledTime!)) : undefined,
    time: isScheduled ? new Intl.DateTimeFormat('es-ES', { timeStyle: 'short', hour12: true, timeZone: 'America/Guayaquil' }).format(new Date(props.meeting.scheduledTime!)) : undefined,
    status: isScheduled ? undefined : 'Listo para agendar',
  };

  const primaryAction = isScheduled
    ? { text: 'Unirse a la Reunión de Estrategia', link: props.meeting.meetingLink || '#' }
    : { text: 'Agendar Reunión de Estrategia', link: DATA_STRATEGY_MEETING_URL };

  return {
    icon: '🚀',
    title: '¡Siguiente Paso: Sesión de Estrategia!',
    subtitle: isScheduled
      ? 'Tu sesión de estrategia con nuestro experto en análisis de datos está confirmada.'
      : 'El acceso a tu portafolio ha sido verificado. Ahora puedes agendar tu sesión con nuestro experto.',
    details,
    primaryAction
  };
});
</script>

<template>
  <ActionCard v-bind="cardConfig" />
</template>