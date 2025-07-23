<script setup lang="ts">
import type { Business } from '@/types/business';

// Definimos las props que este componente espera recibir.
const props = defineProps({
  business: {
    type: Object as () => Business,
    required: true,
  },
});

// Función de utilidad para verificar si un documento fue cargado
const hasDocument = (path: string | undefined): boolean => !!path;

// Estructura de datos para renderizar fácilmente la lista de documentos
const documents = [
  { label: 'Menú del Restaurante', loaded: hasDocument(props.business.menuRestaurantePath) },
  { label: 'Costo por Plato', loaded: hasDocument(props.business.costoPorPlatoPath) },
  { label: 'Reporte de Movimientos', loaded: hasDocument(props.business.ventasMovimientosPath) },
  { label: 'Reporte de Ventas por Producto', loaded: hasDocument(props.business.ventasProductosPath) },
  { label: 'Reporte de Ventas por Cliente', loaded: hasDocument(props.business.ventasClientePath) },
];
</script>

<template>
  <section class="info-section">
    <div class="info-container">
      <div class="info-header">
        <h2 class="info-title">Bienvenido, {{ business.name }}</h2>
        <p class="info-subtitle">Esta es la información que hemos recopilado para iniciar nuestra consultoría.</p>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <h3 class="card-title">Datos del Negocio</h3>
          <div class="card-content">
            <div class="info-item">
              <span class="item-label">Propietario(a)</span>
              <span class="item-value">{{ business.owner }}</span>
            </div>
            <div class="info-item">
              <span class="item-label">Instagram</span>
              <span class="item-value">{{ business.instagram }}</span>
            </div>
            <div class="info-item">
              <span class="item-label">TikTok</span>
              <span class="item-value">{{ business.tiktok || 'No provisto' }}</span>
            </div>
            <div class="info-item">
              <span class="item-label">Nº de Empleados</span>
              <span class="item-value">{{ business.empleados }}</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h3 class="card-title">Documentos Recibidos</h3>
          <div class="card-content">
            <ul class="document-list">
              <li v-for="doc in documents" :key="doc.label" class="document-item" :class="{ 'loaded': doc.loaded }">
                <span class="document-icon">{{ doc.loaded ? '✅' : '⏳' }}</span>
                <span class="document-label">{{ doc.label }}</span>
                <span class="document-status">{{ doc.loaded ? 'Recibido' : 'Pendiente' }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

// --- Contenedor Principal de la Sección ---
.info-section {
  // Un fondo sutil para que las tarjetas blancas resalten.
  background-color: $white;
  font-family: $font-secondary;

  // Espaciado adaptable: menos en móvil, más en escritorio.
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 4.5rem 1.5rem;
  }
}

// --- Contenedor General y Encabezado ---
.info-container {
  max-width: 900px;
  margin: 0 auto;
}

.info-header {
  text-align: center;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    margin-bottom: 4rem;
  }
}

.info-title {
  font-family: $font-principal;
  font-weight: 700;
  color: $BAKANO-DARK;
  line-height: 1.2;

  // Tipografía fluida: crece suavemente con el ancho de la pantalla.
  // Mínimo 1.8rem, ideal 5vw, máximo 2.25rem.
  font-size: clamp(1.8rem, 5vw, 2.25rem);
}

.info-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  color: rgba($BAKANO-DARK, 0.8);
  max-width: 600px;
  margin: 0.5rem auto 0;
}

// --- Rejilla y Tarjetas de Información ---
.info-grid {
  display: grid;
  // Base mobile: una sola columna para aprovechar el espacio vertical.
  grid-template-columns: 1fr;
  gap: 1.5rem;

  // En pantallas mayores, pasamos a dos columnas.
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

.info-card {
  background-color: $white;
  border-radius: 16px; // Un radio ligeramente más pronunciado para un look moderno.
  border: 1px solid #eef0f3; // Borde sutil que define mejor la tarjeta.
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(48, 55, 120, 0.1);
    border-color: rgba($BAKANO-PURPLE, 0.3);
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

.card-title {
  font-family: $font-principal;
  font-size: 1.25rem;
  font-weight: 600;
  color: $BAKANO-PURPLE;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eef0f3; // Borde más sutil.
  display: flex;
  align-items: center;
}

// --- Contenido específico de las tarjetas ---
.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem; // Espaciado consistente.
}

.info-item {
  display: flex;
  flex-wrap: wrap; // Permite que los elementos se apilen en pantallas muy estrechas.
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.item-label {
  color: rgba($BAKANO-DARK, 0.7);
  font-weight: 500;
}

.item-value {
  color: $BAKANO-DARK;
  font-weight: 600;
  text-align: right;
}

// --- Lista de Documentos ---
.document-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem; // Un poco más de aire.
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  // Estilo por defecto (Pendiente)
  background-color: rgba($BAKANO-PINK, 0.08);
  color: darken($BAKANO-PINK, 20%);

  // Estilo para documentos cargados
  &.loaded {
    background-color: rgba($BAKANO-GREEN, 0.1);
    color: darken($BAKANO-GREEN, 20%);
  }
}

.document-icon {
  font-size: 1.1rem;
  flex-shrink: 0; // Evita que el ícono se encoja.
}

.document-label {
  flex-grow: 1; // Ocupa el espacio disponible.
  text-align: left;
}

.document-status {
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.9;
  flex-shrink: 0;
}
</style>