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
const hasDocument = (path: string | string[] | undefined): boolean => {
  if (Array.isArray(path)) {
    return path.length > 0 && path.some(p => !!p);
  }
  return !!path;
};

// Función para formatear números como moneda
const formatCurrency = (amount: string | number | undefined): string => {
  if (!amount) return 'No especificado';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return 'No especificado';
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

// Función para obtener el texto del desafío principal
const getDesafioText = (desafio: string | undefined): string => {
  if (!desafio) return 'No especificado';
  const desafios: Record<string, string> = {
    'aumentar_ingreso': 'Aumentar Ingresos',
    'reducir_costos': 'Reducir Costos',
    'mejorar_eficiencia': 'Mejorar Eficiencia',
    'expandir_mercado': 'Expandir Mercado',
    'otro': 'Otro'
  };
  return desafios[desafio] || desafio;
};

// Función para obtener el texto del objetivo ideal
const getObjetivoText = (objetivo: string | undefined): string => {
  if (!objetivo) return 'No especificado';
  const objetivos: Record<string, string> = {
    'consultora': 'Consultoría Especializada',
    'crecimiento': 'Crecimiento Sostenible',
    'optimizacion': 'Optimización de Procesos',
    'expansion': 'Expansión de Mercado'
  };
  return objetivos[objetivo] || objetivo;
};

// Estructura de datos para renderizar fácilmente la lista de documentos/archivos de servicios
const serviceDocuments = [
  { label: 'Logo de Marca', loaded: hasDocument(props.business.brandLogoPath) },
  { label: 'Paleta de Colores', loaded: !!(props.business.brandPrimaryColor && props.business.brandSecondaryColor) },
  { label: 'Tipografía de Marca', loaded: !!props.business.brandTypographyName },
  { label: 'Propuesta de Valor', loaded: !!props.business.valueProposition },
  { label: 'Descripción del Servicio', loaded: !!props.business.serviceDescription },
];

// Obtener información de managers
const managersInfo = props.business.managers || [];
</script>

<template>
  <section class="service-info-section">
    <div class="service-info-container">
      <div class="service-info-header">
        <h2 class="service-info-title">Bienvenido, {{ business.name }}</h2>
        <p class="service-info-subtitle">Esta es la información que hemos recopilado para iniciar nuestra consultoría especializada en servicios.</p>
      </div>

      <div class="service-info-grid">
        <!-- Datos Básicos del Negocio -->
        <div class="service-info-card">
          <h3 class="service-card-title">
            <span class="title-icon">🏢</span>
            Datos del Negocio
          </h3>
          <div class="service-card-content">
            <div class="service-info-item">
              <span class="service-item-label">Tipo de Negocio</span>
              <span class="service-item-value">{{ business.businessType }}</span>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Dirección</span>
              <span class="service-item-value">{{ business.address || 'Sin dirección' }}</span>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Teléfono</span>
              <span class="service-item-value">{{ business.phone }}</span>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Email</span>
              <span class="service-item-value">{{ business.email }}</span>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Nº de Empleados</span>
              <span class="service-item-value">{{ business.empleados }}</span>
            </div>
          </div>
        </div>

        <!-- Información del Servicio -->
        <div class="service-info-card">
          <h3 class="service-card-title">
            <span class="title-icon">⚡</span>
            Información del Servicio
          </h3>
          <div class="service-card-content">
            <div class="service-info-item">
              <span class="service-item-label">Tipo de Servicio</span>
              <span class="service-item-value">{{ business.serviceType || 'No especificado' }}</span>
            </div>
            <div class="service-info-item full-width">
              <span class="service-item-label">Descripción</span>
              <span class="service-item-value description">{{ business.serviceDescription || 'No especificada' }}</span>
            </div>
            <div class="service-info-item full-width">
              <span class="service-item-label">Propuesta de Valor</span>
              <span class="service-item-value description">{{ business.valueProposition || 'No especificada' }}</span>
            </div>
          </div>
        </div>

        <!-- Información Financiera -->
        <div class="service-info-card">
          <h3 class="service-card-title">
            <span class="title-icon">💰</span>
            Información Financiera
          </h3>
          <div class="service-card-content">
            <div class="service-info-item">
              <span class="service-item-label">Ingreso Mensual</span>
              <span class="service-item-value">{{ formatCurrency(business.ingresoMensual) }}</span>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Ingreso Anual</span>
              <span class="service-item-value">{{ formatCurrency(business.ingresoAnual) }}</span>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Desafío Principal</span>
              <span class="service-item-value">{{ getDesafioText(business.desafioPrincipal) }}</span>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Objetivo Ideal</span>
              <span class="service-item-value">{{ getObjetivoText(business.objetivoIdeal) }}</span>
            </div>
          </div>
        </div>

        <!-- Presencia Digital -->
        <div class="service-info-card">
          <h3 class="service-card-title">
            <span class="title-icon">📱</span>
            Presencia Digital
          </h3>
          <div class="service-card-content">
            <div class="service-info-item">
              <span class="service-item-label">Instagram</span>
              <span class="service-item-value">{{ business.instagram || 'No especificado' }}</span>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">TikTok</span>
              <span class="service-item-value">{{ business.tiktok || 'No especificado' }}</span>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Vende por WhatsApp</span>
              <span class="service-item-value">{{ business.vendePorWhatsapp ? 'Sí' : 'No' }}</span>
            </div>
            <div v-if="business.gananciaWhatsapp" class="service-info-item">
              <span class="service-item-label">Ganancia WhatsApp</span>
              <span class="service-item-value">{{ business.gananciaWhatsapp }}</span>
            </div>
          </div>
        </div>

        <!-- Identidad de Marca -->
        <div class="service-info-card">
          <h3 class="service-card-title">
            <span class="title-icon">🎨</span>
            Identidad de Marca
          </h3>
          <div class="service-card-content">
            <div class="service-info-item">
              <span class="service-item-label">Color Primario</span>
              <div class="color-display">
                <span class="color-swatch" :style="{ backgroundColor: business.brandPrimaryColor }"></span>
                <span class="service-item-value">{{ business.brandPrimaryColor || 'No especificado' }}</span>
              </div>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Color Secundario</span>
              <div class="color-display">
                <span class="color-swatch" :style="{ backgroundColor: business.brandSecondaryColor }"></span>
                <span class="service-item-value">{{ business.brandSecondaryColor || 'No especificado' }}</span>
              </div>
            </div>
            <div class="service-info-item">
              <span class="service-item-label">Tipografía</span>
              <span class="service-item-value" :style="{ fontFamily: business.brandTypographyName }">
                {{ business.brandTypographyName || 'No especificada' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Equipo de Gestión -->
        <div v-if="managersInfo.length > 0" class="service-info-card">
          <h3 class="service-card-title">
            <span class="title-icon">👥</span>
            Equipo de Gestión
          </h3>
          <div class="service-card-content">
            <div v-for="manager in managersInfo" :key="manager._id" class="manager-item">
              <div class="manager-info">
                <span class="manager-name">{{ manager.name }}</span>
                <span class="manager-role">{{ manager.role }}</span>
              </div>
              <span class="manager-email">{{ manager.email }}</span>
            </div>
          </div>
        </div>

        <!-- Documentos y Archivos -->
        <div class="service-info-card">
          <h3 class="service-card-title">
            <span class="title-icon">📄</span>
            Documentos Recibidos
          </h3>
          <div class="service-card-content">
            <ul class="service-document-list">
              <li v-for="doc in serviceDocuments" :key="doc.label" class="service-document-item" :class="{ 'loaded': doc.loaded }">
                <span class="service-document-icon">{{ doc.loaded ? '✅' : '⏳' }}</span>
                <span class="service-document-label">{{ doc.label }}</span>
                <span class="service-document-status">{{ doc.loaded ? 'Recibido' : 'Pendiente' }}</span>
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
.service-info-section {
  background-color: $white;
  font-family: $font-secondary;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 4.5rem 1.5rem;
  }
}

// --- Contenedor General y Encabezado ---
.service-info-container {
  max-width: 1200px;
  margin: 0 auto;
}

.service-info-header {
  text-align: center;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    margin-bottom: 4rem;
  }
}

.service-info-title {
  font-family: $font-principal;
  font-weight: 700;
  color: $BAKANO-DARK;
  line-height: 1.2;
  font-size: clamp(1.8rem, 5vw, 2.25rem);
}

.service-info-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  color: rgba($BAKANO-DARK, 0.8);
  max-width: 700px;
  margin: 0.5rem auto 0;
}

// --- Rejilla y Tarjetas de Información ---
.service-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.service-info-card {
  background-color: $white;
  border-radius: 16px;
  border: 1px solid #eef0f3;
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

.service-card-title {
  font-family: $font-principal;
  font-size: 1.25rem;
  font-weight: 600;
  color: $BAKANO-PURPLE;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eef0f3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.1rem;
}

// --- Contenido específico de las tarjetas ---
.service-card-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.service-info-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.95rem;

  &.full-width {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

.service-item-label {
  color: rgba($BAKANO-DARK, 0.7);
  font-weight: 500;
  min-width: 120px;
}

.service-item-value {
  color: $BAKANO-DARK;
  font-weight: 600;
  text-align: right;
  flex: 1;

  &.description {
    text-align: left;
    line-height: 1.5;
    background-color: rgba($BAKANO-PURPLE, 0.05);
    padding: 0.75rem;
    border-radius: 8px;
    border-left: 3px solid $BAKANO-PURPLE;
  }
}

// --- Estilos para colores ---
.color-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

// --- Estilos para managers ---
.manager-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: rgba($BAKANO-PURPLE, 0.05);
  border-radius: 8px;
  border-left: 3px solid $BAKANO-PURPLE;
}

.manager-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.manager-name {
  font-weight: 600;
  color: $BAKANO-DARK;
}

.manager-role {
  font-size: 0.85rem;
  color: $BAKANO-PURPLE;
  font-weight: 500;
  background-color: rgba($BAKANO-PURPLE, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.manager-email {
  font-size: 0.9rem;
  color: rgba($BAKANO-DARK, 0.7);
}

// --- Lista de Documentos ---
.service-document-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-document-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
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

.service-document-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.service-document-label {
  flex-grow: 1;
  text-align: left;
}

.service-document-status {
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.9;
  flex-shrink: 0;
}
</style>