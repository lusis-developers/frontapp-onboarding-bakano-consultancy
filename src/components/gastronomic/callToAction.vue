<script setup lang="ts">
import { ref } from 'vue';
import BusinessData from '@/components/wizards/getBusinessData/index.vue';

// ORDEN RECIBIDA: Acepta la decisión del padre como una prop.
const props = defineProps<{
  isAlreadySubmitted: boolean;
}>();

// El estado inicial del modal depende de la orden del padre.
const isModalOpen = ref(props.isAlreadySubmitted);

const handleOpenFormClick = () => {
  isModalOpen.value = true;
};

const handleModalClose = (newOpenState: boolean) => {
  isModalOpen.value = newOpenState;
};
</script>

<template>
  <section id="comenzar" class="cta-section">
    <div class="cta-container">
      <div class="cta-card">
        <template v-if="!props.isAlreadySubmitted">
          <h2 class="cta-title">¿Listo para <span class="cta-title-gradient">Transformar</span> tu Negocio?</h2>
          <p class="cta-description">Para continuar con el proceso, haz click en el botón a continuación.</p>
          <div class="cta-actions">
            <button class="cta-button" @click="handleOpenFormClick">¡Comenzar Ahora!</button>
          </div>
        </template>
        <template v-else>
           <h2 class="cta-title">¡Ya casi está todo listo!</h2>
           <p class="cta-description">Recibimos tu información correctamente. Por favor, agenda tu reunión para dar el siguiente paso.</p>
        </template>
      </div>
    </div>
  </section>

  <BusinessData
    :open="isModalOpen"
    @update:open="handleModalClose"
    :is-pre-submitted="props.isAlreadySubmitted"
  />
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *; // Tus variables globales SCSS

// Variables de utilidad basadas en tu paleta
$text-body-color-on-light-bg: rgba($BAKANO-DARK, 0.75); // Para texto secundario sobre fondos claros
$card-background-color: $white;
$section-background-color: $BAKANO-LIGHT; // Fondo claro para la sección, hace resaltar la tarjeta blanca

$border-radius-default: 0.5rem;
$border-radius-large: 1rem;

// Sombras (pueden ser genéricas, ya que no dependen directamente del color)
$box-shadow-subtle: 0 4px 15px rgba(0, 0, 0, 0.06);
$box-shadow-medium: 0 8px 25px rgba(0, 0, 0, 0.08);

$breakpoint-md: 768px;

.cta-section {
  background-color: $section-background-color; // Usamos BAKANO-LIGHT para el fondo de la sección
  padding: 4rem 1rem;

  @media (min-width: $breakpoint-md) {
    padding: 6rem 1rem;
  }
}

.cta-container {
  max-width: 800px; // Ajustado para que no sea excesivamente ancho
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.cta-card {
  background-color: $card-background-color; // Tarjeta blanca
  border-radius: $border-radius-large;
  padding: 2.5rem;
  box-shadow: $box-shadow-medium;
  text-align: center;
  // No usamos borde explícito, la sombra y el contraste de fondo son suficientes

  @media (min-width: $breakpoint-md) {
    padding: 3rem 3.5rem;
  }
}

.cta-title {
  font-family: $font-principal;
  font-weight: 700;
  color: $BAKANO-DARK;
  font-size: 1.8rem; // Ligeramente ajustado
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
  color: $text-body-color-on-light-bg; // Texto oscuro pero suavizado
  font-size: 1.05rem;
  line-height: 1.75;
  max-width: 580px;
  margin: 0 auto 2rem auto;

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
  color: $white; // $text-light podría ser una opción si $white es demasiado brillante
  font-family: $font-principal;
  font-weight: 600;
  padding: 0.9rem 2.25rem;
  border-radius: $border-radius-default;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.25s ease-out, transform 0.15s ease-out, box-shadow 0.25s ease-out;
  text-align: center;
  font-size: 1.05rem;
  letter-spacing: 0.025em;
  box-shadow: 0 2px 8px rgba($BAKANO-PINK, 0.3); // Sombra sutil con el color del botón

  &:hover {
    background-color: darken($BAKANO-PINK, 8%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($BAKANO-PINK, 0.4);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba($BAKANO-PINK, 0.3);
  }
}
</style>