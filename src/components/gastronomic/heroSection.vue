<script setup lang="ts">
// Ahora el componente acepta props para la información secundaria,
// haciéndolo aún más reutilizable.
const props = defineProps({
  quote: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  }
});
</script>

<template>
  <div class="hero-section">
    <div class="hero-container">
      <div class="text-content">
        <h1 class="hero-title">
          <slot name="title">
            Título por Defecto
          </slot>
        </h1>
        <p class="hero-subtitle">
          <slot name="subtitle">
            Subtítulo por defecto.
          </slot>
        </p>
      </div>

      <div v-if="props.quote || props.status" class="additional-info">
        <p v-if="props.quote" class="quote">"{{ props.quote }}"</p>
        <p v-if="props.status" class="payment-status">{{ props.status }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Tus estilos aquí se mantienen igual, ya estaban muy bien. */
@use '@/styles/index.scss' as *;

$breakpoint-md: 768px;
$breakpoint-lg: 1024px;

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-section {
  position: relative;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-color: $white;
  padding: 4rem 1.5rem;

  @media (min-width: $breakpoint-md) {
    padding: 5rem 1.5rem;
  }
}

.hero-container {
  width: 100%;
  max-width: 1152px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  animation: fadeIn 0.7s ease-out forwards;
}

.text-content {
  text-align: center;
  margin-bottom: 2rem;
}

.hero-title {
  font-family: $font-principal;
  font-weight: 700;
  color: $BAKANO-DARK;
  margin-bottom: 1.5rem;
  font-size: 2.25rem;
  line-height: 1.2;

  @media (min-width: $breakpoint-md) {
    font-size: 3rem;
  }

  @media (min-width: $breakpoint-lg) {
    font-size: 3.75rem;
  }
}

.hero-subtitle {
  font-family: $font-secondary;
  font-size: 1.25rem;
  color: mix($BAKANO-DARK, $white, 70%);
  max-width: 48rem;
  margin: 0 auto 2rem;
  line-height: 1.6;

  @media (min-width: $breakpoint-md) {
    font-size: 1.5rem;
  }
}

.additional-info {
  margin-top: 3rem;
  text-align: center;
}

.quote {
  font-family: $font-secondary;
  color: mix($BAKANO-DARK, $white, 55%);
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.payment-status {
  font-family: $font-principal;
  color: $BAKANO-PINK;
  font-weight: 600;
  margin-top: 0.75rem;
  font-size: 1.15rem;
}
</style>