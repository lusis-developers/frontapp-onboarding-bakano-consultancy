<script setup lang="ts">
import { ref } from 'vue';
import BusinessData from '@/components/wizards/businessData.vue'; // Importa BusinessData aquí

// Estado local para controlar la visibilidad del modal
const isRegistrationModalVisible = ref(false);

// Ya no necesitamos 'emit' para solicitar la apertura a un padre para ESTE modal.
// const emit = defineEmits(['requestOpenRegistrationModal']); // Puedes quitar esto si no hay otros listeners

const handleOpenFormClick = () => {
  // console.log('CallToAction: Abriendo modal localmente...'); // Log para depuración
  isRegistrationModalVisible.value = true;
  // Ya no emitimos al padre para abrir ESTE modal:
  // emit('requestOpenRegistrationModal');
};

const handleModalClose = (newOpenState: boolean) => {
  // console.log('CallToAction: Modal cerrándose, nuevo estado:', newOpenState); // Log para depuración
  isRegistrationModalVisible.value = newOpenState;
};
</script>

<template>
  <section id="comenzar" class="cta-section">
    <div class="cta-container">
      <div class="cta-card">
        <h2 class="cta-title">
          ¿Listo para <span class="cta-title-gradient">Transformar</span> tu Negocio?
        </h2>
        <p class="cta-description">
          Para continuar con el proceso y comenzar a ver resultados en tu negocio gastronómico,
          haz click en el botón a continuación.
        </p>

        <div class="cta-actions">
          <button
            class="cta-button"
            @click="handleOpenFormClick"
          >
            ¡Comenzar Ahora!
          </button>
        </div>
      </div>
    </div>
  </section>

  <BusinessData
    :open="isRegistrationModalVisible"
    @update:open="handleModalClose"
    :is-pre-submitted="false" 
  />
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

// ... (tus estilos SCSS existentes para .cta-section, .cta-container, etc.)

.cta-button {
  display: inline-block;
  background-color: $BAKANO-PINK;
  color: $white;
  font-family: $font-principal;
  font-weight: 500;
  padding: 1.25rem 2.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease;
  text-align: center;
  font-size: 1.1rem;

  &:hover {
    background-color: darken($BAKANO-PINK, 7%);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
  }
}
</style>