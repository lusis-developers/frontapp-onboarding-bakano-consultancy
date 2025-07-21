<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: 'Título del Video'
  },
  description: {
    type: String,
    default: 'Descripción del video.'
  },
  videoUrl: {
    type: String,
    required: true,
  }
});
</script>

<template>
  <section class="video-section">
    <div class="video-container">
      <h2 class="video-title">{{ props.title }}</h2>
      <p class="video-description">{{ props.description }}</p>

      <div v-if="props.videoUrl" class="video-embed-wrapper">
        <iframe
          class="video-iframe"
          :src="props.videoUrl"
          :title="props.title"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.video-section {
  padding: 3rem 1rem; // Reducimos el padding vertical para un look más compacto
  background-color: $white;

  @media (min-width: 768px) {
    padding: 4.5rem 1.5rem;
  }
}

.video-container {
  max-width: 960px; // Ligeramente más estrecho para centrar la atención
  margin: 0 auto;
  text-align: center;
}

// --- Textos (Título y Descripción) ---
.video-title {
  font-family: $font-principal;
  font-weight: 700;
  color: $BAKANO-DARK;
  font-size: clamp(1.5rem, 4vw, 1.8rem); // Tipografía fluida y más contenida
  line-height: 1.3;
  margin-bottom: 0.75rem;
}

.video-description {
  font-family: $font-secondary;
  color: rgba($BAKANO-DARK, 0.7);
  max-width: 600px; // Más estrecho para mejorar la legibilidad
  margin: 0 auto 2.5rem auto;
  font-size: clamp(0.95rem, 2.5vw, 1.05rem);
  line-height: 1.7;
}

// --- Contenedor del Video ---
.video-embed-wrapper {
  max-width: 896px;
  margin: 0 auto;
  position: relative;

  // Mantenemos el aspect-ratio, es una técnica excelente.
  padding-top: 56.25%;
  /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;

  // Sombra más sutil y borde para un acabado premium.
  border-radius: 12px;
  border: 1px solid #eef0f3;
  box-shadow: 0 8px 30px rgba(48, 55, 120, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(48, 55, 120, 0.12);
  }

  .video-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>