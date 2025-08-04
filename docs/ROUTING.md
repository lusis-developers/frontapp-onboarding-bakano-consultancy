# Routing - Documentación Técnica

## Descripción General

El proyecto utiliza Vue Router 4 para la gestión de rutas. La configuración está centralizada en `src/router/index.ts` y utiliza un enfoque simple con rutas estáticas y dinámicas.

## Configuración del Router

### Archivo Principal

**Ubicación**: `src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import onBoarding from '@/views/onBoarding.vue'
import notFound from '@/views/notFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'https://bakano.ec'
    },
    {
      path: '/onboarding/:userId/:businessId',
      name: 'onboarding',
      component: onBoarding,
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: notFound
    }
  ]
})

export default router
```

### Configuración de Historia

- **Modo**: `createWebHistory` - Utiliza HTML5 History API
- **Base URL**: `import.meta.env.BASE_URL` - URL base desde variables de entorno de Vite

## Rutas Definidas

### 1. Ruta Raíz (`/`)

```typescript
{
  path: '/',
  redirect: 'https://bakano.ec'
}
```

#### Características
- **Tipo**: Redirección externa
- **Destino**: `https://bakano.ec`
- **Propósito**: Redirigir usuarios que accedan a la raíz hacia el sitio principal de Bakano
- **Comportamiento**: Redirección inmediata sin cargar componente

### 2. Ruta de Onboarding (`/onboarding/:userId/:businessId`)

```typescript
{
  path: '/onboarding/:userId/:businessId',
  name: 'onboarding',
  component: onBoarding,
  props: true
}
```

#### Características
- **Tipo**: Ruta dinámica con parámetros
- **Nombre**: `onboarding`
- **Componente**: `onBoarding.vue`
- **Props**: `true` - Los parámetros de ruta se pasan como props al componente

#### Parámetros de Ruta

##### `:userId`
- **Tipo**: `string`
- **Descripción**: Identificador único del cliente
- **Requerido**: Sí
- **Ejemplo**: `/onboarding/64a1b2c3d4e5f6789012345a/64b2c3d4e5f6789012345b6c`

##### `:businessId`
- **Tipo**: `string`
- **Descripción**: Identificador único del negocio
- **Requerido**: Sí
- **Ejemplo**: `/onboarding/64a1b2c3d4e5f6789012345a/64b2c3d4e5f6789012345b6c`

#### Uso en Componente

```vue
<!-- onBoarding.vue -->
<script setup lang="ts">
interface Props {
  userId: string
  businessId: string
}

const props = defineProps<Props>()

// Los parámetros están disponibles directamente como props
console.log(props.userId)    // '64a1b2c3d4e5f6789012345a'
console.log(props.businessId) // '64b2c3d4e5f6789012345b6c'
</script>
```

### 3. Ruta 404 (`/:pathMatch(.*)*`)

```typescript
{
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: notFound
}
```

#### Características
- **Tipo**: Catch-all route (captura todas las rutas no definidas)
- **Nombre**: `notFound`
- **Componente**: `notFound.vue`
- **Patrón**: `/:pathMatch(.*)*` - Captura cualquier ruta no coincidente
- **Propósito**: Mostrar página de error 404

## Navegación Programática

### Usando useRouter

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// Navegar a onboarding
const navigateToOnboarding = (userId: string, businessId: string) => {
  router.push({
    name: 'onboarding',
    params: { userId, businessId }
  })
}

// Navegar con path
const navigateWithPath = (userId: string, businessId: string) => {
  router.push(`/onboarding/${userId}/${businessId}`)
}

// Redirección externa
const redirectToMain = () => {
  window.location.href = 'https://bakano.ec'
}
```

### Usando RouterLink

```vue
<template>
  <!-- Navegación con nombre de ruta -->
  <RouterLink 
    :to="{ 
      name: 'onboarding', 
      params: { userId: '123', businessId: '456' } 
    }"
  >
    Ir a Onboarding
  </RouterLink>
  
  <!-- Navegación con path -->
  <RouterLink :to="`/onboarding/${userId}/${businessId}`">
    Ir a Onboarding
  </RouterLink>
  
  <!-- Enlace externo -->
  <a href="https://bakano.ec" target="_blank">
    Ir a Bakano
  </a>
</template>
```

## Acceso a Parámetros de Ruta

### En Composition API

```typescript
import { useRoute } from 'vue-router'

const route = useRoute()

// Acceder a parámetros
const userId = route.params.userId as string
const businessId = route.params.businessId as string

// Acceder a query parameters
const step = route.query.step as string

// Acceder a hash
const section = route.hash

// Ruta completa
const fullPath = route.fullPath
const path = route.path
const name = route.name
```

### Reactivo a Cambios de Ruta

```typescript
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Observar cambios en parámetros
watch(
  () => route.params,
  (newParams, oldParams) => {
    console.log('Parámetros cambiaron:', newParams)
    // Recargar datos si es necesario
  },
  { deep: true }
)

// Observar cambios en query
watch(
  () => route.query,
  (newQuery) => {
    console.log('Query cambió:', newQuery)
  }
)
```

## Guardias de Navegación

### Guardias Globales (No implementadas actualmente)

```typescript
// Ejemplo de cómo se podrían implementar
router.beforeEach((to, from, next) => {
  // Validación de autenticación
  if (to.name === 'onboarding') {
    // Validar que userId y businessId sean válidos
    const { userId, businessId } = to.params
    
    if (!userId || !businessId) {
      next({ name: 'notFound' })
      return
    }
    
    // Validar formato de IDs (MongoDB ObjectId)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/
    if (!objectIdRegex.test(userId as string) || !objectIdRegex.test(businessId as string)) {
      next({ name: 'notFound' })
      return
    }
  }
  
  next()
})
```

### Guardias de Componente

```vue
<!-- onBoarding.vue -->
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Antes de salir de la ruta
onBeforeRouteLeave((to, from) => {
  // Confirmar si hay cambios sin guardar
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
    )
    if (!answer) return false
  }
})

// Cuando la ruta se actualiza (misma ruta, diferentes parámetros)
onBeforeRouteUpdate((to, from) => {
  // Actualizar datos cuando cambien los parámetros
  const { userId, businessId } = to.params
  fetchBusinessData(userId as string, businessId as string)
})
</script>
```

## Manejo de Errores de Navegación

### Errores de Navegación

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateWithErrorHandling = async (userId: string, businessId: string) => {
  try {
    await router.push({
      name: 'onboarding',
      params: { userId, businessId }
    })
  } catch (error) {
    console.error('Error de navegación:', error)
    // Manejar error de navegación
  }
}
```

### Validación de Parámetros

```typescript
// En el componente onBoarding.vue
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Validar parámetros
const isValidParams = computed(() => {
  const { userId, businessId } = route.params
  const objectIdRegex = /^[0-9a-fA-F]{24}$/
  
  return (
    typeof userId === 'string' && 
    typeof businessId === 'string' &&
    objectIdRegex.test(userId) && 
    objectIdRegex.test(businessId)
  )
})

// Redirigir si parámetros no son válidos
watchEffect(() => {
  if (!isValidParams.value) {
    router.replace({ name: 'notFound' })
  }
})
```

## Query Parameters y Hash

### Uso de Query Parameters

```typescript
// Navegar con query parameters
router.push({
  name: 'onboarding',
  params: { userId: '123', businessId: '456' },
  query: { step: '2', section: 'business-info' }
})

// URL resultante: /onboarding/123/456?step=2&section=business-info

// Acceder a query parameters
const currentStep = computed(() => route.query.step as string || '1')
const currentSection = computed(() => route.query.section as string)
```

### Uso de Hash

```typescript
// Navegar con hash
router.push({
  name: 'onboarding',
  params: { userId: '123', businessId: '456' },
  hash: '#meeting-section'
})

// URL resultante: /onboarding/123/456#meeting-section
```

## Integración con Vite

### Variables de Entorno

```typescript
// vite.config.ts
export default defineConfig({
  // ...
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})

// En router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // ...
})
```

### Configuración de Base URL

```bash
# .env
VITE_BASE_URL=/app/

# .env.production
VITE_BASE_URL=/production-app/
```

## Consideraciones de SEO

### Meta Tags Dinámicos

```vue
<!-- onBoarding.vue -->
<script setup lang="ts">
import { useHead } from '@vueuse/head' // Si se usa

const props = defineProps<Props>()

// Actualizar título dinámicamente
watchEffect(() => {
  if (businessData.value) {
    document.title = `Onboarding - ${businessData.value.name} | Bakano`
  }
})

// Meta description
watchEffect(() => {
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && businessData.value) {
    metaDescription.setAttribute(
      'content', 
      `Completa el proceso de onboarding para ${businessData.value.name}`
    )
  }
})
</script>
```

### Preload de Rutas

```typescript
// Preload de componentes para mejorar rendimiento
const onBoarding = () => import('@/views/onBoarding.vue')
const notFound = () => import('@/views/notFound.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/onboarding/:userId/:businessId',
      name: 'onboarding',
      component: onBoarding, // Lazy loading
      props: true
    }
    // ...
  ]
})
```

## Patrones de Uso Comunes

### Navegación Condicional

```vue
<template>
  <div>
    <!-- Mostrar botón solo si hay datos válidos -->
    <button 
      v-if="canNavigate" 
      @click="goToNextStep"
    >
      Continuar
    </button>
  </div>
</template>

<script setup lang="ts">
const canNavigate = computed(() => {
  return props.userId && props.businessId && formIsValid.value
})

const goToNextStep = () => {
  router.push({
    name: 'onboarding',
    params: { userId: props.userId, businessId: props.businessId },
    query: { step: String(currentStep.value + 1) }
  })
}
</script>
```

### Breadcrumbs

```vue
<template>
  <nav class="breadcrumbs">
    <RouterLink to="/">Inicio</RouterLink>
    <span class="separator">></span>
    <span class="current">Onboarding</span>
  </nav>
</template>
```

### Manejo de Estado de Navegación

```typescript
// Composable para estado de navegación
export function useNavigation() {
  const router = useRouter()
  const route = useRoute()
  
  const isNavigating = ref(false)
  
  const navigateTo = async (to: RouteLocationRaw) => {
    isNavigating.value = true
    try {
      await router.push(to)
    } catch (error) {
      console.error('Error de navegación:', error)
    } finally {
      isNavigating.value = false
    }
  }
  
  return {
    route,
    router,
    isNavigating,
    navigateTo
  }
}
```

Esta documentación refleja la configuración actual del router y los patrones de navegación utilizados en el proyecto.