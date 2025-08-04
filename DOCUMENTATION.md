# Documentación Técnica - Bakano Welcome Online Vue

## Descripción General

Este proyecto es una aplicación web desarrollada en Vue 3 con TypeScript que gestiona el proceso de onboarding para clientes de Bakano. La aplicación permite a los usuarios completar formularios de información empresarial y programar reuniones con consultores.

## Información del Proyecto

- **Nombre**: bakano-welcome-online-vue
- **Versión**: 0.0.0
- **Framework**: Vue 3 (Composition API)
- **Lenguaje**: TypeScript
- **Bundler**: Vite
- **Estado**: Desarrollo

## Arquitectura del Proyecto

### Stack Tecnológico

#### Frontend
- **Vue 3**: Framework principal con Composition API
- **TypeScript**: Tipado estático y mejor experiencia de desarrollo
- **Vue Router 4**: Gestión de rutas y navegación
- **Pinia**: Gestión de estado global
- **Vite**: Build tool y servidor de desarrollo

#### Validación y HTTP
- **Vee-Validate**: Validación de formularios
- **Zod**: Esquemas de validación TypeScript-first
- **Axios**: Cliente HTTP para comunicación con APIs

#### Estilos
- **SCSS**: Preprocesador CSS con variables y mixins
- **CSS Modules**: Estilos con scope local

## Estructura del Proyecto

```
bakano-welcome-online-vue/
├── docs/                           # 📚 Documentación técnica
│   ├── README.md                   # Documentación principal
│   ├── API_SERVICES.md            # Servicios y APIs
│   ├── COMPOSABLES.md              # Composables de Vue
│   ├── TYPES_INTERFACES.md         # Tipos e interfaces
│   ├── COMPONENTS.md               # Componentes Vue
│   ├── ROUTING.md                  # Configuración de rutas
│   └── PROJECT_CONFIGURATION.md    # Configuración del proyecto
├── src/
│   ├── anums/                      # 🏷️ Enumeraciones
│   ├── assets/scss/                # 🎨 Estilos SCSS
│   ├── components/                 # 🧩 Componentes Vue
│   ├── composables/                # 🔄 Lógica reutilizable
│   ├── constants/                  # 📋 Constantes
│   ├── router/                     # 🛣️ Configuración de rutas
│   ├── services/                   # 🌐 Servicios de API
│   ├── stores/                     # 🗄️ Stores de Pinia
│   ├── types/                      # 📝 Definiciones TypeScript
│   └── views/                      # 📄 Páginas principales
└── ...
```

## Documentación Detallada

### 📖 Guías Principales

| Documento | Descripción | Contenido |
|-----------|-------------|----------|
| [**README Principal**](./docs/README.md) | Documentación técnica completa | Información general, instalación, uso |
| [**Configuración**](./docs/PROJECT_CONFIGURATION.md) | Configuración del proyecto | Vite, TypeScript, dependencias, scripts |
| [**Rutas**](./docs/ROUTING.md) | Sistema de navegación | Vue Router, rutas dinámicas, guardias |

### 🔧 Arquitectura y Código

| Documento | Descripción | Contenido |
|-----------|-------------|----------|
| [**Servicios API**](./docs/API_SERVICES.md) | Comunicación con backend | HTTPBase, ClientService, ConsultancyService |
| [**Composables**](./docs/COMPOSABLES.md) | Lógica reutilizable | useBusinessOnboarding, useConsultancyForm |
| [**Tipos e Interfaces**](./docs/TYPES_INTERFACES.md) | Sistema de tipos | Business, Client, Meeting, Enums |
| [**Componentes**](./docs/COMPONENTS.md) | Componentes Vue | Estructura, props, eventos, patrones |

## Flujo de la Aplicación

### 1. Punto de Entrada
- **URL**: `/onboarding/:userId/:businessId`
- **Componente**: `onBoarding.vue`
- **Propósito**: Iniciar proceso de onboarding para un cliente específico

### 2. Carga de Datos
- **Composable**: `useBusinessOnboarding`
- **Servicio**: `ClientService.getClientAndBusiness`
- **Datos**: Información del cliente y negocio

### 3. Flujo Condicional

#### Si el formulario NO está completado:
- **Componente**: `OnboardingFormWizard`
- **Composable**: `useConsultancyForm`
- **Funcionalidad**: Formulario multi-paso con validación Zod

#### Si el formulario SÍ está completado:
- **Componente**: `MeetingScheduler`
- **Funcionalidad**: Programación de reuniones
- **Integración**: Enlaces externos (Calendly)

### 4. Estados de Error
- **404**: Negocio no encontrado → `notFound.vue`
- **500**: Error del servidor → Mensaje de error
- **Validación**: Errores de formulario → Mensajes específicos

## Variables de Entorno

```bash
# .env
VITE_BAKANO_API=https://api.bakano.ec
```

### Configuración por Entorno

- **Desarrollo**: `.env` o `.env.development`
- **Producción**: `.env.production`
- **Local**: `.env.local` (no versionado)

## Comandos Principales

### Desarrollo
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Verificar tipos TypeScript
npm run type-check
```

### Producción
```bash
# Construir aplicación
npm run build

# Previsualizar build
npm run preview
```

## Características Técnicas

### 🎯 Funcionalidades Principales

1. **Onboarding Dinámico**
   - Formularios adaptativos según tipo de negocio
   - Validación en tiempo real
   - Subida de archivos

2. **Programación de Reuniones**
   - Integración con servicios externos
   - Diferentes tipos de reunión
   - Gestión de estados de reunión

3. **Gestión de Estado**
   - Pinia para estado global
   - Composables para lógica reutilizable
   - Persistencia de datos del formulario

### 🔒 Seguridad

- **Validación**: Esquemas Zod para validación robusta
- **Tipos**: TypeScript para prevención de errores
- **Sanitización**: Validación de parámetros de ruta
- **Variables**: No exposición de secrets en variables VITE_

### ⚡ Rendimiento

- **Vite**: Build tool rápido con HMR
- **Tree Shaking**: Eliminación de código no utilizado
- **Code Splitting**: División automática de código
- **Lazy Loading**: Carga diferida de componentes

### 🎨 Estilos

- **SCSS**: Preprocesador con variables globales
- **Scoped Styles**: Estilos con scope por componente
- **Responsive**: Diseño adaptativo
- **Variables**: Sistema de design tokens

## Patrones de Desarrollo

### 🧩 Composables
```typescript
// Patrón típico de composable
export function useFeature(props: Props) {
  const state = ref()
  const loading = ref(false)
  
  const fetchData = async () => {
    loading.value = true
    try {
      // lógica
    } finally {
      loading.value = false
    }
  }
  
  return { state, loading, fetchData }
}
```

### 🔄 Servicios API
```typescript
// Patrón de servicio
class FeatureService extends APIBase {
  async getData(id: string): Promise<AxiosResponse<Data>> {
    return this.get<Data>(`/endpoint/${id}`)
  }
}
```

### 📝 Validación
```typescript
// Esquema Zod
const schema = z.object({
  field: z.string().min(1, 'Campo requerido')
})

type FormData = z.infer<typeof schema>
```

## Convenciones de Código

### 📁 Nomenclatura
- **Archivos**: PascalCase para componentes, camelCase para otros
- **Componentes**: PascalCase (`BusinessInfo.vue`)
- **Composables**: camelCase con prefijo `use` (`useBusinessData`)
- **Tipos**: PascalCase (`BusinessData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### 🏗️ Estructura de Componentes
```vue
<template>
  <!-- Template -->
</template>

<script setup lang="ts">
// Imports
// Props/Emits
// Composables
// Reactive data
// Computed
// Methods
// Lifecycle
</script>

<style lang="scss" scoped>
// Estilos
</style>
```

## Integración con Backend

### 🌐 API Endpoints

- **Base URL**: `https://api.bakano.ec`
- **Cliente**: `GET /client/:clientId/business/:businessId`
- **Reuniones**: `GET /client/:clientId/meeting-status`
- **Consultores**: `GET /consultancy/managers`

### 📊 Tipos de Datos

- **Business**: Información del negocio
- **Client**: Datos del cliente
- **Meeting**: Detalles de reuniones
- **Manager**: Información de consultores

## Testing (Recomendado)

### 🧪 Herramientas Sugeridas

```bash
# Instalar dependencias de testing
npm install -D vitest @vue/test-utils jsdom

# Configurar scripts
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "coverage": "vitest --coverage"
}
```

### 📋 Tipos de Tests

1. **Unit Tests**: Composables y funciones utilitarias
2. **Component Tests**: Componentes Vue individuales
3. **Integration Tests**: Flujos completos de usuario
4. **E2E Tests**: Cypress o Playwright

## Deployment

### 🚀 Build de Producción

```bash
# Construir aplicación
npm run build

# Archivos generados en dist/
# Subir contenido de dist/ al servidor web
```

### 🌐 Configuración de Servidor

- **SPA**: Configurar fallback a `index.html`
- **HTTPS**: Requerido para producción
- **Compression**: Habilitar gzip/brotli
- **Caching**: Headers apropiados para assets

## Contribución

### 📝 Proceso de Desarrollo

1. **Análisis**: Revisar documentación existente
2. **Desarrollo**: Seguir patrones establecidos
3. **Testing**: Verificar funcionalidad
4. **Documentación**: Actualizar docs si es necesario

### 🔍 Code Review

- **TypeScript**: Verificar tipos correctos
- **Composables**: Lógica reutilizable
- **Componentes**: Props y eventos bien definidos
- **Estilos**: Consistencia con design system

## Recursos Adicionales

### 📚 Enlaces Útiles

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)

### 🛠️ Herramientas de Desarrollo

- **VS Code**: Editor recomendado
- **Volar**: Extensión para Vue 3
- **TypeScript Vue Plugin**: Soporte TypeScript
- **Vue DevTools**: Debugging en navegador

---

**Nota**: Esta documentación refleja el estado actual del proyecto y debe actualizarse conforme evolucione el código fuente.

**Última actualización**: Diciembre 2024