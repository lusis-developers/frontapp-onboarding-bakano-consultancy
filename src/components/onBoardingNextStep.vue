<script setup lang="ts">
import { clientService } from '@/services/clientService.service';
import type { IMeetingStatusResponse } from '@/types/responses/IMeetingStatusResponse';
import { ref, onMounted } from 'vue';
import SubmittedMessage from './wizards/getBusinessData/submittedMessage.vue';
import MeetingDetails from './modal/meetingDetails.vue';

const props = defineProps<{
  clientId: string;
}>();

const isLoading = ref(true);
const error = ref<string | null>(null);
const meetingStatus = ref<IMeetingStatusResponse | null>(null);

onMounted(async () => {
  if (!props.clientId) {
    error.value = "No se proporcionó un ID de cliente.";
    isLoading.value = false;
    return;
  }

  try {
    // La variable 'response' aquí ya es el objeto { hasScheduledMeeting: ... }
    const response = await clientService.getClientMeetingStatus(props.clientId);

    // --- ESTA ES LA LÍNEA CORREGIDA ---
    // Asignamos la respuesta directamente, sin .data
    meetingStatus.value = response.data;

  } catch (e: any) {
    console.error("Error al verificar el estado de la reunión:", e);
    error.value = "No pudimos cargar el estado de tu reunión. Inténtalo de nuevo más tarde.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="onboarding-container">
    <div v-if="isLoading" class="state-container">
      <p>Verificando estado de tu agenda...</p>
      </div>

    <div v-else-if="error" class="state-container error-message">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="meetingStatus">
      <MeetingDetails
        v-if="meetingStatus.hasScheduledMeeting && meetingStatus.meeting"
        :meeting="meetingStatus.meeting"
      />
      <SubmittedMessage v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Tus estilos no necesitan cambios */
.onboarding-container {
  width: 100%;
}

.state-container {
  text-align: center;
  padding: 3rem 1rem;
  font-family: sans-serif;
  color: #666;
}

.error-message {
  color: #e53e3e;
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
}
</style>