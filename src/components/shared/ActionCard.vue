<script setup lang="ts">
import { DOCUMENTATION_URL } from '@/constants/links.contant';

// 1. DEFINIMOS LAS PROPS QUE CONTROLARÁN TODO EL CONTENIDO
// Este componente no sabe NADA sobre marketing o datos, solo muestra lo que recibe.
const props = defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },

  // Para la caja de detalles de la reunión
  details: {
    type: Object as () => { expertTitle: string; assignedTo: string; date?: string; time?: string; status?: string; } | null,
    default: null,
  },

  // Para el botón de acción principal
  primaryAction: {
    type: Object as () => { text: string; link: string; },
    required: true
  },

  // Para el recordatorio de documentación
  showDocsLink: {
    type: Boolean,
    default: true,
  },

  // Usamos un slot para contenido extra, como la advertencia del portafolio.
});
</script>

<template>
  <div class="action-card">
    <div class="card-icon">{{ props.icon }}</div>
    <h2 class="card-title">{{ props.title }}</h2>
    <p class="card-subtitle">{{ props.subtitle }}</p>

    <div v-if="props.details" class="details-box">
      <p><strong>{{ props.details.expertTitle }}</strong> {{ props.details.assignedTo }}</p>
      <p v-if="props.details.date"><strong>Fecha:</strong> <span class="highlight">{{ props.details.date }}</span></p>
      <p v-if="props.details.time"><strong>Hora:</strong> <span class="highlight">{{ props.details.time }} (Hora de Ecuador)</span></p>
      <p v-if="props.details.status"><strong>Estado:</strong> <span class="highlight">{{ props.details.status }}</span></p>
    </div>

    <slot name="extra-content"></slot>

    <div v-if="props.showDocsLink" class="documentation-reminder">
      <p>
        Prepárate para la sesión: 
        <a :href="DOCUMENTATION_URL" target="_blank" rel="noopener noreferrer">
          Revisar la documentación
        </a>
      </p>
    </div>

    <a
      :href="props.primaryAction.link"
      target="_blank"
      rel="noopener noreferrer"
      class="action-button primary"
    >
      {{ props.primaryAction.text }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
// Los estilos son una fusión y limpieza de los dos componentes originales.
@use '@/styles/index.scss' as *;

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  padding: 1rem 0;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
}

.details-box {
  background-color: #fcfcfd;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  width: 100%;
  text-align: left;
  line-height: 1.8;

  p {
    margin: 0.5rem 0;
    font-size: 0.95rem;
  }

  .highlight {
    color: $BAKANO-PINK;
    font-weight: 600;
  }
}

.card-icon {
  font-size: 3.5rem;
  line-height: 1;
}

.card-title {
  font-family: $font-principal;
  font-size: 1.5rem;
  font-weight: 700;
  color: $BAKANO-DARK;
}

.card-subtitle {
  font-family: $font-secondary;
  color: #4A5568;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0;
}

.action-button {
  margin-top: 0.5rem;
  display: inline-block;
  font-family: $font-principal;
  font-weight: 600;
  padding: .75rem 1.75rem;
  border-radius: .5rem;
  text-decoration: none;
  transition: all .2s ease-in-out;
  font-size: 1rem;
  border: 1px solid transparent;

  &.primary {
    background-color: $BAKANO-PINK;
    color: $white;

    &:hover {
      background-color: darken($BAKANO-PINK, 7%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($BAKANO-PINK, .2);
    }
  }
}

.documentation-reminder {
  font-family: $font-secondary;
  font-size: 0.9rem;
  color: #4A5568;

  a {
    color: $BAKANO-PINK;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>