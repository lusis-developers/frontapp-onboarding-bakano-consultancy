<script setup lang="ts">
import { ref } from 'vue';
import BusinessData from '@/components/wizards/getBusinessData/index.vue';

// 1. AÑADIMOS defineOptions
// Esto le dice a Vue: "No intentes heredar los atributos automáticamente en el elemento raíz.
// Yo me encargaré de hacerlo manualmente con v-bind='$attrs'".
defineOptions({
  inheritAttrs: false
});

// El resto de tu script se mantiene igual.
const props = defineProps<{
  isAlreadySubmitted: boolean;
  // La prop schedulingUrl que añadimos anteriormente es correcta.
  schedulingUrl: string;
}>();

const isModalOpen = ref(false);

const handleOpenFormClick = () => {
  isModalOpen.value = true;
};

const handleModalClose = (newOpenState: boolean) => {
  isModalOpen.value = newOpenState;
};

const goToScheduling = () => {
  if (props.schedulingUrl) {
    window.location.href = props.schedulingUrl;
  }
};
</script>

<template>
  <div>
    <section v-bind="$attrs" class="cta-section">
      <div class="cta-container">
        <div class="cta-card">
          <div v-if="!props.isAlreadySubmitted" class="cta-content">
            <h2 class="cta-title">¿Listo para <span class="cta-title-gradient">Transformar</span> tu Negocio?</h2>
            <p class="cta-description">Para iniciar nuestra consultoría, necesitamos que completes la información de tu negocio.</p>
            <div class="cta-actions">
              <button class="cta-button" @click="handleOpenFormClick">Completar Información</button>
            </div>
          </div>
          <div v-else class="cta-content submitted">
             <h2 class="cta-title">¡Información Recibida!</h2>
             <p class="cta-description">Hemos recibido y verificado los datos de tu negocio. El siguiente paso es agendar tu sesión de diagnóstico inicial.</p>
             <div class="cta-actions">
               <button class="cta-button schedule" @click="goToScheduling">Agendar Reunión Ahora</button>
             </div>
          </div>
        </div>
      </div>
    </section>

    <BusinessData
      v-if="!props.isAlreadySubmitted"
      :open="isModalOpen"
      @update:open="handleModalClose"
      :is-pre-submitted="props.isAlreadySubmitted"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

// La mayoría de los estilos se mantienen. Solo añadimos una variación para el botón de agendar.
$text-body-color-on-light-bg: rgba($BAKANO-DARK, 0.75);
$card-background-color: $white;
$section-background-color: $BAKANO-LIGHT;
$border-radius-default: 0.5rem;
$border-radius-large: 1rem;
$box-shadow-medium: 0 8px 25px rgba(0, 0, 0, 0.08);
$breakpoint-md: 768px;

.cta-section {
  background-color: $section-background-color;
  padding: 4rem 1rem;

  @media (min-width: $breakpoint-md) {
    padding: 6rem 1rem;
  }
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.cta-card {
  background-color: $card-background-color;
  border-radius: $border-radius-large;
  padding: 2.5rem;
  box-shadow: $box-shadow-medium;
  text-align: center;
  transition: all 0.3s ease-in-out;

  @media (min-width: $breakpoint-md) {
    padding: 3rem 3.5rem;
  }
}

.cta-content.submitted {
  // Animación sutil para indicar que el contenido ha cambiado
  animation: fadeInContent 0.5s ease-out;
}

@keyframes fadeInContent {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta-title {
  font-family: $font-principal;
  font-weight: 700;
  color: $BAKANO-DARK;
  font-size: 1.8rem;
  line-height: 1.35;
  margin-bottom: 1rem;

  @media (min-width: $breakpoint-md) {
    font-size: 2.2rem;
  }
}

.cta-title-gradient {
  background-image: linear-gradient(to right, $BAKANO-PINK, $BAKANO-PURPLE);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cta-description {
  font-family: $font-secondary;
  color: $text-body-color-on-light-bg;
  font-size: 1.05rem;
  line-height: 1.75;
  max-width: 580px;
  margin: 0 auto 2rem;

  @media (min-width: $breakpoint-md) {
    font-size: 1.1rem;
  }
}

.cta-actions {
  margin-top: 1.5rem;
}

.cta-button {
  display: inline-block;
  background-color: $BAKANO-PINK;
  color: $white;
  font-family: $font-principal;
  font-weight: 600;
  padding: 0.9rem 2.25rem;
  border-radius: $border-radius-default;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease-out;
  font-size: 1.05rem;
  letter-spacing: 0.025em;
  box-shadow: 0 2px 8px rgba($BAKANO-PINK, 0.3);

  &:hover {
    background-color: darken($BAKANO-PINK, 8%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($BAKANO-PINK, 0.4);
  }

  &.schedule {
    background-color: $BAKANO-PURPLE;
    box-shadow: 0 2px 8px rgba($BAKANO-PURPLE, 0.3);

    &:hover {
      background-color: darken($BAKANO-PURPLE, 8%);
      box-shadow: 0 4px 12px rgba($BAKANO-PURPLE, 0.4);
    }
  }
}
</style>