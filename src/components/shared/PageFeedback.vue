<script setup lang="ts">
// 1. DEFINICIÓN DE PROPS
// El componente es configurable a través de estas propiedades.
// Lo hacemos flexible para que se adapte a diferentes contextos.
const props = defineProps({
  // Estado de carga principal
  isLoading: {
    type: Boolean,
    default: false,
  },
  // Estado para cuando un recurso no se encuentra (ej. 404)
  isNotFound: {
    type: Boolean,
    default: false,
  },
  // Mensaje de error para cualquier otro problema del servidor
  errorMessage: {
    type: String,
    default: null,
  },
  // Texto personalizable para el estado de carga
  loadingText: {
    type: String,
    default: 'Cargando...',
  },
});
</script>

<template>
  <div v-if="props.isLoading" class="feedback-overlay">
    <div class="feedback-content">
      <div class="loader"></div>
      <p>{{ props.loadingText }}</p>
    </div>
  </div>

  <div v-else-if="props.isNotFound" class="feedback-overlay">
    <slot name="not-found">
      <div class="feedback-content">
        <h2>Recurso no encontrado</h2>
        <p>La información que buscas no está disponible.</p>
      </div>
    </slot>
  </div>

  <div v-else-if="props.errorMessage" class="feedback-overlay error">
    <div class="feedback-content">
       <h2>Oops, algo salió mal</h2>
      <p>{{ props.errorMessage }}</p>
    </div>
  </div>

  <slot v-else />

</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.feedback-overlay {
  // Ocupa todo el espacio disponible en su contenedor padre.
  // En `onboarding-page-wrapper`, esto significa ocupar toda la vista.
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: $white; // Asegura que cubra cualquier contenido detrás
}

.feedback-content {
  font-family: $font-principal;
  color: $BAKANO-DARK;

  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: rgba($BAKANO-DARK, 0.7);
  }
}

// Estilos específicos para el estado de error
.feedback-overlay.error {
  .feedback-content {
    h2 {
      color: $BAKANO-PINK;
    }

    p {
      color: darken($BAKANO-PINK, 10%);
    }
  }
}

// Animación del Spinner/Loader
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loader {
  margin: 0 auto 1.5rem auto;
  border: 4px solid rgba($BAKANO-PURPLE, 0.2);
  border-left-color: $BAKANO-PURPLE;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite; // Aplicamos la animación
}
</style>