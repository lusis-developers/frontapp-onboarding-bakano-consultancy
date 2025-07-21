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

// Los estilos son excelentes y no necesitan cambios.
// El uso de padding-top para mantener el aspect-ratio es una técnica robusta y mobile-first.
$text-gray-600: #718096;
$breakpoint-md: 768px;

.video-section {
  padding: 3rem 1rem;

  @media (min-width: $breakpoint-md) {
    padding: 5rem 1rem;
  }
}

.video-container {
  margin: 0 auto;
  width: 100%;
  max-width: 1152px;
}

.video-title {
  font-family: $font-principal;
  font-weight: 700;
  color: $BAKANO-DARK;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.875rem;
  line-height: 1.3;

  @media (min-width: $breakpoint-md) {
    font-size: 2.25rem;
  }
}

.video-description {
  font-family: $font-secondary;
  color: $text-gray-600;
  text-align: center;
  margin-bottom: 2rem;
  max-width: 672px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1rem;
  line-height: 1.6;
}

.video-embed-wrapper {
  max-width: 896px;
  margin: 0 auto 3rem;
  position: relative;
  padding-top: 56.25%;
  /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);

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