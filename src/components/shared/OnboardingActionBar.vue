<script setup lang="ts">
const props = defineProps({
  isSubmitted: {
    type: Boolean,
    required: true,
  },
  schedulingUrl: {
    type: String,
    required: true,
  },
  // El ID del componente CTA al que debemos desplazarnos.
  ctaTargetId: {
    type: String,
    required: true,
  }
});

// Navega a la URL de agendamiento
const goToScheduling = () => {
  if (props.schedulingUrl) {
    window.location.href = props.schedulingUrl;
  }
};

const scrollToCta = () => {
  const element = document.getElementById(props.ctaTargetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
</script>

<template>
  <div class="action-bar-wrapper">
    <div class="action-bar-container">
      <div v-if="!props.isSubmitted" class="action-content">
        <span class="action-text">
          <strong>Siguiente paso:</strong> Completa la información de tu negocio para comenzar.
        </span>
        <button class="action-button" @click="scrollToCta">
          Ir a Formulario
        </button>
      </div>

      <div v-else class="action-content">
        <span class="action-text">
          <strong>¡Información recibida!</strong> Ya puedes agendar tu reunión de diagnóstico.
        </span>
        <button class="action-button schedule" @click="goToScheduling">
          Agendar Ahora
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;
$border-radius-default: 0.5rem;

.action-bar-wrapper {
  position: sticky;
  top: 0;
  z-index: 50;
  transition: all 0.3s ease-in-out;

  // Efecto de "vidrio esmerilado" para un look premium y moderno.
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  // Usamos un borde y sombra sutiles para dar profundidad sin ser intrusivos.
  border-bottom: 1px solid #eef0f3;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);

  // Espaciado adaptable: cómodo en móvil, más aire en escritorio.
  padding: 0.75rem 1rem;

  @media (min-width: 768px) {
    padding: 1rem 1.5rem;
  }
}

// --- Contenedor del Contenido Interno ---
.action-bar-container {
  max-width: 1200px; // Se alinea con el layout general del sitio.
  margin: 0 auto;
}

// --- Contenido de la Barra (Texto y Botón) ---
.action-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: fadeIn 0.5s ease-out;

  // Base mobile: apilado verticalmente para un uso óptimo del espacio.
  flex-direction: column;
  gap: 0.75rem;

  // En escritorio: se expande a un layout horizontal.
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;
  }
}

.action-text {
  font-family: $font-secondary;
  color: $BAKANO-DARK;
  text-align: center;
  line-height: 1.5;

  // Tipografía fluida: se adapta suavemente al tamaño de la pantalla.
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);

  @media (min-width: 768px) {
    text-align: left;
  }

  strong {
    font-family: $font-principal;
    font-weight: 600;
    // Un toque de color de la marca para resaltar la acción clave.
    color: $BAKANO-PURPLE;
  }
}

// --- Botón de Acción ---
.action-button {
  display: inline-block;
  background-color: $BAKANO-PINK;
  color: $white;
  font-family: $font-principal;
  font-weight: 600;
  border-radius: $border-radius-default; // Usamos la variable de la que hablamos.
  border: none;
  cursor: pointer;
  transition: all 0.25s ease-out;
  white-space: nowrap; // Perfecto para evitar saltos de línea en el botón.

  // Espaciado y tamaño de fuente adaptables.
  padding: 0.7rem 1.5rem;
  font-size: clamp(0.8rem, 2vw, 0.9rem);

  // Efecto de "lift" al pasar el mouse para una mejor interacción.
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 12px rgba($BAKANO-PINK, 0.3);
  }

  // Variante para el botón de agendar, usando otro color primario.
  &.schedule {
    background-color: $BAKANO-PURPLE;

    &:hover {
      // La sombra debe coincidir con el color del botón.
      box-shadow: 0 4px 12px rgba($BAKANO-PURPLE, 0.3);
    }
  }
}

// --- Animaciones ---
// Mantenemos esta animación, es limpia y efectiva.
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>