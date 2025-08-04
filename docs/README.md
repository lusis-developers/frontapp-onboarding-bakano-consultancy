# Bakano Welcome Online Vue - Documentación Técnica

## Descripción General

**bakano-welcome-online-vue** es una aplicación web desarrollada en Vue 3 con TypeScript que funciona como plataforma de onboarding para clientes de Bakano. La aplicación permite a los usuarios completar formularios de consultoría, programar reuniones y gestionar información de negocios gastronómicos.

## Información del Proyecto

- **Nombre**: bakano-welcome-online-vue
- **Versión**: 0.0.0
- **Tipo**: Módulo ES6
- **Framework**: Vue 3.5.13
- **Lenguaje**: TypeScript
- **Bundler**: Vite 6.2.4

## Tecnologías Utilizadas

### Frontend
- **Vue 3.5.13** - Framework principal
- **TypeScript 5.8.0** - Tipado estático
- **Vue Router 4.5.0** - Enrutamiento
- **Pinia 3.0.1** - Gestión de estado
- **Vite 6.2.4** - Build tool y dev server
- **SCSS/Sass 1.89.1** - Preprocesador CSS

### Validación y Formularios
- **Vee-Validate 4.15.0** - Validación de formularios
- **@vee-validate/zod 4.15.0** - Integración con Zod
- **Zod 3.25.51** - Esquemas de validación

### HTTP y API
- **Axios 1.9.0** - Cliente HTTP

### Herramientas de Desarrollo
- **Vue DevTools** - Debugging
- **Prettier 3.5.3** - Formateo de código
- **vue-tsc 2.2.8** - Type checking para Vue

## Variables de Entorno

### Archivo .env
```
VITE_BAKANO_API
```

**Descripción**: URL base de la API de Bakano. Si no se define, usa `http://localhost:8100/api` por defecto.

## Estructura del Proyecto

```
src/
├── App.vue                 # Componente raíz
├── main.ts                 # Punto de entrada
├── anums/                  # Enumeraciones
│   └── meetingStatus.enum.ts
├── assets/                 # Recursos estáticos
│   └── logos/
├── components/             # Componentes Vue
│   ├── gastronomic/       # Componentes específicos del sector gastronómico
│   ├── global/            # Componentes globales (Header, Footer)
│   ├── modal/             # Componentes de modales
│   ├── shared/            # Componentes compartidos
│   └── wizards/           # Componentes de formularios paso a paso
├── composables/           # Lógica reutilizable de Vue
│   ├── useBusinessOnboarding.ts
│   ├── useConsultancyForm.ts
│   └── useManagers.ts
├── constants/             # Constantes de la aplicación
│   └── links.contant.ts
├── forms/                 # Componentes de formulario
│   ├── CurrencyInput.vue
│   ├── FileUploadItem.vue
│   └── IntegerInput.vue
├── router/                # Configuración de rutas
│   └── index.ts
├── services/              # Servicios de API
│   ├── clientService.service.ts
│   ├── consultancyService.ts
│   └── httpBase.ts
├── stores/                # Stores de Pinia
│   └── counter.ts
├── styles/                # Estilos globales
│   ├── colorVariables.module.scss
│   ├── fonts/
│   ├── fonts.modules.scss
│   ├── global.scss
│   └── index.scss
├── types/                 # Definiciones de tipos TypeScript
│   ├── business.ts
│   ├── client.ts
│   ├── meeting.ts
│   └── responses/
│       └── IMeetingStatusResponse.ts
└── views/                 # Páginas/Vistas
    ├── notFound.vue
    └── onBoarding.vue
```

## Configuración de Rutas

La aplicación utiliza Vue Router con las siguientes rutas:

### Rutas Definidas

1. **Ruta Raíz (`/`)**
   - **Nombre**: `root-redirect`
   - **Comportamiento**: Redirecciona automáticamente a `https://bakano.ec`
   - **Componente**: Componente en blanco

2. **Ruta de Onboarding (`/:userId/:businessId`)**
   - **Nombre**: `onboarding`
   - **Componente**: `OnBoarding.vue`
   - **Props**: 
     - `userId` (string)
     - `businessId` (string)

3. **Ruta 404 (`/:catchAll(.*)*`)**
   - **Nombre**: `notFound`
   - **Componente**: `NotFound.vue`

## Tipos de Datos

### Business Interface
```typescript
export interface Business {
  _id: string
  name: string
  owner: string
  vendePorWhatsapp: boolean
  createdAt: Date
  updatedAt: Date
  desafioPrincipal: string
  empleados: string
  gananciaWhatsapp: string
  ingresoAnual: string
  ingresoMensual: string
  instagram: string
  meetingReminder1hSent: boolean
  meetingReminder24hSent: boolean
  objetivoIdeal: string
  onboardingStep: string
  tiktok: string
  menuRestaurantePath?: string
  costoPorPlatoPath?: string
  ventasMovimientosPath?: string
  ventasProductosPath?: string
  ventasClientePath?: string
}
```

### Client Interface
```typescript
export interface Client {
  _id: string
  name: string
  email: string
  phone: string
  country: string
  city: string
  dateOfBirth: string
  businesses: Business[]
  transactions: string[]
  paymentInfo: PaymentInfo
}

export interface PaymentInfo {
  preferredMethod: string
  lastPaymentDate: string | null
  cardType?: string
  cardInfo?: string
  bank?: string
}
```

### Meeting Enums
```typescript
export enum MeetingStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no-show',
  PENDING_SCHEDULE = 'pending-schedule',
}

export enum MeetingType {
  PORTFOLIO_ACCESS = 'portfolio-access', // Reunión con Denisse
  DATA_STRATEGY = 'data-strategy', // Futura reunión con Luis
  FOLLOW_UP = 'follow-up',
}
```

## Servicios de API

### APIBase (httpBase.ts)
Clase base que proporciona métodos HTTP comunes:
- **Constructor**: Configura la URL base desde `VITE_BAKANO_API`
- **Métodos**: `get`, `post`, `put`, `patch`, `delete`, `uploadFile`
- **Headers**: Manejo automático de headers con soporte para tokens de autorización
- **Error Handling**: Manejo centralizado de errores HTTP

### ClientService
Servicio para operaciones relacionadas con clientes:
- `getClientAndBusiness(clientId: string, businessId: string)`: Obtiene datos del cliente y negocio
- `getClientMeetingStatus(clientId: string, businessId?: string)`: Obtiene estado de reuniones

### ConsultancyService
Servicio para operaciones de consultoría:
- `submitConsultancyForm(businessId: string, data: FormData)`: Envía formulario de consultoría
- `getBusinessManagers(businessId: string)`: Obtiene administradores del negocio
- `addManagerToBusiness(businessId: string, managerData)`: Añade administrador
- `removeManagerFromBusiness(businessId: string, managerId: string)`: Elimina administrador

## Composables

### useBusinessOnboarding
**Propósito**: Gestiona la lógica de estado y datos para el proceso de onboarding.

**Parámetros**:
- `props: OnboardingProps` - Objeto con `userId` y `businessId`

**Funcionalidades**:
- Carga datos del negocio desde la API
- Manejo de estados de carga, error y datos no encontrados
- Función de recarga de datos
- Verificación de formularios ya enviados

### useConsultancyForm
**Propósito**: Maneja la validación y envío de formularios de consultoría.

**Características**:
- Validación con Zod y Vee-Validate
- Soporte para carga de archivos múltiples
- Gestión de archivos opcionales
- Validación de políticas de aceptación

### useManagers
**Propósito**: Gestiona la lista de administradores de un negocio.

**Funcionalidades**:
- Carga de administradores existentes
- Añadir nuevos administradores
- Eliminar administradores
- Estados de carga y error

## Constantes

### Links (links.contant.ts)
```typescript
export const DOCUMENTATION_URL = 'https://docs.google.com/document/d/1qKBVrwgns_f51CGF28_ZR2gf5jyY6qR2xz-iScfUao8/edit?tab=t.e2r6atdrbg2o'
export const CALENDLY_LINK = 'https://go.startfly.app/widget/bookings/meeting-tech-support'
export const MARKETING_MEETING_URL = 'https://go.startfly.app/widget/booking/aeOr41CGE77DzCcjD96Z'
export const DATA_STRATEGY_MEETING_URL = 'https://go.startfly.app/widget/booking/BIMx4yqxxREaV54bUObN'
```

## Scripts de NPM

```json
{
  "dev": "vite",                                    // Servidor de desarrollo
  "build": "run-p type-check \"build-only {@}\" --", // Build de producción con type checking
  "preview": "vite preview",                        // Preview del build
  "build-only": "vite build",                      // Build sin type checking
  "type-check": "vue-tsc --build",                 // Solo type checking
  "format": "prettier --write src/"                // Formateo de código
}
```

## Configuración de Vite

- **Plugins**: Vue, Vue DevTools
- **Alias**: `@` apunta a `./src`
- **CSS**: Soporte para SCSS
- **Dev Tools**: Habilitado en desarrollo

## Instalación y Uso

### Requisitos
- Node.js (versión compatible con Node 22)
- pnpm (gestor de paquetes recomendado)

### Instalación
```bash
pnpm install
```

### Desarrollo
```bash
pnpm dev
```

### Build de Producción
```bash
pnpm build
```

### Preview
```bash
pnpm preview
```

### Type Checking
```bash
pnpm type-check
```

### Formateo de Código
```bash
pnpm format
```

## Arquitectura de Componentes

### Componentes Principales

1. **App.vue**: Componente raíz con Header, RouterView y Footer
2. **onBoarding.vue**: Vista principal del proceso de onboarding
3. **notFound.vue**: Página 404 con redirección a bakano.ec

### Componentes por Categoría

- **Global**: Header, Footer
- **Gastronomic**: Componentes específicos del sector (HeroSection, VideoSection, BusinessInfoDisplay, MeetingScheduler)
- **Shared**: Componentes reutilizables (ActionCard, OnboardingActionBar, PageFeedback, TooltipIcon)
- **Modal**: Modales de confirmación y detalles de reuniones
- **Wizards**: Formularios paso a paso
- **Forms**: Inputs especializados (Currency, File Upload, Integer)

## Gestión de Estado

La aplicación utiliza **Pinia** como store de estado. Actualmente incluye:
- **counter.ts**: Store de ejemplo con contador básico

## Estilos

- **Preprocesador**: SCSS/Sass
- **Estructura**: Modular con variables de color y fuentes
- **Archivos principales**:
  - `global.scss`: Estilos globales
  - `colorVariables.module.scss`: Variables de color
  - `fonts.modules.scss`: Configuración de fuentes
  - `index.scss`: Punto de entrada de estilos

## Consideraciones de Desarrollo

1. **TypeScript**: Tipado estricto en toda la aplicación
2. **Composables**: Lógica reutilizable siguiendo el patrón de Composition API
3. **Validación**: Esquemas Zod para validación robusta de formularios
4. **Error Handling**: Manejo centralizado de errores en servicios
5. **Responsive**: Diseño adaptativo para diferentes dispositivos
6. **SEO**: Gestión dinámica del título de página

## Flujo de la Aplicación

1. **Entrada**: Usuario accede con URL `/:userId/:businessId`
2. **Carga de Datos**: Se obtienen datos del cliente y negocio
3. **Onboarding**: Usuario completa formularios y programa reuniones
4. **Validación**: Formularios validados con Zod/Vee-Validate
5. **Envío**: Datos enviados a la API de Bakano
6. **Confirmación**: Usuario recibe confirmación y próximos pasos

Esta documentación refleja el estado actual del código fuente sin asumir funcionalidades no implementadas.