# Guía Rápida - EventSync

## Inicio Rápido

### 1. Instalación
```bash
npm install
# o
pnpm install
```

### 2. Configuración
Crear `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Ejecutar
```bash
npm run dev
# o
pnpm dev
```

Visita: http://localhost:3000

## Características de la Aplicación

### Parte Pública (Sin Autenticación)

#### 🏠 Página Principal
- Lista todos los eventos disponibles
- Cards interactivas con animaciones
- Acceso directo a eventos

#### 📅 Detalles del Evento
- Información completa del evento
- Filtrado por salles
- Lista de sesiones con cards animadas
- Gestión de favoritos (guardado en navegador)
- Badges "Live" para sesiones en curso

#### 🎤 Detalles de la Sesión
- Información completa
- Lista de intervenants
- **Sistema Q&A en Tiempo Real** (si la sesión está "live")
  - Hacer preguntas anónimas o con nombre
  - Ver todas las preguntas ordenadas por upvotes
  - Upvotear preguntas (👍)

#### 👥 Intervenants
- Vista de lista de todos los speakers
- Página individual con perfil
- Bio y enlaces externos
- Sesiones donde participa

#### 🏛️ Salles
- Planning por sala
- Sesiones organizadas por espacio
- Navegación intuitiva

### Parte Admin (Requiere Autenticación)

#### 🔐 Login
- URL: `/admin/login`
- Credenciales por defecto:
  - **Email**: `admin@eventsync.com`
  - **Password**: `admin123`

#### 📊 Dashboard
- Vista de todo lo que se puede administrar
- Acceso rápido a crear nuevos recursos

#### 🎯 Gestión CRUD
1. **Eventos** (`/admin/events`)
   - ✅ Ver listado
   - ✅ Crear nuevo
   - ✅ Editar
   - ✅ Eliminar

2. **Sessions** (`/admin/sessions`)
   - 🔄 En desarrollo - interfaz básica disponible

3. **Intervenants** (`/admin/speakers`)
   - 🔄 En desarrollo - interfaz básica disponible

4. **Salles** (`/admin/rooms`)
   - 🔄 En desarrollo - interfaz básica disponible

## Animaciones & Efectos

### Skeleton Loaders
Durante la carga de datos, verás efectos shimmer animados que indican el contenido que está cargando.

### Page Transitions
Transiciones suaves entre páginas con fade in/out.

### Live Badge
El badge "Live" en sesiones en curso parpadea suavemente.

### Card Animations
Al pasar el mouse sobre las tarjetas:
- Ligero aumento de escala
- Sombra mejorada
- Transición suave

## Estado de la Aplicación

### Favoritos
Guardados en `localStorage` del navegador:
- Click en ☆/★ para agregar/quitar favoritos
- Persisten al recargar la página

### Token Admin
Almacenado en `localStorage`:
- Automáticamente después del login
- Automáticamente removido al logout

## Desarrollo

### Estructura de Carpetas
```
app/
├── page.tsx                 # Home
├── events/                  # Evento detail
├── sessions/                # Session detail con Q&A
├── speakers/                # Speakers list & detail
├── rooms/                   # Rooms con planning
└── admin/                   # Admin pages

components/
├── skeleton-loader.tsx      # Loading states
├── session-card.tsx         # Tarjeta de sesión
├── page-transition.tsx      # Transiciones
└── header.tsx               # Header reutilizable

lib/
├── api.ts                   # API client
└── types.ts                 # TypeScript types

hooks/
└── use-fetch.ts             # Custom fetch hook
```

### Customización

#### API URL
Cambiar en `.env.local`:
```env
NEXT_PUBLIC_API_URL=tu-api-url
```

#### Colores & Tema
Todos los colores están en Tailwind CSS:
- Primary: `blue-600`
- Success: `green-600`
- Error: `red-600`
- Backgrounds: `white`, `gray-50`

#### Animaciones
Controladas por Framer Motion en componentes:
- `motion.div` para animaciones
- `initial`, `animate`, `transition` props

## Troubleshooting

### "API Error"
- Verificar que la API está corriendo en `http://localhost:5000`
- Revisar `NEXT_PUBLIC_API_URL` en `.env.local`
- Abrir DevTools (F12) → Network para ver requests

### "No se puede ver preguntas"
- La sesión debe estar "live" (entre startTime y endTime)
- Confirmar en el servidor que la hora es correcta

### "Login fallido"
- Credenciales por defecto: `admin@eventsync.com` / `admin123`
- Verificar que el backend retorna un token válido

### Skeleton loaders infinitos
- API probablemente no está respondiendo
- Ver console para errores

## Performance Tips

- Los skeleton loaders indican carga activa
- Las transiciones son suaves gracias a Framer Motion
- Los datos se cachean en el estado React
- Las imágenes se cargan lazy

## Próximos Pasos

1. Conectar a un backend real (procurar que siga la spec OpenAPI)
2. Agregar más validación de formularios
3. Implementar búsqueda global
4. Agregar más filtros avanzados
5. Implementar notificaciones en tiempo real
6. Agregar dark mode

## Recursos

- [Next.js Docs](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [API Spec](./documentation-api-event-sync.md)

---

¡Diviértete desarrollando con EventSync! 🚀
