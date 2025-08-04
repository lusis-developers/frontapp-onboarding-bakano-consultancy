# Componentes - Documentación Técnica

## Descripción General

El proyecto utiliza Vue 3 con Composition API y TypeScript. Los componentes están organizados por funcionalidad en diferentes directorios dentro de `src/components/`.

## Estructura de Componentes

```
src/components/
├── gastronomic/
│   ├── BusinessInfoDisplay.vue
│   └── MeetingScheduler.vue
├── global/
│   ├── Footer.vue
│   └── Header.vue
├── modal/
│   ├── confirmCloseModal.vue
│   └── meetingDetails.vue
├── shared/
│   ├── ActionCard.vue
│   └── OnboardingActionBar.vue
├── wizards/
│   └── OnboardingFormWizard.vue
└── onBoardingNextStep.vue
```

## Componentes Principales

### App.vue

**Ubicación**: `src/App.vue`

**Descripción**: Componente raíz de la aplicación que define el layout principal.

#### Estructura

```vue
<template>
  <div id="app">
    <Header />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/global/Header.vue'
import Footer from '@/components/global/Footer.vue'
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
```

#### Características
- **Layout**: Estructura básica con header, main y footer
- **Routing**: Utiliza `<RouterView />` para mostrar las páginas
- **Estilos**: Importa estilos globales SCSS
- **Componentes**: Incluye Header y Footer globales

### onBoarding.vue

**Ubicación**: `src/views/onBoarding.vue`

**Descripción**: Página principal del proceso de onboarding para clientes.

#### Props

```typescript
interface Props {
  userId: string
  businessId: string
}
```

#### Composables Utilizados

- **useBusinessOnboarding**: Gestiona datos del negocio y estado de carga

#### Estructura

```vue
<template>
  <div class="onboarding-page">
    <HeroSection 
      v-if="businessData" 
      :business-name="businessData.name" 
    />
    
    <div v-if="isLoading" class="loading">
      <!-- Estado de carga -->
    </div>
    
    <div v-else-if="businessNotFound" class="error">
      <!-- Error: negocio no encontrado -->
    </div>
    
    <div v-else-if="serverError" class="error">
      <!-- Error del servidor -->
    </div>
    
    <div v-else class="content">
      <OnboardingFormWizard 
        v-if="!isFormCompleted" 
        :business-data="businessData" 
        @form-completed="handleFormCompleted" 
      />
      
      <MeetingScheduler 
        v-else 
        :client-id="userId" 
        :business-id="businessId" 
      />
    </div>
  </div>
</template>
```

#### Funcionalidades

1. **Gestión de Estado**: Maneja diferentes estados (carga, error, éxito)
2. **Título Dinámico**: Actualiza el título del documento basado en datos del negocio
3. **Flujo Condicional**: Muestra formulario o programador de reuniones según el estado
4. **Manejo de Errores**: Gestiona errores de negocio no encontrado y errores del servidor

#### Componentes Importados

- `HeroSection`: Sección hero con información del negocio
- `OnboardingFormWizard`: Wizard del formulario de onboarding
- `MeetingScheduler`: Programador de reuniones

### notFound.vue

**Ubicación**: `src/views/notFound.vue`

**Descripción**: Página de error 404 para rutas no encontradas.

#### Estructura

```vue
<template>
  <div class="not-found">
    <h1>404 - Página no encontrada</h1>
    <p>La página que buscas no existe.</p>
    <a href="https://bakano.ec" class="back-link">
      Volver a Bakano
    </a>
  </div>
</template>
```

#### Características

- **Enlace Externo**: Redirige a `https://bakano.ec`
- **Diseño Simple**: Interfaz minimalista para errores 404
- **Sin Dependencias**: No utiliza composables ni props

## Componentes por Categoría

### Componentes Globales (global/)

#### Header.vue

**Ubicación**: `src/components/global/Header.vue`

**Descripción**: Cabecera global de la aplicación.

**Características**:
- Navegación principal
- Logo de la aplicación
- Elementos de UI consistentes

#### Footer.vue

**Ubicación**: `src/components/global/Footer.vue`

**Descripción**: Pie de página global de la aplicación.

**Características**:
- Información de contacto
- Enlaces importantes
- Copyright y información legal

### Componentes Gastronómicos (gastronomic/)

#### BusinessInfoDisplay.vue

**Ubicación**: `src/components/gastronomic/BusinessInfoDisplay.vue`

**Descripción**: Componente para mostrar información del negocio gastronómico.

**Props Esperadas**:
```typescript
interface Props {
  business: Business
}
```

**Funcionalidades**:
- Muestra datos del negocio
- Información específica para sector gastronómico
- Integración con tipos de `Business`

#### MeetingScheduler.vue

**Ubicación**: `src/components/gastronomic/MeetingScheduler.vue`

**Descripción**: Componente para programar reuniones con clientes.

**Props Esperadas**:
```typescript
interface Props {
  clientId: string
  businessId: string
}
```

**Funcionalidades**:
- Programación de reuniones
- Integración con servicios de calendario
- Validación de disponibilidad
- Manejo de diferentes tipos de reunión

### Componentes Modales (modal/)

#### confirmCloseModal.vue

**Ubicación**: `src/components/modal/confirmCloseModal.vue`

**Descripción**: Modal de confirmación para cerrar procesos.

**Props Esperadas**:
```typescript
interface Props {
  isVisible: boolean
  title?: string
  message?: string
}
```

**Eventos Emitidos**:
- `confirm`: Cuando el usuario confirma
- `cancel`: Cuando el usuario cancela
- `close`: Cuando se cierra el modal

#### meetingDetails.vue

**Ubicación**: `src/components/modal/meetingDetails.vue`

**Descripción**: Modal para mostrar detalles de reuniones.

**Props Esperadas**:
```typescript
interface Props {
  meeting: IMeetingDetails
  isVisible: boolean
}
```

**Funcionalidades**:
- Muestra información completa de la reunión
- Enlaces de acceso a la reunión
- Información de contacto
- Opciones de modificación/cancelación

### Componentes Compartidos (shared/)

#### ActionCard.vue

**Ubicación**: `src/components/shared/ActionCard.vue`

**Descripción**: Tarjeta reutilizable para acciones.

**Props Esperadas**:
```typescript
interface Props {
  title: string
  description?: string
  icon?: string
  actionText?: string
  disabled?: boolean
}
```

**Eventos Emitidos**:
- `action`: Cuando se ejecuta la acción principal

#### OnboardingActionBar.vue

**Ubicación**: `src/components/shared/OnboardingActionBar.vue`

**Descripción**: Barra de acciones para el proceso de onboarding.

**Props Esperadas**:
```typescript
interface Props {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  canGoPrevious: boolean
}
```

**Eventos Emitidos**:
- `next`: Avanzar al siguiente paso
- `previous`: Retroceder al paso anterior
- `save`: Guardar progreso actual

### Componentes Wizard (wizards/)

#### OnboardingFormWizard.vue

**Ubicación**: `src/components/wizards/OnboardingFormWizard.vue`

**Descripción**: Wizard principal para el formulario de onboarding.

**Props Esperadas**:
```typescript
interface Props {
  businessData: Business
}
```

**Eventos Emitidos**:
- `form-completed`: Cuando se completa el formulario
- `step-changed`: Cuando cambia el paso actual
- `data-updated`: Cuando se actualizan los datos

**Composables Utilizados**:
- `useConsultancyForm`: Para validación y gestión del formulario

**Funcionalidades**:
- Formulario multi-paso
- Validación con Zod
- Subida de archivos
- Persistencia de datos
- Navegación entre pasos

### Componente Individual

#### onBoardingNextStep.vue

**Ubicación**: `src/components/onBoardingNextStep.vue`

**Descripción**: Componente para mostrar el siguiente paso en el onboarding.

**Props Esperadas**:
```typescript
interface Props {
  currentStep: string
  nextStep?: string
  progress?: number
}
```

**Funcionalidades**:
- Indicador de progreso
- Información del siguiente paso
- Navegación guiada

## Patrones de Desarrollo

### Estructura de Componente Típica

```vue
<template>
  <!-- Template con TypeScript en atributos -->
  <div class="component-name">
    <!-- Contenido -->
  </div>
</template>

<script setup lang="ts">
// Imports
import { ref, computed, onMounted } from 'vue'
import type { ComponentProps } from '@/types/component'

// Props
interface Props {
  // Definición de props
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'event-name', payload: any): void
}

const emit = defineEmits<Emits>()

// Composables
const { data, loading } = useComposable()

// Reactive data
const localState = ref()

// Computed
const computedValue = computed(() => {
  // lógica
})

// Methods
const handleAction = () => {
  // lógica
  emit('event-name', data)
}

// Lifecycle
onMounted(() => {
  // inicialización
})
</script>

<style lang="scss" scoped>
.component-name {
  // estilos específicos del componente
}
</style>
```

### Convenciones de Nomenclatura

1. **Archivos**: PascalCase para componentes (`BusinessInfoDisplay.vue`)
2. **Clases CSS**: kebab-case (`.business-info-display`)
3. **Props**: camelCase (`businessData`)
4. **Eventos**: kebab-case (`form-completed`)
5. **Composables**: camelCase con prefijo `use` (`useBusinessOnboarding`)

### Gestión de Estado

#### Props vs Composables

- **Props**: Para datos que vienen del componente padre
- **Composables**: Para lógica de negocio y estado compartido
- **Reactive**: Para estado local del componente

#### Ejemplo de Uso de Composables

```vue
<script setup lang="ts">
import { useBusinessOnboarding } from '@/composables/useBusinessOnboarding'

interface Props {
  userId: string
  businessId: string
}

const props = defineProps<Props>()

const {
  businessData,
  isLoading,
  businessNotFound,
  serverError,
  fetchBusinessData
} = useBusinessOnboarding(props)

// El composable maneja toda la lógica de negocio
</script>
```

### Comunicación Entre Componentes

#### Padre a Hijo (Props)

```vue
<!-- Componente Padre -->
<template>
  <ChildComponent 
    :business-data="businessData" 
    :loading="isLoading" 
  />
</template>

<!-- Componente Hijo -->
<script setup lang="ts">
interface Props {
  businessData: Business
  loading: boolean
}

const props = defineProps<Props>()
</script>
```

#### Hijo a Padre (Eventos)

```vue
<!-- Componente Hijo -->
<script setup lang="ts">
interface Emits {
  (e: 'form-completed', data: FormData): void
  (e: 'step-changed', step: number): void
}

const emit = defineEmits<Emits>()

const handleSubmit = (data: FormData) => {
  emit('form-completed', data)
}
</script>

<!-- Componente Padre -->
<template>
  <ChildComponent 
    @form-completed="handleFormCompleted"
    @step-changed="handleStepChanged"
  />
</template>
```

### Manejo de Errores

#### Template con Estados de Error

```vue
<template>
  <div class="component">
    <div v-if="loading" class="loading">
      Cargando...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error.message }}
    </div>
    
    <div v-else class="content">
      <!-- Contenido principal -->
    </div>
  </div>
</template>
```

### Estilos y CSS

#### Uso de SCSS

```vue
<style lang="scss" scoped>
.component-name {
  // Variables locales
  $primary-color: #007bff;
  
  // Estilos del componente
  padding: 1rem;
  background-color: $primary-color;
  
  // Anidación
  .child-element {
    margin: 0.5rem 0;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  // Media queries
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
}
</style>
```

#### Clases Globales

```vue
<style lang="scss">
// Estilos globales (sin scoped)
.global-utility-class {
  // estilos que se aplican globalmente
}
</style>
```

## Consideraciones de Rendimiento

### Lazy Loading de Componentes

```typescript
// En router o componente padre
const LazyComponent = defineAsyncComponent(() => import('@/components/HeavyComponent.vue'))
```

### Optimización de Re-renders

```vue
<script setup lang="ts">
import { computed, toRefs } from 'vue'

const props = defineProps<Props>()

// Usar toRefs para mantener reactividad sin re-renders innecesarios
const { businessData } = toRefs(props)

// Computed para valores derivados
const displayName = computed(() => 
  businessData.value?.name || 'Sin nombre'
)
</script>
```

### Directivas v-memo para Listas

```vue
<template>
  <div 
    v-for="item in items" 
    :key="item.id"
    v-memo="[item.id, item.updatedAt]"
  >
    <!-- Contenido que solo se re-renderiza si cambian id o updatedAt -->
  </div>
</template>
```

Esta documentación refleja la estructura y patrones de componentes utilizados en el proyecto actual.