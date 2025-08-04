# Servicios de API - Documentación Técnica

## Descripción General

Los servicios de API en el proyecto Bakano Welcome Online Vue están organizados en una arquitectura de capas que proporciona una abstracción limpia para las comunicaciones HTTP con el backend.

## Arquitectura de Servicios

### APIBase (httpBase.ts)

Clase base abstracta que proporciona funcionalidad HTTP común para todos los servicios.

#### Configuración
```typescript
class APIBase {
  private baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_BAKANO_API || 'http://localhost:8100/api'
  }
}
```

#### Métodos HTTP Disponibles

##### GET Request
```typescript
protected async get<T>(
  endpoint: string,
  headers?: { [key: string]: string }
): Promise<AxiosResponse<T>>
```

##### POST Request
```typescript
protected async post<T>(
  endpoint: string,
  data: unknown,
  headers?: { [key: string]: string }
): Promise<AxiosResponse<T>>
```

##### PUT Request
```typescript
protected async put<T>(
  endpoint: string,
  data: unknown
): Promise<AxiosResponse<T>>
```

##### PATCH Request
```typescript
protected async patch<T>(
  endpoint: string,
  data: unknown
): Promise<AxiosResponse<T>>
```

##### DELETE Request
```typescript
protected async delete<T>(
  endpoint: string
): Promise<AxiosResponse<T>>
```

##### File Upload
```typescript
protected async uploadFile<T>(
  endpoint: string,
  file: File
): Promise<AxiosResponse<T>>
```

#### Gestión de Headers

```typescript
protected getHeaders(): { [key: string]: string } {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    // TODO: create authorization token
    // headers['Authorization'] = `Bearer ${accessToken}`
  }

  return headers
}
```

**Nota**: La autorización por token está preparada pero comentada en el código actual.

#### Manejo de Errores

Todos los métodos HTTP incluyen manejo centralizado de errores:

```typescript
catch (error: unknown) {
  if (axios.isAxiosError(error) && error.response) {
    const errorDetails = {
      status: error.response.status,
      message: error.response.data?.message || error.message,
    }
    throw errorDetails
  }

  throw { status: 500, message: 'Unknown error' }
}
```

## ClientService

### Descripción
Servicio especializado para operaciones relacionadas con clientes y sus negocios.

### Métodos Disponibles

#### getClientAndBusiness
```typescript
async getClientAndBusiness(clientId: string, businessId: string)
```

**Propósito**: Obtiene información del cliente y su negocio específico.

**Parámetros**:
- `clientId` (string): ID único del cliente
- `businessId` (string): ID único del negocio

**Endpoint**: `GET /client/{clientId}/business/{businessId}`

**Respuesta**: 
```typescript
{
  client: Client
}
```

#### getClientMeetingStatus
```typescript
public async getClientMeetingStatus(
  clientId: string,
  businessId?: string,
): Promise<AxiosResponse<IMeetingStatusResponse>>
```

**Propósito**: Obtiene el estado de las reuniones programadas para un cliente.

**Parámetros**:
- `clientId` (string): ID único del cliente
- `businessId` (string, opcional): ID del negocio para filtrar reuniones

**Endpoint**: 
- Sin businessId: `GET /clients/{clientId}/meeting-status`
- Con businessId: `GET /clients/{clientId}/meeting-status?businessId={businessId}`

**Respuesta**: 
```typescript
interface IMeetingStatusResponse {
  hasScheduledMeeting: boolean
  meeting?: IMeetingDetails
  message?: string
}

interface IMeetingDetails {
  id: string
  status: string
  meetingType: string
  assignedTo: string
  scheduledTime: string // ISO string
  meetingLink: string
}
```

### Instancia del Servicio
```typescript
export const clientService = new ClientService()
```

## ConsultancyService

### Descripción
Servicio especializado para operaciones de consultoría y gestión de administradores de negocios.

### Métodos Disponibles

#### submitConsultancyForm
```typescript
async submitConsultancyForm(businessId: string, data: FormData)
```

**Propósito**: Envía los datos del formulario de consultoría.

**Parámetros**:
- `businessId` (string): ID único del negocio
- `data` (FormData): Datos del formulario incluyendo archivos

**Endpoint**: `POST /business/consultancy-data/{businessId}`

**Tipo de Contenido**: `multipart/form-data` (para soporte de archivos)

#### getBusinessManagers
```typescript
async getBusinessManagers(businessId: string)
```

**Propósito**: Obtiene la lista de administradores de un negocio.

**Parámetros**:
- `businessId` (string): ID único del negocio

**Endpoint**: `GET /business/{businessId}/managers`

**Respuesta**:
```typescript
{
  data: IManager[]
}

interface IManager {
  _id?: string
  name: string
  email: string
  role: string
}
```

#### addManagerToBusiness
```typescript
async addManagerToBusiness(businessId: string, managerData: Omit<IManager, '_id'>)
```

**Propósito**: Añade un nuevo administrador al negocio.

**Parámetros**:
- `businessId` (string): ID único del negocio
- `managerData` (Omit<IManager, '_id'>): Datos del administrador sin ID

**Endpoint**: `POST /business/{businessId}/managers`

**Respuesta**:
```typescript
{
  data: IManager[]
}
```

#### removeManagerFromBusiness
```typescript
async removeManagerFromBusiness(businessId: string, managerId: string)
```

**Propósito**: Elimina un administrador del negocio.

**Parámetros**:
- `businessId` (string): ID único del negocio
- `managerId` (string): ID único del administrador a eliminar

**Endpoint**: `DELETE /business/{businessId}/managers/{managerId}`

### Instancia del Servicio
```typescript
export const consultancyService = new ConsultancyService()
```

## Configuración de Variables de Entorno

### VITE_BAKANO_API

**Descripción**: URL base de la API de Bakano.

**Valor por defecto**: `http://localhost:8100/api`

**Uso**: Se configura en el constructor de `APIBase` y se utiliza para construir todas las URLs de endpoints.

**Ejemplo de configuración**:
```env
VITE_BAKANO_API=https://api.bakano.ec/v1
```

## Patrones de Uso

### En Composables
```typescript
import { clientService } from '@/services/clientService.service'

export function useBusinessOnboarding(props: OnboardingProps) {
  const fetchBusinessData = async () => {
    try {
      const response = await clientService.getClientAndBusiness(
        props.userId, 
        props.businessId
      )
      // Procesar respuesta
    } catch (error) {
      // Manejar error
    }
  }
}
```

### En Componentes
```typescript
import { consultancyService } from '@/services/consultancyService'

const submitForm = async (formData: FormData) => {
  try {
    await consultancyService.submitConsultancyForm(businessId.value, formData)
    // Éxito
  } catch (error) {
    // Error
  }
}
```

## Consideraciones de Seguridad

1. **Tokens de Autorización**: Preparado para implementar autenticación Bearer token
2. **Validación de Datos**: Los datos se validan en el frontend antes del envío
3. **Manejo de Errores**: Errores HTTP manejados de forma segura sin exponer información sensible
4. **HTTPS**: Recomendado para producción

## Extensibilidad

Para añadir nuevos servicios:

1. Crear nueva clase que extienda `APIBase`
2. Implementar métodos específicos del dominio
3. Exportar instancia del servicio
4. Documentar endpoints y tipos de respuesta

```typescript
import APIBase from './httpBase'

class NewService extends APIBase {
  async newMethod(param: string) {
    return this.get<ResponseType>(`new-endpoint/${param}`)
  }
}

export const newService = new NewService()
```

Esta documentación refleja la implementación actual de los servicios basada en el código fuente real del proyecto.