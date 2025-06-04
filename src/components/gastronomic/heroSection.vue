<script setup lang="ts">
// No se necesita lógica de script para este componente en particular.
</script>

<template>
  <div class="hero-section">
    <div class="hero-container">
      <div class="text-content">
        <h1 class="hero-title">
          <span class="hero-title-gradient">¡Gracias por unirte</span> a nosotros!
        </h1>
        <p class="hero-subtitle">
          Estamos entusiasmados de empezar a trabajar contigo para llevar tu negocio gastronómico
          al siguiente nivel.
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
// Importa tus variables y mixins globales de SCSS
// Esto asume que 'index.scss' está en 'src/styles/' y que
// 'index.scss' correctamente hace @forward de tus variables de color y fuentes.
@use '@/styles/index.scss' as *;

// Definiciones de breakpoints (puedes moverlas a un archivo global de SCSS si las usas en múltiples componentes)
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;

// Definición de la animación de entrada (puedes moverla a un archivo global de animaciones)
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
  background-color: $white; // Usando $white de tus variables globales
  // 'section-padding' - Aplicamos un padding general, puedes ajustarlo o hacerlo más específico
  padding: 4rem 1.5rem; // Padding para móviles

  @media (min-width: $breakpoint-md) {
    padding: 5rem 1.5rem; // Padding para tablets y superior
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
  margin-bottom: 2rem; // Equivalente a Tailwind 'mb-8'
}

.hero-title {
  font-family: $font-principal; // Debería ser 'Mosk' según tu fonts.module.scss
  font-weight: 700; // 'font-bold'
  color: $BAKANO-DARK;
  margin-bottom: 1.5rem; // 'mb-6'
  font-size: 2.25rem; // 'text-4xl'
  line-height: 1.2;

  @media (min-width: $breakpoint-md) {
    font-size: 3rem; // 'md:text-5xl'
  }

  @media (min-width: $breakpoint-lg) {
    font-size: 3.75rem; // 'lg:text-6xl' (Tailwind es 3.75rem, 60px)
  }

  .hero-title-gradient {
    // 'text-gradient'
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    // Usando tus colores para el gradiente
    background-image: linear-gradient(to right, $BAKANO-PINK, $BAKANO-PURPLE);
  }
}

.hero-subtitle {
  font-family: $font-secondary; // 'Inter' podría ser una buena opción para el cuerpo de texto
  font-size: 1.25rem; // 'text-xl'
  // Para 'text-gray-700', puedes definir un color gris en tus variables o usar uno existente
  // Aquí usaré un gris más claro derivado de $BAKANO-DARK, o puedes definir $text-gray-700: #4A5568;
  color: mix($BAKANO-DARK, $white, 70%); // Ejemplo de un gris derivado. Ajusta según necesites.
  // Alternativamente: color: #4A5568; // si prefieres el valor directo de Tailwind text-gray-700
  max-width: 48rem; // 'max-w-3xl' (48rem * 16px)
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem; // 'mb-8'
  line-height: 1.6;

  @media (min-width: $breakpoint-md) {
    font-size: 1.5rem; // 'md:text-2xl'
  }
}

.additional-info {
  margin-top: 3rem; // 'mt-12'
  text-align: center;
}

.quote {
  font-family: $font-secondary; // 'Inter'
  // Para 'text-gray-600', similar al anterior.
  // color: #718096; // Valor directo de Tailwind text-gray-600
  color: mix($BAKANO-DARK, $white, 55%); // Ejemplo de un gris más claro.
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1rem; // Espacio entre la cita y el estado del pago
}

.payment-status {
  font-family: $font-principal; // 'Mosk'
  color: $BAKANO-PINK;
  font-weight: 600; // 'font-semibold'
  margin-top: 0.75rem; // 'mt-3'
  font-size: 1.15rem;
}
</style>