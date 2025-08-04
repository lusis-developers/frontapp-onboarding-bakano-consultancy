# Tipos e Interfaces - Documentación Técnica

## Descripción General

El proyecto utiliza TypeScript con interfaces y tipos bien definidos para garantizar la seguridad de tipos y mejorar la experiencia de desarrollo. Todos los tipos están organizados por dominio en el directorio `src/types/`.

## Estructura de Tipos

```
src/types/
├── business.ts              # Tipos relacionados con negocios
├── client.ts                # Tipos relacionados con clientes
├── meeting.ts               # Tipos relacionados con reuniones
└── responses/               # Tipos de respuestas de API
    └── IMeetingStatusResponse.ts
```

## Business Types (business.ts)

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

#### Descripción de Campos

##### Campos de Identificación
- **_id**: `string` - Identificador único del negocio en la base de datos
- **name**: `string` - Nombre del negocio
- **owner**: `string` - Propietario del negocio

##### Campos de Fechas
- **createdAt**: `Date` - Fecha de creación del registro
- **updatedAt**: `Date` - Fecha de última actualización

##### Campos de Negocio
- **vendePorWhatsapp**: `boolean` - Indica si el negocio vende a través de WhatsApp
- **desafioPrincipal**: `string` - Principal desafío que enfrenta el negocio
- **empleados**: `string` - Número de empleados (almacenado como string)
- **gananciaWhatsapp**: `string` - Ganancia obtenida por ventas de WhatsApp
- **ingresoAnual**: `string` - Ingreso anual del negocio
- **ingresoMensual**: `string` - Ingreso mensual del negocio
- **objetivoIdeal**: `string` - Objetivo ideal del negocio

##### Campos de Redes Sociales
- **instagram**: `string` - Cuenta de Instagram del negocio
- **tiktok**: `string` - Cuenta de TikTok del negocio

##### Campos de Proceso
- **onboardingStep**: `string` - Paso actual en el proceso de onboarding
- **meetingReminder1hSent**: `boolean` - Indica si se envió recordatorio de 1 hora
- **meetingReminder24hSent**: `boolean` - Indica si se envió recordatorio de 24 horas

##### Campos de Archivos (Opcionales)
- **menuRestaurantePath**: `string?` - Ruta del archivo del menú del restaurante
- **costoPorPlatoPath**: `string?` - Ruta del archivo de costo por plato
- **ventasMovimientosPath**: `string?` - Ruta del archivo de movimientos de ventas
- **ventasProductosPath**: `string?` - Ruta del archivo de ventas por productos
- **ventasClientePath**: `string?` - Ruta del archivo de ventas por cliente

## Client Types (client.ts)

### PaymentInfo Interface

```typescript
export interface PaymentInfo {
  preferredMethod: string
  lastPaymentDate: string | null
  cardType?: string
  cardInfo?: string
  bank?: string
}
```

#### Descripción de Campos
- **preferredMethod**: `string` - Método de pago preferido del cliente
- **lastPaymentDate**: `string | null` - Fecha del último pago (puede ser null)
- **cardType**: `string?` - Tipo de tarjeta (opcional)
- **cardInfo**: `string?` - Información de la tarjeta (opcional)
- **bank**: `string?` - Banco asociado (opcional)

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
```

#### Descripción de Campos

##### Campos de Identificación
- **_id**: `string` - Identificador único del cliente
- **name**: `string` - Nombre completo del cliente
- **email**: `string` - Dirección de correo electrónico
- **phone**: `string` - Número de teléfono

##### Campos de Ubicación
- **country**: `string` - País de residencia
- **city**: `string` - Ciudad de residencia

##### Campos Personales
- **dateOfBirth**: `string` - Fecha de nacimiento

##### Campos Relacionales
- **businesses**: `Business[]` - Array de negocios asociados al cliente
- **transactions**: `string[]` - Array de IDs de transacciones
- **paymentInfo**: `PaymentInfo` - Información de pago del cliente

## Meeting Types (meeting.ts)

### Imports
```typescript
import type { MeetingStatus, MeetingType } from '@/anums/meetingStatus.enum'
import type { Business } from './business'
import type { Client } from './client'
```

### IMeeting Interface

```typescript
export interface IMeeting {
  client?: string | Client
  business?: string | Business
  assignedTo: string
  status: MeetingStatus
  meetingType: MeetingType
  scheduledTime: Date
  endTime: Date
  meetingLink?: string
  source: string
  sourceId: string
  createdAt: Date
  attendeeEmail?: string
  attendeePhone?: string
}
```

#### Descripción de Campos

##### Campos de Relación
- **client**: `string | Client?` - Cliente asociado (ID o objeto completo, opcional)
- **business**: `string | Business?` - Negocio asociado (ID o objeto completo, opcional)
- **assignedTo**: `string` - Persona asignada a la reunión

##### Campos de Estado
- **status**: `MeetingStatus` - Estado actual de la reunión (enum)
- **meetingType**: `MeetingType` - Tipo de reunión (enum)

##### Campos de Tiempo
- **scheduledTime**: `Date` - Fecha y hora programada
- **endTime**: `Date` - Fecha y hora de finalización
- **createdAt**: `Date` - Fecha de creación del registro

##### Campos de Configuración
- **meetingLink**: `string?` - Enlace de la reunión (opcional)
- **source**: `string` - Fuente de la reunión
- **sourceId**: `string` - ID de la fuente

##### Campos de Contacto
- **attendeeEmail**: `string?` - Email del asistente (opcional)
- **attendeePhone**: `string?` - Teléfono del asistente (opcional)

## Response Types (responses/)

### IMeetingStatusResponse.ts

#### IMeetingDetails Interface

```typescript
export interface IMeetingDetails {
  id: string
  status: string
  meetingType: string
  assignedTo: string
  scheduledTime: string // Viene como string ISO
  meetingLink: string
}
```

##### Descripción de Campos
- **id**: `string` - Identificador único de la reunión
- **status**: `string` - Estado de la reunión como string
- **meetingType**: `string` - Tipo de reunión como string
- **assignedTo**: `string` - Persona asignada
- **scheduledTime**: `string` - Fecha programada en formato ISO string
- **meetingLink**: `string` - Enlace de la reunión

#### IMeetingStatusResponse Interface

```typescript
export interface IMeetingStatusResponse {
  hasScheduledMeeting: boolean
  meeting?: IMeetingDetails
  message?: string
}
```

##### Descripción de Campos
- **hasScheduledMeeting**: `boolean` - Indica si hay reunión programada
- **meeting**: `IMeetingDetails?` - Detalles de la reunión (opcional)
- **message**: `string?` - Mensaje adicional (opcional)

## Enums (anums/meetingStatus.enum.ts)

### MeetingStatus Enum

```typescript
export enum MeetingStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no-show',
  PENDING_SCHEDULE = 'pending-schedule',
}
```

#### Valores Disponibles
- **SCHEDULED**: `'scheduled'` - Reunión programada
- **COMPLETED**: `'completed'` - Reunión completada
- **CANCELLED**: `'cancelled'` - Reunión cancelada
- **NO_SHOW**: `'no-show'` - No se presentó a la reunión
- **PENDING_SCHEDULE**: `'pending-schedule'` - Pendiente de programar

### MeetingType Enum

```typescript
export enum MeetingType {
  PORTFOLIO_ACCESS = 'portfolio-access', // Reunión con Denisse
  DATA_STRATEGY = 'data-strategy', // Futura reunión con Luis
  FOLLOW_UP = 'follow-up',
}
```

#### Valores Disponibles
- **PORTFOLIO_ACCESS**: `'portfolio-access'` - Reunión de acceso a portafolio (con Denisse)
- **DATA_STRATEGY**: `'data-strategy'` - Reunión de estrategia de datos (con Luis)
- **FOLLOW_UP**: `'follow-up'` - Reunión de seguimiento

## Tipos de Composables

### OnboardingProps (useBusinessOnboarding)

```typescript
interface OnboardingProps {
  userId: string
  businessId: string
}
```

### IManager (useManagers)

```typescript
export interface IManager {
  _id?: string // El ID será asignado por la BBDD
  name: string
  email: string
  role: string
}
```

### FileStatus (useConsultancyForm)

```typescript
export interface FileStatus {
  name: string
  size: number
  uploaded: boolean
  file: File
}
```

## Patrones de Uso

### Importación de Tipos

```typescript
// Importar tipos específicos
import type { Business } from '@/types/business'
import type { Client, PaymentInfo } from '@/types/client'
import type { IMeeting } from '@/types/meeting'

// Importar enums
import { MeetingStatus, MeetingType } from '@/anums/meetingStatus.enum'

// Importar tipos de respuesta
import type { IMeetingStatusResponse } from '@/types/responses/IMeetingStatusResponse'
```

### Uso en Componentes

```typescript
<script setup lang="ts">
import type { Business } from '@/types/business'

interface Props {
  business: Business
}

const props = defineProps<Props>()
</script>
```

### Uso en Servicios

```typescript
import type { AxiosResponse } from 'axios'
import type { Client } from '@/types/client'
import type { IMeetingStatusResponse } from '@/types/responses/IMeetingStatusResponse'

class ClientService extends APIBase {
  async getClientAndBusiness(clientId: string, businessId: string): Promise<AxiosResponse<{ client: Client }>> {
    return this.get<{ client: Client }>(`client/${clientId}/business/${businessId}`)
  }

  async getClientMeetingStatus(clientId: string, businessId?: string): Promise<AxiosResponse<IMeetingStatusResponse>> {
    // Implementation
  }
}
```

### Uso en Composables

```typescript
import { ref, type Ref } from 'vue'
import type { Business } from '@/types/business'

export function useBusinessOnboarding(props: OnboardingProps) {
  const businessData: Ref<Business | null> = ref(null)
  const isLoading: Ref<boolean> = ref(true)
  
  // Implementation
}
```

## Consideraciones de Desarrollo

### Convenciones de Nomenclatura

1. **Interfaces**: PascalCase con prefijo `I` para interfaces de respuesta (`IMeetingStatusResponse`)
2. **Types**: PascalCase para tipos de dominio (`Business`, `Client`)
3. **Enums**: PascalCase con valores en UPPER_SNAKE_CASE
4. **Campos**: camelCase para propiedades de objetos

### Campos Opcionales

- Usar `?` para campos opcionales: `meetingLink?: string`
- Usar union types para valores que pueden ser null: `lastPaymentDate: string | null`

### Relaciones

- Los campos relacionales pueden ser IDs (string) u objetos completos
- Ejemplo: `client?: string | Client`

### Fechas

- Usar `Date` para fechas en interfaces de dominio
- Usar `string` para fechas en respuestas de API (formato ISO)

### Extensibilidad

Para añadir nuevos tipos:

1. Crear archivo en `src/types/` siguiendo la convención de nomenclatura
2. Exportar interfaces y tipos
3. Documentar todos los campos
4. Importar donde sea necesario

```typescript
// src/types/newDomain.ts
export interface NewEntity {
  _id: string
  name: string
  // otros campos
}

export type NewEntityStatus = 'active' | 'inactive' | 'pending'
```

Esta documentación refleja todos los tipos e interfaces definidos en el código fuente actual del proyecto.