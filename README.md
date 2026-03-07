# Resonance

Resonance es una aplicación web construida con Next.js 16 para gestionar una experiencia multi-tenant basada en organizaciones, autenticación con Clerk y persistencia con Prisma sobre PostgreSQL. El estado actual del proyecto cubre la base de acceso, selección de organización y el modelo inicial para voces y generaciones de audio/texto.

## Resumen

- Framework: Next.js 16 con App Router y React 19.
- Autenticación y organizaciones: Clerk.
- Base de datos: PostgreSQL.
- ORM: Prisma 7 con driver adapter para `pg`.
- UI: Tailwind CSS v4, Base UI y componentes shadcn.
- Notificaciones: Sonner.

## Estado actual

Hoy el proyecto incluye:

- Pantallas de `sign-in` y `sign-up` con Clerk.
- Middleware de protección de rutas.
- Redirección obligatoria a selección de organización cuando el usuario no tiene una organización activa.
- Pantalla principal mínima con `OrganizationSwitcher` y `UserButton`.
- Modelo de datos inicial para voces (`Voice`) y generaciones (`Generation`).
- Cliente Prisma generado dentro de `src/generated/prisma`.

No hay todavía un flujo de producto completo para creación, listado o reproducción de generaciones desde la UI principal. El README describe el estado real del repositorio a marzo de 2026.

## Arquitectura

### Frontend

- `src/app`: rutas del App Router.
- `src/components/ui`: biblioteca base de componentes reutilizables.
- `src/app/layout.tsx`: registro de `ClerkProvider`, fuentes y toaster global.

### Acceso y tenancy

- `src/proxy.ts`: protege rutas privadas con Clerk.
- Los paths de autenticación (`/sign-in`, `/sign-up`) son públicos.
- `/org-selection` queda accesible para usuarios autenticados sin organización activa.
- El resto de rutas protegidas requieren `userId` y `orgId`.

### Persistencia

- `prisma/schema.prisma`: define el esquema y enums principales.
- `src/lib/db.ts`: inicializa Prisma con `@prisma/adapter-pg` usando `DATABASE_URL`.
- `src/generated/prisma`: salida del cliente generado por Prisma.

## Modelo de datos

### `Voice`

Representa una voz disponible dentro del sistema.

- `id`: identificador `cuid`.
- `orgId`: organización propietaria opcional.
- `name`, `description`: metadatos descriptivos.
- `category`: clasificación funcional de la voz.
- `language`: locale, por defecto `en-US`.
- `variant`: `SYSTEM` o `CUSTOM`.
- `r2ObjectKey`: referencia opcional a almacenamiento de archivos.

### `Generation`

Representa una generación asociada a una organización y, opcionalmente, a una voz.

- `orgId`: organización dueña del registro.
- `voiceId`: relación opcional con `Voice`.
- `text`: prompt o contenido fuente.
- `voiceName`: nombre persistido de la voz usada en la generación.
- Parámetros de inferencia: `temperature`, `topP`, `topK`, `repetitionPenalty`.
- `r2ObjectKey`: referencia opcional a artefactos generados.

## Requisitos

- Node.js 20 o superior.
- PostgreSQL accesible desde la aplicación.
- Cuenta y credenciales de Clerk.
- npm 10 o superior recomendado.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con al menos estas variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

Variables recomendadas para que Clerk use explícitamente las rutas del proyecto:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/org-selection"
```

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Generar el cliente de Prisma

```bash
npx prisma generate
```

### 3. Aplicar migraciones

Si la base ya existe y quieres aplicar el historial actual:

```bash
npx prisma migrate deploy
```

Si estás trabajando en local y necesitas crear o aplicar migraciones de desarrollo:

```bash
npx prisma migrate dev
```

### 4. Levantar el entorno local

```bash
npm run dev
```

La aplicación quedará disponible en `http://localhost:3000`.

## Scripts disponibles

```bash
npm run dev    # inicia Next.js en desarrollo
npm run build  # genera el build de producción
npm run start  # sirve el build generado
npm run lint   # ejecuta ESLint
```

## Estructura del proyecto

```text
.
|- prisma/
|  |- migrations/
|  \- schema.prisma
|- public/
|- src/
|  |- app/
|  |  |- org-selection/
|  |  |- sign-in/
|  |  \- sign-up/
|  |- components/
|  |- generated/prisma/
|  \- lib/
|- next.config.ts
|- prisma.config.ts
\- package.json
```

## Flujo de acceso

1. Un visitante entra a una ruta privada.
2. Si no está autenticado, Clerk exige inicio de sesión.
3. Si está autenticado pero no tiene `orgId` activo, se redirige a `/org-selection`.
4. Una vez seleccionada o creada una organización, el usuario vuelve a `/`.

## Calidad y convenciones

- TypeScript en todo el proyecto.
- ESLint 9 con configuración de Next.js.
- Tailwind CSS v4 para estilos globales.
- Prisma generado dentro del árbol de `src` para facilitar imports tipados.

## Próximos pasos sugeridos

- Añadir una capa de servicios o acciones del servidor para `Voice` y `Generation`.
- Crear dashboard inicial con listados filtrados por organización.
- Definir validación de entorno con `@t3-oss/env-nextjs`.
- Actualizar `metadata` de la app para reemplazar los valores por defecto de Create Next App.

## Deploy

Antes de desplegar, verifica:

- Variables de entorno de Clerk configuradas en el entorno de destino.
- `DATABASE_URL` apuntando a una base PostgreSQL persistente.
- Migraciones aplicadas antes de iniciar la app.
- Regeneración del cliente Prisma durante el proceso de build si el entorno lo requiere.

## Licencia

No se ha definido una licencia en este repositorio.
