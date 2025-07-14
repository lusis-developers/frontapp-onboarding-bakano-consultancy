<script setup lang="ts">

</script>

<template>
  <div class="hero-section">
    <div class="hero-container">
      <div class="text-content">
        <h1 class="hero-title">
          <span class="hero-title-gradient">¡Gracias por unirte</span> a nosotros!
        </h1>
        <p class="hero-subtitle">
          Estamos entusiasmados de empezar a trabajar contigo para llevar tu negocio al siguiente nivel.
        </p>
      </div>

      <div class="additional-info">
        <p class="quote">
          "Juntos analizaremos los datos y estrategias de tu negocio para que empieces a crecer con control y previsión."
        </p>
        <p class="payment-status">Tu pago ha sido exitosamente procesado</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  margin-left: auto;
  margin-right: auto;
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

  .hero-title-gradient {

    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;

    background-image: linear-gradient(to right, $BAKANO-PINK, $BAKANO-PURPLE);
  }
}

.hero-subtitle {
  font-family: $font-secondary;
  font-size: 1.25rem;
  color: mix($BAKANO-DARK, $white, 70%);

  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
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