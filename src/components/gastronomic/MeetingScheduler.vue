<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

// --- Dependencias ---
import { clientService } from '@/services/clientService.service';
import { MeetingStatus, MeetingType } from '@/anums/meetingStatus.enum';
import {
  MARKETING_MEETING_URL,
  DATA_STRATEGY_MEETING_URL,
  CALENDLY_LINK
} from '@/constants/links.contant';
import type { IMeetingStatusResponse, IMeetingDetails } from '@/types/responses/IMeetingStatusResponse';

// --- Props ---
const props = defineProps<{
  clientId: string;
}>();

// --- Estado Reactivo Interno ---
const isLoading = ref(true);
const apiResponse = ref<IMeetingStatusResponse | null>(null);
const error = ref<string | null>(null);

// --- Lógica de Obtención de Datos ---
onMounted(async () => {
  if (!props.clientId) {
    error.value = "Error: No se pudo identificar al cliente.";
    isLoading.value = false;
    return;
  }
  try {
    const response = await clientService.getClientMeetingStatus(props.clientId);
    apiResponse.value = response.data;
  } catch (err) {
    console.error("Error fetching meeting status:", err);
    error.value = "No se pudo cargar el estado de tus reuniones.";
  } finally {
    isLoading.value = false;
  }
});

// --- Lógica de Negocio y Formato ---

// Helper para traducir estados a texto legible y profesional.
const statusToTextMap: Record<string, string> = {
  [MeetingStatus.PENDING_SCHEDULE]: 'Pendiente de Agendar',
  [MeetingStatus.SCHEDULED]: 'Agendada',
  [MeetingStatus.COMPLETED]: 'Completada',
  [MeetingStatus.CANCELLED]: 'Cancelada',
  [MeetingStatus.NO_SHOW]: 'No Asistió',
};

// Helpers para formatear fecha y hora para la zona horaria de Ecuador.
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'full' }).format(new Date(dateString));
};
const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('es-EC', { timeStyle: 'short', hour12: true, timeZone: 'America/Guayaquil' }).format(new Date(dateString));
};

// Computeds que derivan el estado de cada reunión a partir de la respuesta de la API.
const marketingMeeting = computed(() => {
  let meetingDetails: Partial<IMeetingDetails> = { status: MeetingStatus.PENDING_SCHEDULE };
  if (apiResponse.value?.meeting?.meetingType === MeetingType.PORTFOLIO_ACCESS) {
    meetingDetails = apiResponse.value.meeting;
  } else if (apiResponse.value?.meeting?.meetingType === MeetingType.DATA_STRATEGY) {
    meetingDetails.status = MeetingStatus.COMPLETED;
  }
  return {
    ...meetingDetails,
    statusText: statusToTextMap[meetingDetails.status!] || meetingDetails.status,
  };
});

const dataStrategyMeeting = computed(() => {
  let meetingDetails: Partial<IMeetingDetails> = { status: MeetingStatus.PENDING_SCHEDULE };
  if (apiResponse.value?.meeting?.meetingType === MeetingType.DATA_STRATEGY) {
    meetingDetails = apiResponse.value.meeting;
  }
  return {
    ...meetingDetails,
    statusText: statusToTextMap[meetingDetails.status!] || meetingDetails.status,
  };
});

const isDataStrategyMeetingUnlocked = computed(() => {
  return marketingMeeting.value.status === MeetingStatus.COMPLETED;
});

const handleLockedClick = (event: MouseEvent) => {
  if (!isDataStrategyMeetingUnlocked.value) {
    event.preventDefault();
  }
};
</script>

<template>
  <section class="scheduler-section">
    <div class="scheduler-container">
      <div class="scheduler-header">
        <h2 class="scheduler-title">Tu Ruta hacia el Éxito</h2>
        <p class="scheduler-subtitle">Sigue estos pasos para agendar tus sesiones de consultoría.</p>
      </div>

      <div v-if="isLoading" class="feedback-container">
        <div class="spinner"></div>
        <p>Cargando estado de reuniones...</p>
      </div>
      <div v-else-if="error" class="feedback-container error">
        <p>{{ error }}</p>
      </div>

      <template v-else-if="apiResponse">
        <div class="steps-wrapper">
          <div class="step-card">
            <div class="step-header">
              <span class="step-number">1</span>
              <h3 class="step-title">Sesión con Especialista en Marketing</h3>
            </div>
            <p class="step-description">Comienza con una reunión de diagnóstico para alinear la estrategia de marketing y comunicación de tu negocio.</p>

            <template v-if="marketingMeeting.status === MeetingStatus.PENDING_SCHEDULE">
              <div class="status-badge pending-schedule">Estado: Pendiente de Agendar</div>
              <a :href="MARKETING_MEETING_URL" target="_blank" rel="noopener noreferrer" class="action-button primary">
                Agendar con Especialista
              </a>
            </template>
            
            <template v-else>
              <div class="meeting-details-box">
                <div class="status-badge" :class="marketingMeeting.status">
                  Estado: {{ marketingMeeting.statusText }}
                </div>
                <div v-if="marketingMeeting.scheduledTime" class="details-grid">
                  <span><strong>Fecha:</strong> {{ formatDate(marketingMeeting.scheduledTime) }}</span>
                  <span><strong>Hora:</strong> {{ formatTime(marketingMeeting.scheduledTime) }} (Ecuador)</span>
                </div>
              </div>
              <a v-if="marketingMeeting.status === MeetingStatus.SCHEDULED && marketingMeeting.meetingLink" :href="marketingMeeting.meetingLink" target="_blank" rel="noopener noreferrer" class="action-button primary view-meeting">
                Unirse a la Reunión
              </a>
            </template>
          </div>

          <div class="step-card" :class="{ 'is-locked': !isDataStrategyMeetingUnlocked }">
            <div class="step-header">
              <span class="step-number">2</span>
              <h3 class="step-title">Sesión con Estratega de Datos (Luis Reyes)</h3>
            </div>
            <p class="step-description">Una vez completado el diagnóstico inicial, profundiza en los números y define los KPIs clave para tu crecimiento.</p>
            
            <template v-if="!isDataStrategyMeetingUnlocked">
               <a class="action-button primary is-disabled" @click="handleLockedClick">
                <span class="lock-icon">🔒</span> Bloqueado
              </a>
            </template>

            <template v-else>
              <div v-if="dataStrategyMeeting.status === MeetingStatus.PENDING_SCHEDULE">
                <div class="status-badge pending-schedule">Estado: Pendiente de Agendar</div>
                <a :href="DATA_STRATEGY_MEETING_URL" target="_blank" rel="noopener noreferrer" class="action-button primary">
                  Agendar con Luis Reyes
                </a>
              </div>
              <div v-else>
                <div class="meeting-details-box">
                  <div class="status-badge" :class="dataStrategyMeeting.status">
                    Estado: {{ dataStrategyMeeting.statusText }}
                  </div>
                  <div v-if="dataStrategyMeeting.scheduledTime" class="details-grid">
                    <span><strong>Fecha:</strong> {{ formatDate(dataStrategyMeeting.scheduledTime) }}</span>
                    <span><strong>Hora:</strong> {{ formatTime(dataStrategyMeeting.scheduledTime) }} (Ecuador)</span>
                  </div>
                </div>
                <a v-if="dataStrategyMeeting.status === MeetingStatus.SCHEDULED && dataStrategyMeeting.meetingLink" :href="dataStrategyMeeting.meetingLink" target="_blank" rel="noopener noreferrer" class="action-button primary view-meeting">
                  Unirse a la Reunión
                </a>
              </div>
            </template>
          </div>
        </div>
      </template>

      <div class="support-card">
        <h3 class="support-title">¿Necesitas Ayuda Técnica?</h3>
        <p class="support-description">
          Si tienes consultas específicas sobre **CRM, integraciones, sitios web o código**, puedes agendar una sesión puramente técnica con nuestro equipo de soporte.
        </p>
        <a :href="CALENDLY_LINK" target="_blank" rel="noopener noreferrer" class="action-button secondary">
          Agendar con Soporte Técnico
        </a>
      </div>

      <div class="additional-info">
        <p>
          <strong>¿Reuniones adicionales?</strong> Si necesitas otra sesión de estrategia de marketing o negocios, por favor solicita una cita enviando un correo a <a href="mailto:dquimi@bakano.ec">dquimi@bakano.ec</a>.
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.scheduler-section {
  padding: 4rem 1rem;
  background-color: $white;
}

.scheduler-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.scheduler-header {
  margin-bottom: 3rem;
}

.scheduler-title {
  font-family: $font-principal;
  font-size: clamp(1.8rem, 5vw, 2.2rem);
  font-weight: 700;
  color: $BAKANO-DARK;
}

.scheduler-subtitle {
  font-family: $font-secondary;
  color: rgba($BAKANO-DARK, 0.7);
  max-width: 600px;
  margin: 0.5rem auto 0;
}

.steps-wrapper {
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
}

.step-card {
  background-color: $white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
  text-align: left;
  border: 1px solid #eef0f3;
  transition: all 0.3s ease;

  &.is-locked {
    opacity: 0.65;
    background-color: #f9fafb;
    box-shadow: none;
    border-style: dashed;
  }
}

.step-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.step-number {
  background-color: $BAKANO-PURPLE;
  color: $white;
  font-weight: 700;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.step-title,
.support-title {
  font-family: $font-principal;
  font-size: 1.25rem;
  color: $BAKANO-DARK;
}

.step-description,
.support-description {
  font-family: $font-secondary;
  color: rgba($BAKANO-DARK, 0.8);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.support-card {
  background-color: #f9fafb;
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
}

.support-title {
  color: $BAKANO-PURPLE;
}

.additional-info {
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
  font-family: $font-secondary;
  font-size: 0.9rem;
  color: rgba($BAKANO-DARK, 0.7);

  a {
    color: $BAKANO-PINK;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.action-button {
  display: inline-block;
  text-decoration: none;
  font-family: $font-principal;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  transition: all 0.25s ease;

  &.primary {
    background-color: $BAKANO-PINK;
    color: $white;

    &:hover {
      background-color: darken($BAKANO-PINK, 8%);
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background-color: transparent;
    color: $BAKANO-PURPLE;
    border: 2px solid $BAKANO-PURPLE;

    &:hover {
      background-color: rgba($BAKANO-PURPLE, 0.05);
    }
  }

  &.is-disabled {
    background-color: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;

    &:hover {
      background-color: #d1d5db;
      transform: none;
    }
  }

  &.view-meeting {
    background-color: $BAKANO-GREEN;

    &:hover {
      background-color: darken($BAKANO-GREEN, 8%);
    }
  }
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-transform: capitalize;

  &.completed {
    background-color: rgba($BAKANO-GREEN, 0.1);
    color: darken($BAKANO-GREEN, 10%);
  }

  &.scheduled {
    background-color: rgba($BAKANO-PURPLE, 0.1);
    color: $BAKANO-PURPLE;
  }

  &.pending-schedule {
    background-color: rgba($BAKANO-PINK, 0.1);
    color: $BAKANO-PINK;
  }
}

.lock-icon {
  margin-right: 0.5rem;
}

.feedback-container {
  padding: 3rem 1rem;
  text-align: center;
  color: rgba($BAKANO-DARK, 0.7);
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &.error {
    color: $BAKANO-PINK;
  }
}

.spinner {
  border: 4px solid rgba($BAKANO-PURPLE, 0.2);
  border-left-color: $BAKANO-PURPLE;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.meeting-details-box {
  background-color: #f9fafb;
  border: 1px solid #eef0f3;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.details-grid {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.95rem;
}
</style>