# Estructura del Proyecto EventSync

## 📁 Árbol de Directorios

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                          # Layout principal
│   ├── page.tsx                            # 🏠 Página principal - Lista eventos
│   ├── globals.css                         # Estilos globales + animaciones
│   ├── events/
│   │   └── [id]/
│   │       └── page.tsx                    # 📅 Detalle evento con filtros
│   ├── sessions/
│   │   └── [id]/
│   │       └── page.tsx                    # 🎤 Detalle sesión + Q&A live
│   ├── speakers/
│   │   ├── page.tsx                        # 👥 Lista intervenants
│   │   └── [id]/
│   │       └── page.tsx                    # 👤 Perfil intervenant
│   ├── rooms/
│   │   └── page.tsx                        # 🏛️ Planning por salles
│   └── admin/
│       ├── layout.tsx                      # Layout admin con protección
│       ├── login/
│       │   └── page.tsx                    # 🔐 Login JWT
│       ├── dashboard/
│       │   └── page.tsx                    # 📊 Dashboard admin
│       ├── events/
│       │   ├── page.tsx                    # 📋 CRUD eventos (lista + delete)
│       │   ├── new/
│       │   │   └── page.tsx                # ➕ Crear evento
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx            # ✏️ Editar evento (TODO)
│       ├── sessions/
│       │   ├── page.tsx                    # 📋 Sessions (placeholder)
│       │   └── new/
│       │       └── page.tsx                # ➕ Crear session (TODO)
│       ├── speakers/
│       │   ├── page.tsx                    # 📋 Speakers (placeholder)
│       │   └── new/
│       │       └── page.tsx                # ➕ Crear speaker (TODO)
│       └── rooms/
│           ├── page.tsx                    # 📋 Rooms (placeholder)
│           └── new/
│               └── page.tsx                # ➕ Crear room (TODO)
│
├── components/
│   ├── skeleton-loader.tsx                 # 💀 Shimmer loaders
│   ├── session-card.tsx                    # 🎴 Card sesión animada
│   ├── page-transition.tsx                 # 🎬 Transiciones página
│   └── header.tsx                          # 📍 Header reutilizable
│
├── lib/
│   ├── api.ts                              # 🔌 API client REST
│   ├── types.ts                            # 📝 TypeScript interfaces
│   └── utils.ts                            # 🔧 Utilidades (cn, etc)
│
├── hooks/
│   └── use-fetch.ts                        # 🎣 Custom fetch hook
│
├── public/
│   ├── icon-light-32x32.png
│   ├── icon-dark-32x32.png
│   ├── icon.svg
│   └── apple-icon.png
│
├── node_modules/                           # Dependencias
│
├── .env.example                            # Ejemplo de env vars
├── package.json                            # 📦 Dependencias
├── tsconfig.json                           # TypeScript config
├── tailwind.config.ts                      # Tailwind config
├── next.config.mjs                         # Next.js config
├── README.md                               # 📚 Documentación principal
├── QUICK_START.md                          # 🚀 Guía rápida
└── PROJECT_STRUCTURE.md                    # 📁 Este archivo


## 🎯 Componentes Clave

### Skeleton Loader (`skeleton-loader.tsx`)
- Shimmer animation personalizada
- 3 tipos: card, text, line
- Indica carga de contenido

### Session Card (`session-card.tsx`)
- Tarjeta animada con Framer Motion
- Live badge pulsante
- Intervenants y detalles
- Botón favorito

### Page Transition (`page-transition.tsx`)
- Wrapper para animaciones de página
- Fade in/out + slide
- 0.5s duration

### Header (`header.tsx`)
- Reutilizable en varias páginas
- Back link
- Title + subtitle
- Action button slot

## 🔌 API Client (`lib/api.ts`)

### Endpoints Públicos
```typescript
api.events.list()              // GET /events
api.events.get(id)             // GET /events/{id}
api.sessions.get(id)           // GET /sessions/{id}
api.sessions.getQuestions(id)  // GET /sessions/{id}/questions
api.sessions.askQuestion(...)  // POST /sessions/{id}/questions
api.questions.upvote(id)       // POST /questions/{questionId}/upvote
api.speakers.list()            // GET /speakers
api.speakers.get(id)           // GET /speakers/{id}
api.rooms.list()               // GET /rooms
```

### Endpoints Admin
```typescript
adminApi.auth.login(email, password)
adminApi.auth.register(email, password)
adminApi.events.create(data, token)
adminApi.events.update(id, data, token)
adminApi.events.delete(id, token)
// ... otros recursos
```

## 📊 Estados & Datos

### localStorage
```javascript
// Favoritos
localStorage.getItem('favorites')  // JSON: ["id1", "id2"]

// Admin Auth
localStorage.getItem('adminToken') // JWT string
localStorage.getItem('adminUser')  // JSON: {id, email, role}
```

### React State
- `useState` para datos locales
- `useFetch` hook para API calls
- No hay Redux/Context (keep it simple)

## 🎨 Animaciones

### Framer Motion Usage
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### CSS Animations
```css
@keyframes shimmer {
  /* Loading effect */
}

@keyframes pulse-soft {
  /* Live badge effect */
}
```

## 🚀 Deploy Ready

- ✅ TypeScript para type safety
- ✅ Tailwind CSS escalable
- ✅ Framer Motion smooth
- ✅ Next.js best practices
- ✅ Responsive design
- ✅ Dark mode ready (tokens)
- ✅ Optimized builds

## 📈 Escalabilidad

### Próximos Pasos
1. Agregar más páginas admin CRUD
2. Implementar validación con Zod
3. Agregar React Query para caching
4. Agregar SearchParams para filtros
5. Implementar WebSocket para Q&A real-time
6. Agregar Service Worker para PWA

### Archivos Sugeridos
```
contexts/
├── auth-context.tsx            # Auth global state
└── favorites-context.tsx       # Favoritos context

utils/
├── date-format.ts              # Funciones fecha
└── validators.ts               # Zod schemas

middleware.ts                    # Auth middleware

public/
└── images/                     # Optimized images
```

---

## 📝 Notas de Desarrollo

- **API URL**: Configurar en `.env.local`
- **Admin Login**: `admin@eventsync.com` / `admin123`
- **Live Check**: Compara `now` con `startTime`/`endTime`
- **Favorites**: Persisten en navegador (localStorage)
- **Token**: Almacenado en localStorage para admin

## 🔗 Enlaces Útiles

- API Spec: `documentation-api-event-sync.md`
- Functional Spec: `-spcifications-fonctionnelles--event-sync.md`
- Config OpenAPI: `config.yaml`

---

¡Proyecto listo para desarrollo y despliegue! 🎉
