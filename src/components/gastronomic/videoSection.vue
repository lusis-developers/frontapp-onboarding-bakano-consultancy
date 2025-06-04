<script setup lang="ts">
// No se necesita lógica de script específica para este componente
// basado en la plantilla proporcionada.
</script>

<template>
  <section class="video-section">
    <div class="video-container">
      <h2 class="video-title">
        Video Explicativo
      </h2>
      <p class="video-description">
        A continuación podrás ver un video que explica en detalle cómo optimizaremos tu negocio
        gastronómico y los resultados que podemos lograr juntos.
      </p>

      <div class="video-embed-wrapper">
        <iframe
          class="video-iframe"
          src="https://www.youtube.com/embed/oq1lfeO8XPc"
          title="Video Explicativo Bakano"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

$text-gray-600: #718096;

// Breakpoints (consistente con los componentes anteriores)
$breakpoint-md: 768px;

.video-section {
  // Efecto de 'section-padding'
  padding: 3rem 1rem;

  @media (min-width: $breakpoint-md) {
    padding: 5rem 1rem;
  }
}

.video-container {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 1152px;
}

.video-title {
  font-family: $font-principal;
  font-weight: 700; // 'font-bold'
  color: $BAKANO-DARK;
  text-align: center;
  margin-bottom: 1.5rem; // 'mb-6'
  font-size: 1.875rem; // 'text-2xl'
  line-height: 1.3;

  @media (min-width: $breakpoint-md) {
    font-size: 2.25rem; // 'md:text-3xl'
  }
}

.video-description {
  font-family: $font-secondary;
  color: $text-gray-600;
  text-align: center;
  margin-bottom: 2rem; // 'mb-8'
  max-width: 672px; // 'max-w-2xl' (42rem)
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1rem;
  line-height: 1.6;
}

.video-embed-wrapper {
  max-width: 896px; // 'max-w-4xl' (56rem)
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem; // 'mb-12'

  // Para mantener la relación de aspecto 16:9 ('aspect-video')
  position: relative;
  padding-top: 56.25%; // (alto / ancho * 100) => (9 / 16 * 100)
  height: 0; // El padding-top crea la altura
  overflow: hidden; // Esencial para que el border-radius se aplique correctamente al contenido del iframe

  // Estilos que estaban en el iframe directamente, ahora en el wrapper
  border-radius: 0.5rem; // 'rounded-lg' de Tailwind (0.5rem)
  // 'shadow-md' de Tailwind: box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);


  .video-iframe {
    // El iframe ocupa todo el espacio del wrapper
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0; // Elimina el borde por defecto del iframe
  }
}
</style>