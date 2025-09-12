<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Título del Video'
  },
  description: {
    type: String,
    default: 'Descripción del video.'
  },
  mediaId: {
    type: String,
    required: true,
  },
  aspectRatio: {
    type: Number,
    default: 1.7777777777777777 // 16:9
  }
});

// Cargar scripts de Wistia dinámicamente
onMounted(() => {
  // Cargar el player principal de Wistia
  if (!document.querySelector('script[src="https://fast.wistia.com/player.js"]')) {
    const playerScript = document.createElement('script');
    playerScript.src = 'https://fast.wistia.com/player.js';
    playerScript.async = true;
    document.head.appendChild(playerScript);
  }
  
  // Cargar el script específico del video
  if (!document.querySelector(`script[src="https://fast.wistia.com/embed/${props.mediaId}.js"]`)) {
    const embedScript = document.createElement('script');
    embedScript.src = `https://fast.wistia.com/embed/${props.mediaId}.js`;
    embedScript.async = true;
    embedScript.type = 'module';
    document.head.appendChild(embedScript);
  }
});
</script>

<template>
  <section class="video-section">
    <div class="video-container">
      <h2 class="video-title">{{ props.title }}</h2>
      <p class="video-description">{{ props.description }}</p>

      <div v-if="props.mediaId" class="video-embed-wrapper">
        <wistia-player 
          :media-id="props.mediaId" 
          :aspect="props.aspectRatio"
          class="wistia-player"
        ></wistia-player>
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

  // Sombra más sutil y borde para un acabado premium.
  border-radius: 12px;
  border: 1px solid #eef0f3;
  box-shadow: 0 8px 30px rgba(48, 55, 120, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(48, 55, 120, 0.12);
  }

  .wistia-player {
    width: 100%;
    height: auto;
    display: block;
    
    // Estilo para el estado de carga con blur
    &:not(:defined) {
      background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/lpxrybfuh8/swatch');
      display: block;
      filter: blur(5px);
      padding-top: 56.25%; // 16:9 aspect ratio
      background-color: #f8f9fa;
    }
  }
}
</style>