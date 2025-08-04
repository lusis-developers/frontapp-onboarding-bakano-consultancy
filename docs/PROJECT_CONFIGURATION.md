# Configuración del Proyecto - Documentación Técnica

## Descripción General

Este documento detalla la configuración completa del proyecto `bakano-welcome-online-vue`, incluyendo herramientas de desarrollo, dependencias, scripts y configuraciones específicas.

## Información del Proyecto

### package.json

```json
{
  "name": "bakano-welcome-online-vue",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vue-tsc && vite build",
    "dev": "vite",
    "preview": "vite preview",
    "type-check": "vue-tsc --build --force"
  }
}
```

#### Metadatos del Proyecto
- **Nombre**: `bakano-welcome-online-vue`
- **Versión**: `0.0.0`
- **Tipo**: `module` (ES Modules)
- **Privado**: `true` (no se publica en npm)

## Dependencias

### Dependencias de Producción

```json
"dependencies": {
  "axios": "^1.7.7",
  "pinia": "^2.1.7",
  "vee-validate": "^4.13.2",
  "vue": "^3.4.29",
  "vue-router": "^4.3.3",
  "zod": "^3.23.8"
}
```

#### Descripción de Dependencias

##### Vue Ecosystem
- **vue** (`^3.4.29`): Framework principal de Vue 3
- **vue-router** (`^4.3.3`): Router oficial para Vue 3
- **pinia** (`^2.1.7`): Store de estado oficial para Vue 3

##### HTTP y Validación
- **axios** (`^1.7.7`): Cliente HTTP para realizar peticiones a APIs
- **vee-validate** (`^4.13.2`): Librería de validación de formularios para Vue
- **zod** (`^3.23.8`): Librería de validación y parsing de esquemas TypeScript

### Dependencias de Desarrollo

```json
"devDependencies": {
  "@vitejs/plugin-vue": "^5.0.5",
  "@vue/devtools": "^7.3.3",
  "@vue/tsconfig": "^0.5.1",
  "npm-run-all2": "^6.2.0",
  "sass": "^1.77.6",
  "typescript": "~5.4.0",
  "vite": "^5.3.1",
  "vue-tsc": "^2.0.21"
}
```

#### Descripción de DevDependencies

##### Build Tools
- **vite** (`^5.3.1`): Build tool y dev server rápido
- **@vitejs/plugin-vue** (`^5.0.5`): Plugin de Vite para Vue 3
- **vue-tsc** (`^2.0.21`): Type checker para Vue con TypeScript

##### TypeScript
- **typescript** (`~5.4.0`): Compilador de TypeScript
- **@vue/tsconfig** (`^0.5.1`): Configuración base de TypeScript para Vue

##### Desarrollo
- **@vue/devtools** (`^7.3.3`): Vue DevTools para debugging
- **sass** (`^1.77.6`): Preprocesador CSS
- **npm-run-all2** (`^6.2.0`): Utilidad para ejecutar scripts npm en paralelo/secuencia

## Scripts NPM

### Scripts Disponibles

#### `npm run dev`
```bash
vite
```
- **Propósito**: Inicia el servidor de desarrollo
- **Puerto**: Por defecto 5173 (configurable)
- **Hot Reload**: Habilitado
- **TypeScript**: Compilación en tiempo real

#### `npm run build`
```bash
vue-tsc && vite build
```
- **Propósito**: Construye la aplicación para producción
- **Proceso**: 
  1. `vue-tsc`: Verifica tipos TypeScript
  2. `vite build`: Construye y optimiza la aplicación
- **Salida**: Directorio `dist/`

#### `npm run preview`
```bash
vite preview
```
- **Propósito**: Previsualiza la build de producción localmente
- **Requisito**: Ejecutar `npm run build` primero
- **Puerto**: Por defecto 4173

#### `npm run type-check`
```bash
vue-tsc --build --force
```
- **Propósito**: Verifica tipos TypeScript sin generar archivos
- **Flags**: 
  - `--build`: Modo de construcción incremental
  - `--force`: Fuerza la verificación completa

## Configuración de Vite

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import VueDevTools from '@vue/devtools'

export default defineConfig({
  plugins: [
    vue(),
    VueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/variables.scss";`
      }
    }
  }
})
```

#### Configuración Detallada

##### Plugins
- **vue()**: Plugin principal para soporte de Vue 3
- **VueDevTools()**: Integración con Vue DevTools

##### Alias de Resolución
- **@**: Apunta a `./src` para imports absolutos
- **Ejemplo**: `import Component from '@/components/Component.vue'`

##### Configuración CSS
- **Preprocesador**: SCSS habilitado
- **Variables Globales**: `@/assets/scss/variables.scss` importado automáticamente
- **Beneficio**: Variables SCSS disponibles en todos los componentes

## Configuración de TypeScript

### tsconfig.json (Inferido)

Basado en `@vue/tsconfig`, la configuración incluye:

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vite/client"]
  },
  "include": [
    "src/**/*",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

#### Características TypeScript
- **Target**: ES2020+
- **Module**: ESNext
- **Strict Mode**: Habilitado
- **Vue Support**: Tipos para archivos `.vue`
- **Path Mapping**: Alias `@` configurado

## Variables de Entorno

### .env

```bash
VITE_BAKANO_API=https://api.bakano.ec
```

#### Variables Disponibles

##### VITE_BAKANO_API
- **Tipo**: `string`
- **Descripción**: URL base de la API de Bakano
- **Uso**: Configuración de axios en `httpBase.ts`
- **Acceso**: `import.meta.env.VITE_BAKANO_API`

#### Convenciones de Variables de Entorno

1. **Prefijo**: Todas las variables deben empezar con `VITE_`
2. **Nomenclatura**: UPPER_SNAKE_CASE
3. **Tipos**: Todas son strings por defecto
4. **Archivos**: 
   - `.env`: Variables por defecto
   - `.env.local`: Variables locales (no versionadas)
   - `.env.production`: Variables de producción
   - `.env.development`: Variables de desarrollo

## Estructura de Directorios

```
bakano-welcome-online-vue/
├── public/                 # Archivos estáticos
├── src/
│   ├── anums/             # Enumeraciones
│   ├── assets/            # Recursos (SCSS, imágenes)
│   │   └── scss/          # Archivos SCSS
│   ├── components/        # Componentes Vue
│   │   ├── gastronomic/   # Componentes específicos gastronómicos
│   │   ├── global/        # Componentes globales
│   │   ├── modal/         # Componentes modales
│   │   ├── shared/        # Componentes compartidos
│   │   └── wizards/       # Componentes wizard
│   ├── composables/       # Composables de Vue
│   ├── constants/         # Constantes de la aplicación
│   ├── router/            # Configuración de rutas
│   ├── services/          # Servicios de API
│   ├── stores/            # Stores de Pinia
│   ├── types/             # Definiciones de tipos TypeScript
│   │   └── responses/     # Tipos de respuestas de API
│   ├── views/             # Páginas/Vistas principales
│   ├── App.vue            # Componente raíz
│   └── main.ts            # Punto de entrada
├── docs/                  # Documentación del proyecto
├── .env                   # Variables de entorno
├── .gitignore            # Archivos ignorados por Git
├── index.html            # Template HTML principal
├── package.json          # Configuración del proyecto
├── README.md             # Documentación básica
├── tsconfig.json         # Configuración TypeScript
└── vite.config.ts        # Configuración de Vite
```

## Configuración de Desarrollo

### Hot Module Replacement (HMR)

- **Habilitado**: Por defecto en Vite
- **Soporte**: Vue components, CSS, TypeScript
- **Preservación de Estado**: Componentes mantienen estado durante cambios

### Source Maps

- **Desarrollo**: Habilitados por defecto
- **Producción**: Configurables según necesidades
- **Debugging**: Facilita debugging en DevTools

### Optimizaciones de Desarrollo

```typescript
// vite.config.ts - Configuraciones adicionales posibles
export default defineConfig({
  // ...
  server: {
    port: 3000,           // Puerto personalizado
    open: true,           // Abrir navegador automáticamente
    cors: true,           // Habilitar CORS
    proxy: {              // Proxy para APIs
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    sourcemap: true,      // Source maps en producción
    minify: 'terser',     // Minificador
    target: 'es2015',     # Target de compatibilidad
    rollupOptions: {
      output: {
        manualChunks: {     // Code splitting manual
          vendor: ['vue', 'vue-router', 'pinia'],
          utils: ['axios', 'zod']
        }
      }
    }
  }
})
```

## Configuración de SCSS

### Estructura de Estilos

```
src/assets/scss/
├── main.scss              # Archivo principal
├── variables.scss         # Variables globales
├── mixins.scss           # Mixins reutilizables
├── base/                 # Estilos base
├── components/           # Estilos de componentes
├── layouts/              # Estilos de layouts
└── utilities/            # Clases utilitarias
```

### Variables SCSS (Ejemplo)

```scss
// variables.scss
$primary-color: #007bff;
$secondary-color: #6c757d;
$success-color: #28a745;
$danger-color: #dc3545;
$warning-color: #ffc107;
$info-color: #17a2b8;

$font-family-base: 'Helvetica Neue', Arial, sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

$border-radius: 0.375rem;
$box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);

$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

## Configuración de Linting y Formatting

### ESLint (Recomendado)

```json
// .eslintrc.js
module.exports = {
  extends: [
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    // Reglas personalizadas
  }
}
```

### Prettier (Recomendado)

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## Configuración de Git

### .gitignore

```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Environment variables
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime
*.pid
*.seed
*.pid.lock

# Coverage
coverage/
.nyc_output/

# Temporary
.tmp/
.temp/
```

## Comandos de Desarrollo Comunes

### Instalación

```bash
# Instalar dependencias
npm install

# Instalar dependencia específica
npm install <package-name>

# Instalar dependencia de desarrollo
npm install -D <package-name>
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Verificar tipos
npm run type-check

# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

### Debugging

```bash
# Verificar dependencias
npm list

# Verificar dependencias desactualizadas
npm outdated

# Limpiar cache
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## Consideraciones de Producción

### Build Optimization

1. **Tree Shaking**: Eliminación automática de código no utilizado
2. **Code Splitting**: División automática de código en chunks
3. **Asset Optimization**: Optimización de imágenes y recursos
4. **Minification**: Minificación de JavaScript y CSS

### Performance

1. **Lazy Loading**: Carga diferida de rutas y componentes
2. **Preloading**: Precarga de recursos críticos
3. **Caching**: Configuración de headers de cache
4. **Compression**: Compresión gzip/brotli

### Security

1. **Environment Variables**: No exponer secrets en variables VITE_
2. **CSP**: Configurar Content Security Policy
3. **HTTPS**: Usar HTTPS en producción
4. **Dependencies**: Mantener dependencias actualizadas

### Deployment

```bash
# Build para producción
npm run build

# Los archivos están en dist/
# Subir contenido de dist/ al servidor web
```

Esta documentación refleja la configuración actual del proyecto y las mejores prácticas recomendadas.