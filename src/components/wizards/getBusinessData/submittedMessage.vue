// Este componente podría llamarse "MarketingNextStep.vue" o similar
<script setup lang="ts">
import ActionCard from '@/components/shared/ActionCard.vue';
import { MARKETING_MEETING_URL } from '@/constants/links.contant';

// La advertencia se puede definir como un componente local o un simple trozo de HTML
const WarningMessage = {
  template: `
    <div class="booking-warning">
      <span class="warning-icon">⚠️</span>
      <p class="warning-text">
        <strong>Importante:</strong> La persona encargada del portafolio comercial debe estar presente en la reunión.
      </p>
    </div>
  `
};
</script>

<template>
  <ActionCard
    icon="✅"
    title="¡Todo listo para el siguiente paso!"
    subtitle="Has completado el primer paso con éxito. Ahora, agendemos tu sesión de verificación."
    :primaryAction="{
      text: 'Agendar Reunión con Denisse',
      link: MARKETING_MEETING_URL
    }"
  >
    <template #extra-content>
      <WarningMessage />
    </template>
  </ActionCard>
</template>

<style lang="scss" scoped>
// ¡Importante! Los estilos específicos de la advertencia ahora viven aquí,
// manteniendo ActionCard.vue limpio.
.booking-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #FBBF24;
  background-color: #FFFBEB;
  margin: 1rem 0;

  .warning-icon {
    font-size: 1.25rem;
    line-height: 1.6;
  }

  .warning-text {
    font-family: 'Open Sans', sans-serif; // Asegúrate de usar la variable correcta
    color: #92400E;
    font-size: 0.875rem;
    line-height: 1.6;
    text-align: left;
    margin: 0;

    strong {
      font-weight: 600;
    }
  }
}
</style>