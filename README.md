![Resonance Banner](./public/resources/image.png)

# Resonance

Plataforma de síntesis de voz avanzada construida con tecnologías modernas. Ofrece una experiencia multi-tenant segura, autenticación empresarial y gestión de organizaciones para crear, gestionar y reproducir generaciones de audio/texto de alta calidad.

---

## Estado del Proyecto

**Versión:** 0.1.0 | **Estado:** En Desarrollo | **Última Actualización:** Marzo 2026

### Funcionalidades Implementadas

- ✓ Sistema de autenticación con Clerk (sign-in, sign-up, gestión de sesiones)
- ✓ Multi-tenancy con selección y gestión de organizaciones
- ✓ Middleware de protección de rutas
- ✓ Modelo de datos para voces y generaciones
- ✓ Interfaz de usuario responsive con Tailwind CSS
- ✓ Sistema de notificaciones en tiempo real
- ✓ Cliente Prisma optimizado

### Próximas Implementaciones

- Flujo completo de creación de generaciones
- Gestor de voces personalizadas
- Sistema de reproducción de audio
- Panel de análisis y estadísticas

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Framework** | Next.js | 16.2.2 |
| **Runtime** | React | 19.2.5 |
| **Lenguaje** | TypeScript | 5.9.3 |
| **Autenticación** | Clerk | 7.2.8 |
| **Base de Datos** | PostgreSQL | - |
| **ORM** | Prisma | 7.8.0 |
| **Estilos** | Tailwind CSS | 4.2.4 |
| **UI Components** | shadcn/ui, Base UI | - |
| **Notificaciones** | Sonner | 2.0.7 |
| **Validación** | Zod | 4.4.1 |
| **Forma** | React Hook Form | 7.74.0 |

---

## Requisitos Previos

- **Node.js:** 20.0.0 o superior
- **npm:** 10.0.0 o superior (recomendado)
- **PostgreSQL:** 12 o superior (accesible desde la aplicación)
- **Cuenta Clerk:** Para autenticación empresarial

---

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Base de Datos
DATABASE_URL="postgresql://usuario:contraseña@host:5432/nombre_base_datos"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/org-selection"
```

---

## Instalación y Configuración

### 1. Clonar Repositorio

```bash
git clone <repositorio-url>
cd resonance
```

### 2. Instalar Dependencias

```bash
npm install
# o
bun install
```

### 3. Configurar Base de Datos

```bash
# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
# Acceder en http://localhost:3000
```

---

### Estructura de Capas

```
┌─────────────────────────────────────┐
│   Presentación (React 19)           │
│  - Páginas (App Router)             │
│  - Componentes UI (shadcn/ui)       │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Capa de Negocio                   │
│  - Server Actions                   │
│  - Middlewares (Clerk)              │
│  - Hooks personalizados             │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Acceso a Datos (Prisma ORM)       │
│  - Cliente generado                 │
│  - Migraciones PostgreSQL           │
│  - Adapter para pg                  │
└─────────────────────────────────────┘
```

### Componentes Principales

**Frontend (`src/app`)**
- `(dashboard)`: Área protegida con dashboard principal
- `sign-in`, `sign-up`: Rutas públicas de autenticación
- `org-selection`: Selección de organización para nuevos usuarios
- `layout.tsx`: Provider de Clerk, toaster global y estilos

**Componentes Reutilizables (`src/components/ui`)**
- Librería base de 40+ componentes UI tipados
- Estilos con Tailwind CSS v4
- Accesibilidad WCAG 2.1

**Seguridad y Autenticación (`src/proxy.ts`)**
- Middleware de protección de rutas
- Validación de sesión
- Enrutamiento condicional basado en estado

**Persistencia (`prisma/`)**
- Schema normalizado con relaciones organizacionales
- Migraciones versionadas
- Adapter PostgreSQL optimizado

---

## Modelo de Datos

### Entidad: Voice

Representa una voz disponible en el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `String` (cuid) | Identificador único |
| `orgId` | `String` (optional) | Organización propietaria |
| `name` | `String` | Nombre descriptivo |
| `description` | `String` | Descripción detallada |
| `category` | `String` | Clasificación funcional |
| `language` | `String` | Código de idioma (default: `en-US`) |
| `variant` | `SYSTEM \| CUSTOM` | Tipo de voz |
| `r2ObjectKey` | `String` (optional) | Referencia de almacenamiento |
| `createdAt` | `DateTime` | Timestamp de creación |
| `updatedAt` | `DateTime` | Timestamp de actualización |

### Entidad: Generation

Representa una generación de síntesis de voz.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `String` (cuid) | Identificador único |
| `orgId` | `String` | Organización propietaria |
| `voiceId` | `String` (optional) | Voz utilizada |
| `text` | `String` | Contenido para síntesis |
| `voiceName` | `String` | Nombre de voz persistido |
| `temperature` | `Float` | Parámetro de inferencia |
| `topP` | `Float` | Parámetro de muestreo |
| `topK` | `Int` | Parámetro de filtrado |
| `repetitionPenalty` | `Float` | Penalización de repetición |
| `r2ObjectKey` | `String` (optional) | Audio generado |
| `createdAt` | `DateTime` | Timestamp de creación |

---

## Scripts y Comandos

```bash
# Desarrollo
npm run dev          # Inicia servidor en http://localhost:3000
npm run build        # Compila para producción
npm run start        # Sirve build producción

# Calidad de Código
npm run lint         # Ejecuta ESLint con auto-fix
npm run format       # Formatea código con Prettier

# Base de Datos
npx prisma generate # Regenera cliente Prisma
npx prisma migrate dev       # Crea/aplica migraciones en desarrollo
npx prisma migrate deploy    # Aplica migraciones en producción
npx prisma studio   # Abre interfaz visual de datos
```

---

## Estructura del Proyecto

```
resonance/
├── src/
│   ├── app/                    # Rutas Next.js App Router
│   │   ├── (dashboard)/        # Rutas protegidas
│   │   ├── sign-in/            # Autenticación
│   │   ├── sign-up/            # Registro
│   │   ├── org-selection/      # Selección de organización
│   │   ├── layout.tsx          # Layout raíz
│   │   └── globals.css         # Estilos globales
│   ├── components/
│   │   └── ui/                 # Componentes shadcn/ui
│   ├── features/
│   │   └── dashboard/          # Features del dashboard
│   ├── hooks/                  # Hooks personalizados
│   ├── lib/
│   │   ├── db.ts              # Cliente Prisma
│   │   ├── env.ts             # Validación de env vars
│   │   └── utils.ts           # Utilidades
│   ├── types/                 # Tipos TypeScript
│   └── proxy.ts               # Middleware de autenticación
├── prisma/
│   ├── schema.prisma          # Definición de modelo
│   ├── migrations/            # Historial de cambios
│   └── schema.db              # Snapshot
├── public/
│   └── resources/             # Assets estáticos
└── [config files]
```

---

## Flujo de Autenticación

```
Usuario Anónimo
      ↓
  Visita aplicación
      ↓
  ¿Autenticado? → NO → Redirige a /sign-in
      ↓ SÍ
  ¿Organización activa? → NO → Redirige a /org-selection
      ↓ SÍ
  Acceso a (dashboard)
```

---

## Consideraciones de Seguridad

- **Autenticación:** Clerk maneja sesiones, JWT y verificación de identidad
- **Autorización:** Middleware valida `userId` y `orgId` en rutas protegidas
- **Aislamiento de Datos:** Las queries Prisma filtran automáticamente por `orgId`
- **Variables de Entorno:** Gestión con `@t3-oss/env-nextjs`
- **HTTPS en Producción:** Requerido para cookies seguras de Clerk

---

## Próximas Mejoras Planificadas

- Implementar Server Actions para creación/actualización de generaciones
- Dashboard de analytics con gráficos de uso
- Editor avanzado de parámetros de síntesis
- Sistema de caché de audios generados
- API REST para integraciones externas
- Tests unitarios e integración
- Documentación interactiva de API

---

## Licencia

Proyecto propietario. Todos los derechos reservados.

---

## Contacto y Soporte

Para consultas, problemas o sugerencias, por favor consulta la documentación interna o contacta al equipo de desarrollo.

**Última actualización:** Marzo 2026
