# Composables - Documentación Técnica

## Descripción General

Los composables en el proyecto Bakano Welcome Online Vue implementan la lógica reutilizable siguiendo el patrón de Composition API de Vue 3. Cada composable encapsula funcionalidad específica del dominio y proporciona reactividad y gestión de estado.

## useBusinessOnboarding

### Ubicación
`src/composables/useBusinessOnboarding.ts`

### Propósito
Gestiona toda la lógica de estado y datos para el proceso de onboarding de negocios.

### Interfaz de Props
```typescript
interface OnboardingProps {
  userId: string
  businessId: string
}
```

### Función Principal
```typescript
export function useBusinessOnboarding(props: OnboardingProps)
```

### Estados Reactivos Retornados

#### businessData
- **Tipo**: `Ref<Business | null>`
- **Descripción**: Datos del negocio obtenidos de la API
- **Estado inicial**: `null`

#### isLoading
- **Tipo**: `Ref<boolean>`
- **Descripción**: Indica si hay una operación de carga en progreso
- **Estado inicial**: `true`

#### businessNotFound
- **Tipo**: `Ref<boolean>`
- **Descripción**: Indica si el negocio no fue encontrado (error 404)
- **Estado inicial**: `false`

#### serverError
- **Tipo**: `Ref<string | null>`
- **Descripción**: Mensaje de error del servidor
- **Estado inicial**: `null`

#### isAlreadySubmitted
- **Tipo**: `ComputedRef<boolean>`
- **Descripción**: Computed que determina si el formulario ya fue enviado
- **Lógica**: Basado en `businessData.value?.onboardingStep`

### Funciones Retornadas

#### refetch
```typescript
const refetch = async (): Promise<void>
```
- **Propósito**: Recarga los datos del negocio desde la API
- **Uso**: Llamar después de enviar formularios para actualizar el estado

### Función Interna

#### fetchBusinessData
```typescript
async function fetchBusinessData(
  props: OnboardingProps,
  businessDataRef: Ref<Business | null>,
  notFoundRef: Ref<boolean>,
  serverErrorRef: Ref<string | null>,
)
```

**Lógica de la función**:
1. Llama a `clientService.getClientAndBusiness()`
2. Busca el negocio específico en la lista de negocios del cliente
3. Actualiza los estados reactivos según el resultado
4. Maneja errores 404 y otros errores del servidor

### Ciclo de Vida
- **onMounted**: Ejecuta `fetchBusinessData` automáticamente al montar el componente

### Ejemplo de Uso
```typescript
import { useBusinessOnboarding } from '@/composables/useBusinessOnboarding'

const routeParams = computed(() => ({
  userId: route.params.userId as string,
  businessId: route.params.businessId as string,
}))

const {
  isLoading,
  businessData,
  businessNotFound,
  serverError,
  isAlreadySubmitted,
  refetch
} = useBusinessOnboarding(routeParams.value)

// Después de enviar un formulario
const handleFormCompletion = async () => {
  await refetch()
}
```

## useConsultancyForm

### Ubicación
`src/composables/useConsultancyForm.ts`

### Propósito
Maneja la validación y envío de formularios de consultoría con soporte para archivos múltiples.

### Interfaces

#### FileStatus
```typescript
export interface FileStatus {
  name: string
  size: number
  uploaded: boolean
  file: File
}
```

### Esquema de Validación

#### Configuración de Archivos
```typescript
const MAX_MENU_FILES = 5
const multiFileSchema = z
  .array(z.instanceof(File))
  .min(1, 'Debes subir al menos un archivo para el menú.')
  .max(MAX_MENU_FILES, `No puedes subir más de ${MAX_MENU_FILES} archivos.`)
```

#### Esquema Base
```typescript
const baseSchema = z.object({
  instagram: z.string().min(1, 'Cuenta de Instagram es requerida'),
  tiktok: z.string().min(1, 'Cuenta de TikTok es requerida'),
  empleados: z.preprocess((v) => String(v), z.string().min(1, 'Número de empleados es requerido')),
  ingresoMensual: z.preprocess((v) => String(v), z.string().min(1, 'Ingreso mensual es requerido')),
  ingresoAnual: z.preprocess((v) => String(v), z.string().min(1, 'Ingreso anual es requerido')),
  vendePorWhatsapp: z.boolean().optional(),
  gananciaWhatsapp: z.preprocess((v) => String(v), z.string().optional()),
  desafioPrincipal: z.string().min(1, 'Desafío principal es requerido'),
  objetivoIdeal: z.string().min(1, 'Objetivo ideal es requerido'),
  menuRestaurante: multiFileSchema.optional(),
  costoPorPlato: z.instanceof(File).optional(),
  ventasMovimientos: z.instanceof(File).optional(),
  ventasProductos: z.instanceof(File).optional(),
  ventasCliente: z.instanceof(File).optional(),
  acceptsPolicies: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar las políticas para continuar.',
  }),
})
```

### Estados de Archivos

#### skippedFiles
```typescript
const skippedFiles = ref<Record<string, boolean>>({
  menuRestaurante: false,
  costoPorPlato: false,
  ventasMovimientos: false,
  ventasProductos: false,
  ventasCliente: false,
})
```

### Integración con Vee-Validate

El composable utiliza:
- **useForm** de Vee-Validate
- **toTypedSchema** para integración con Zod
- Validación en tiempo real
- Manejo de errores por campo

### Funcionalidades Principales

1. **Validación de Formularios**: Esquemas Zod con mensajes personalizados
2. **Carga de Archivos**: Soporte para archivos múltiples y únicos
3. **Archivos Opcionales**: Sistema de "skip" para archivos no obligatorios
4. **Preprocesamiento**: Conversión automática de tipos de datos
5. **Validación de Políticas**: Verificación obligatoria de aceptación

### Campos del Formulario

#### Campos de Texto
- `instagram`: Cuenta de Instagram (requerido)
- `tiktok`: Cuenta de TikTok (requerido)
- `desafioPrincipal`: Desafío principal del negocio (requerido)
- `objetivoIdeal`: Objetivo ideal del negocio (requerido)

#### Campos Numéricos
- `empleados`: Número de empleados (requerido, convertido a string)
- `ingresoMensual`: Ingreso mensual (requerido, convertido a string)
- `ingresoAnual`: Ingreso anual (requerido, convertido a string)
- `gananciaWhatsapp`: Ganancia por WhatsApp (opcional, convertido a string)

#### Campos Booleanos
- `vendePorWhatsapp`: Indica si vende por WhatsApp (opcional)
- `acceptsPolicies`: Aceptación de políticas (requerido, debe ser true)

#### Campos de Archivos
- `menuRestaurante`: Múltiples archivos del menú (máximo 5)
- `costoPorPlato`: Archivo de costo por plato (opcional)
- `ventasMovimientos`: Archivo de movimientos de ventas (opcional)
- `ventasProductos`: Archivo de ventas por productos (opcional)
- `ventasCliente`: Archivo de ventas por cliente (opcional)

## useManagers

### Ubicación
`src/composables/useManagers.ts`

### Propósito
Gestiona la lista de administradores de un negocio con operaciones CRUD.

### Interfaz de Manager
```typescript
export interface IManager {
  _id?: string // Asignado por la base de datos
  name: string
  email: string
  role: string
}
```

### Función Principal
```typescript
export function useManagers(businessId: Ref<string>)
```

### Estados Reactivos

#### managers
- **Tipo**: `Ref<IManager[]>`
- **Descripción**: Lista de administradores del negocio
- **Estado inicial**: `[]`

#### isLoading
- **Tipo**: `Ref<boolean>`
- **Descripción**: Indica si hay una operación en progreso
- **Estado inicial**: `false`

#### error
- **Tipo**: `Ref<string | null>`
- **Descripción**: Mensaje de error de las operaciones
- **Estado inicial**: `null`

### Funciones Disponibles

#### fetchManagers
```typescript
const fetchManagers = async (): Promise<void>
```
- **Propósito**: Carga la lista inicial de administradores
- **Endpoint**: `GET /business/{businessId}/managers`
- **Manejo de errores**: Actualiza el estado `error`

#### addManager
```typescript
const addManager = async (managerData: Omit<IManager, '_id'>): Promise<void>
```
- **Propósito**: Añade un nuevo administrador
- **Parámetros**: Datos del administrador sin ID
- **Endpoint**: `POST /business/{businessId}/managers`
- **Comportamiento**: Actualiza la lista local con la respuesta del servidor

#### removeManager
```typescript
const removeManager = async (managerId: string): Promise<void>
```
- **Propósito**: Elimina un administrador existente
- **Parámetros**: ID del administrador a eliminar
- **Endpoint**: `DELETE /business/{businessId}/managers/{managerId}`
- **Comportamiento**: Actualiza la lista local tras confirmación del servidor

### Ejemplo de Uso
```typescript
import { useManagers } from '@/composables/useManagers'

const businessId = ref('business-id-123')
const {
  managers,
  isLoading,
  error,
  fetchManagers,
  addManager,
  removeManager
} = useManagers(businessId)

// Cargar administradores al montar
onMounted(() => {
  fetchManagers()
})

// Añadir nuevo administrador
const handleAddManager = async () => {
  await addManager({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'Administrador'
  })
}

// Eliminar administrador
const handleRemoveManager = async (managerId: string) => {
  await removeManager(managerId)
}
```

## Patrones Comunes

### Manejo de Estados de Carga
Todos los composables siguen el patrón:
```typescript
const isLoading = ref(false)

const operation = async () => {
  isLoading.value = true
  try {
    // Operación
  } catch (error) {
    // Manejo de error
  } finally {
    isLoading.value = false
  }
}
```

### Manejo de Errores
```typescript
const error = ref<string | null>(null)

try {
  // Operación
  error.value = null // Limpiar error previo
} catch (err: any) {
  error.value = err.response?.data?.message || 'Error genérico'
  console.error(error.value)
}
```

### Reactividad con Props
```typescript
export function useComposable(props: ReactiveProps) {
  // Los props son reactivos y se actualizan automáticamente
  watch(() => props.businessId, (newId) => {
    if (newId) {
      fetchData()
    }
  })
}
```

## Consideraciones de Desarrollo

1. **Tipado Fuerte**: Todos los composables están completamente tipados
2. **Reactividad**: Estados reactivos que se actualizan automáticamente
3. **Reutilización**: Lógica encapsulada y reutilizable
4. **Separación de Responsabilidades**: Cada composable tiene un propósito específico
5. **Manejo de Errores**: Gestión consistente de errores en todas las operaciones
6. **Validación**: Integración con bibliotecas de validación modernas

Esta documentación refleja la implementación actual de los composables basada en el código fuente real del proyecto.