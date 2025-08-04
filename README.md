# Bakano Welcome Online Vue

> Aplicación web para el proceso de onboarding de clientes de Bakano

Aplicación desarrollada en Vue 3 con TypeScript que gestiona el proceso de onboarding para clientes de Bakano. Permite a los usuarios completar formularios de información empresarial y programar reuniones con consultores especializados.

## 🚀 Características

- **Onboarding Dinámico**: Formularios adaptativos según el tipo de negocio
- **Validación Robusta**: Esquemas de validación con Zod y Vee-Validate
- **Programación de Reuniones**: Integración con servicios de calendario externos
- **Gestión de Archivos**: Subida y gestión de documentos empresariales
- **Responsive Design**: Interfaz adaptativa para todos los dispositivos

## 🛠️ Stack Tecnológico

- **Framework**: Vue 3 (Composition API)
- **Lenguaje**: TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **Estado**: Pinia
- **HTTP Client**: Axios
- **Validación**: Vee-Validate + Zod
- **Estilos**: SCSS

## 📋 Requisitos Previos

- Node.js 18+ 
- pnpm (recomendado) o npm

## 🔧 Configuración del Proyecto

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd bakano-welcome-online-vue

# Instalar dependencias
pnpm install
```

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
VITE_BAKANO_API=https://api.bakano.ec
```

### Desarrollo

```bash
# Servidor de desarrollo con hot-reload
pnpm dev

# Verificar tipos TypeScript
pnpm type-check
```

### Producción

```bash
# Construir para producción
pnpm build

# Previsualizar build de producción
pnpm preview
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes Vue reutilizables
│   ├── gastronomic/    # Componentes específicos gastronómicos
│   ├── global/         # Componentes globales (Header, Footer)
│   ├── modal/          # Componentes modales
│   ├── shared/         # Componentes compartidos
│   └── wizards/        # Componentes de formularios multi-paso
├── composables/         # Lógica reutilizable de Vue
├── services/           # Servicios de API
├── types/              # Definiciones TypeScript
├── stores/             # Stores de Pinia
├── router/             # Configuración de rutas
└── views/              # Páginas principales
```

## 🌐 Rutas Principales

- `/` - Redirección a sitio principal de Bakano
- `/onboarding/:userId/:businessId` - Proceso de onboarding
- `/*` - Página 404

## 📚 Documentación

Para documentación técnica detallada, consultar:

- **[Documentación Principal](./DOCUMENTATION.md)** - Visión general y arquitectura
- **[Documentación Técnica](./docs/)** - Guías detalladas por módulo

### Guías Específicas

- [Servicios API](./docs/API_SERVICES.md)
- [Composables](./docs/COMPOSABLES.md)
- [Tipos e Interfaces](./docs/TYPES_INTERFACES.md)
- [Componentes](./docs/COMPONENTS.md)
- [Routing](./docs/ROUTING.md)
- [Configuración](./docs/PROJECT_CONFIGURATION.md)

## 🔧 Configuración del IDE

### VS Code (Recomendado)

Extensiones recomendadas:
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Soporte Vue 3
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

**Nota**: Deshabilitar Vetur si está instalado.

### Configuración TypeScript

El proyecto utiliza `vue-tsc` para verificación de tipos en archivos `.vue`. Volar es necesario para que el servicio de lenguaje TypeScript reconozca los tipos de Vue.

## 🚀 Deployment

### Build de Producción

```bash
# Construir aplicación
pnpm build

# Los archivos se generan en dist/
# Subir contenido de dist/ al servidor web
```

### Configuración del Servidor

- **SPA**: Configurar fallback a `index.html` para todas las rutas
- **HTTPS**: Requerido para producción
- **Headers**: Configurar headers de cache apropiados

## 🤝 Contribución

1. Revisar la documentación técnica antes de realizar cambios
2. Seguir las convenciones de código establecidas
3. Verificar tipos TypeScript con `pnpm type-check`
4. Actualizar documentación si es necesario

## 📄 Licencia

Este proyecto es propiedad de Bakano y está destinado para uso interno.

---

**Desarrollado con ❤️ para Bakano**
