# 📁 Estructura Completa del Proyecto

```
topcv-mobile/                          # Raíz del proyecto
│
├── src/                               # Código fuente
│   ├── types/                         # TypeScript Interfaces
│   │   ├── index.ts                   # Exportador principal
│   │   ├── auth.types.ts              # (User, LoginRequest, SignUpRequest, etc)
│   │   ├── job.types.ts               # (Job, JobDetail, ApplyJobRequest, etc)
│   │   ├── cv.types.ts                # (CV, CVTemplate, CreateCVRequest, etc)
│   │   └── common.types.ts            # (ApiResponse, PaginationResponse, ApiError, etc)
│   │
│   ├── constants/                     # Valores constantes
│   │   ├── colors.ts                  # (COLORS con 20+ colores organizados)
│   │   ├── typography.ts              # (TYPOGRAPHY con h1-h4, body1-2, button, etc)
│   │   ├── spacing.ts                 # (SPACING, BORDER_RADIUS, SHADOW)
│   │   ├── theme.ts                   # (THEME consolidado)
│   │   └── endpoints.ts               # (API_CONFIG, ENDPOINTS organizados)
│   │
│   ├── services/                      # Capa de API (llamadas HTTP)
│   │   ├── api.ts                     # Cliente Axios configurado
│   │   │                              #  - Interceptores request/response
│   │   │                              #  - Token refresh automático
│   │   │                              #  - Manejo de errores centralizado
│   │   ├── authService.ts             # login, signup, logout, getCurrentUser, etc
│   │   ├── jobService.ts              # getJobs, getJobDetail, searchJobs, applyJob, etc
│   │   ├── cvService.ts               # getCVs, createCV, updateCV, deleteCV, exportCV, etc
│   │   └── profileService.ts          # getProfile, updateProfile, uploadPhoto, etc
│   │
│   ├── hooks/                         # Custom Hooks (Lógica reutilizable)
│   │   ├── index.ts                   # Exportador
│   │   ├── useAuth.ts                 # Hook de autenticación
│   │   ├── useForm.ts                 # Hook de formularios
│   │   └── useFetch.ts                # Hook para obtener datos
│   │
│   ├── context/                       # React Context (Estado global)
│   │   ├── AuthContext.tsx            # Contexto de autenticación
│   │   │                              #  - state (user, token, isLoading, etc)
│   │   │                              #  - login(), signup(), logout()
│   │   │                              #  - Persistencia automática
│   │   └── index.ts                   # Exportador
│   │
│   ├── components/                    # Componentes reutilizables
│   │   ├── Button/
│   │   │   └── Button.tsx             # (primary, secondary, outline, danger)
│   │   ├── TextField/
│   │   │   └── TextField.tsx          # (input, password toggle, error display)
│   │   ├── JobCard/
│   │   │   └── JobCard.tsx            # (mostrar empleo con info básica)
│   │   ├── Header/
│   │   │   └── Header.tsx             # (header personalizable con SafeArea)
│   │   ├── LoadingSpinner/
│   │   │   └── LoadingSpinner.tsx     # (indicador de carga)
│   │   ├── index.ts                   # Exportador de todos los componentes
│   │   └── __tests__/                 # Tests de componentes (opcional)
│   │
│   ├── screens/                       # Pantallas completas
│   │   ├── Auth/
│   │   │   └── LoginScreen.tsx        # Pantalla de login
│   │   │                              #  - Email/Password input
│   │   │                              #  - Validación
│   │   │                              #  - Social login placeholders
│   │   ├── Home/
│   │   │   └── HomeScreen.tsx         # Pantalla principal
│   │   │                              #  - Listado de empleos
│   │   │                              #  - Búsqueda
│   │   │                              #  - Pull to refresh
│   │   ├── Profile/
│   │   │   └── ProfileScreen.tsx      # Pantalla de perfil
│   │   │                              #  - Info del usuario
│   │   │                              #  - Menu de opciones
│   │   │                              #  - Logout
│   │   └── index.ts                   # Exportador de pantallas
│   │
│   ├── navigation/                    # Navegación
│   │   ├── RootNavigator.tsx          # Navegador principal
│   │   │                              #  - Cambia entre Auth y App según state
│   │   │                              #  - Loading screen
│   │   ├── AuthNavigator.tsx          # Stack de autenticación
│   │   │                              #  - Login
│   │   │                              #  - SignUp (placeholder)
│   │   ├── AppNavigator.tsx           # Stack + Tabs de app
│   │   │                              #  - Tabs (Home, SavedJobs, CV, Profile)
│   │   └── types.ts                   # Tipos de navegación
│   │
│   ├── utils/                         # Funciones utilitarias
│   │   ├── validation.ts              # Validación de email, password, phone, etc
│   │   ├── formatters.ts              # Formateo de dinero, fechas, texto
│   │   ├── storage.ts                 # AsyncStorage con expiración
│   │   ├── logger.ts                  # Sistema de logging
│   │   └── index.ts                   # Exportador
│   │
│   └── App.tsx                        # Componente raíz
│                                      #  - Provider de Auth
│                                      #  - SafeAreaProvider
│                                      #  - StatusBar
│
├── assets/                            # Recursos estáticos
│   ├── icon.png                       # Ícono de la app
│   ├── splash.png                     # Pantalla de splash
│   ├── adaptive-icon.png              # Ícono adaptativo (Android)
│   └── favicon.png                    # Favicon web
│
├── app.json                           # Configuración Expo
│                                      #  - Nombre, slug
│                                      #  - Plugins, permissions
│                                      #  - Configuración iOS/Android
│
├── babel.config.js                    # Configuración Babel
│                                      #  - Alias de rutas (@/)
│                                      #  - Metro bundler
│
├── tsconfig.json                      # Configuración TypeScript
│                                      #  - Strict mode
│                                      #  - Path mapping
│                                      #  - Target ES2020
│
├── package.json                       # Dependencias y scripts
│                                      #  - React, React Native, Expo
│                                      #  - React Navigation
│                                      #  - Axios, TypeScript
│                                      #  - Scripts: start, ios, android
│
├── .env.example                       # Variables de entorno (template)
│                                      #  - EXPO_PUBLIC_API_URL
│                                      #  - EXPO_PUBLIC_API_TIMEOUT
│
├── README.md                          # Documentación principal
│                                      #  - Instalación
│                                      #  - Uso
│                                      #  - Estructura
│                                      #  - Deploy
│
├── BACKEND_INTEGRATION.md             # Guía de integración con Spring
│                                      #  - Configuración de API
│                                      #  - Modelos de BD
│                                      #  - Controllers Spring
│                                      #  - JWT, CORS
│                                      #  - Debugging
│
├── EXAMPLES.md                        # Ejemplos prácticos
│                                      #  - Crear componente
│                                      #  - Crear servicio
│                                      #  - Crear hook
│                                      #  - Crear pantalla
│                                      #  - Validación avanzada
│
└── PROJECT_SUMMARY.md                 # Este documento
```

## 🔀 Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│                        USER SCREEN                       │
│  (LoginScreen, HomeScreen, ProfileScreen, etc)          │
└────────────────────────┬────────────────────────────────┘
                         │ onPress, onChange, etc
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   CUSTOM HOOKS                          │
│  useAuth(), useForm(), useFetch()                      │
│  (Lógica reutilizable)                                 │
└────────────────────────┬────────────────────────────────┘
                         │ call service/context
                         ▼
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
┌──────────────────┐            ┌────────────────────┐
│  CONTEXT         │            │   SERVICES         │
│  AuthContext     │            │  authService       │
│  (Global State)  │            │  jobService        │
└──────────────────┘            │  cvService         │
        │                       │  profileService    │
        │                       └────────┬───────────┘
        │                                │
        └────────────────┬───────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │      API CLIENT        │
            │   (src/services/api.ts)│
            │                        │
            │ - Interceptors         │
            │ - Token management     │
            │ - Error handling       │
            └────────────┬───────────┘
                         │
                         │ HTTP Request
                         │ (Add Bearer Token)
                         ▼
            ┌────────────────────────┐
            │   JAVA SPRING BACKEND  │
            │   (Port 8080)          │
            │                        │
            │ - Controllers          │
            │ - Services             │
            │ - JWT Validation       │
            └────────────┬───────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   MYSQL DATABASE       │
            │                        │
            │ - users                │
            │ - jobs                 │
            │ - cvs                  │
            │ - applications         │
            └────────────────────────┘
```

## 📊 State Management

```
ROOT COMPONENT (App.tsx)
│
├── AuthProvider (AuthContext.tsx)
│   │
│   ├── state
│   │   ├── user: User | null
│   │   ├── token: string | null
│   │   ├── isLoading: boolean
│   │   ├── isAuthenticated: boolean
│   │   └── error: string | null
│   │
│   └── functions
│       ├── login(email, password)
│       ├── signup(email, password, fullName)
│       ├── logout()
│       └── updateProfile(data)
│
└── Navigation
    ├── AuthNavigator (si no autenticado)
    │   └── LoginScreen
    │
    └── AppNavigator (si autenticado)
        ├── TabNavigator
        │   ├── HomeTab → HomeScreen
        │   ├── SavedJobsTab → SavedJobsScreen
        │   ├── CVTab → CVBuilderScreen
        │   └── ProfileTab → ProfileScreen
        │
        └── StackNavigator
            ├── MainTabs
            ├── JobDetail
            └── CVDetail
```

## 🔄 Request/Response Cycle

### Successful Request
```
1. Component → useForm/useFetch
2. useForm/useFetch → authService/jobService
3. Service → api.post/get (Axios)
4. Axios → Interceptor Request
   ├── Add Bearer Token
   └── Add Headers
5. Request → Backend (HTTP)
6. Backend → Response
7. Response → Interceptor Response
   └── Parse & return data
8. Service → Hook/Component
9. Hook/Component → Update UI
```

### Error Handling
```
1. Error occurs in request
2. Axios interceptor catches it
3. Check if 401 (Unauthorized)
   ├── If yes: Try refresh token
   │   ├── Success: Retry original request
   │   └── Fail: Clear auth, redirect to login
   └── If no: Return error to service
4. Service throws error
5. Hook catches error
6. Component shows error to user
```

## 🎯 Convenciones de Nombres

### Archivos y Carpetas
```
✅ Components:      PascalCase      (MyComponent.tsx)
✅ Screens:         PascalCase      (LoginScreen.tsx)
✅ Utilities:       camelCase       (validation.ts)
✅ Folders:         kebab-case      (my-folder/)
✅ Services:        camelCase       (jobService.ts)
```

### Variables y Funciones
```
✅ Variables:       camelCase       (const userName = "")
✅ Constants:       UPPER_SNAKE     (const API_URL = "")
✅ Functions:       camelCase       (const getUserData = () => {})
✅ Interfaces:      PascalCase      (interface UserData {})
✅ Enums:           PascalCase      (enum UserRole {})
```

### Componentes React
```
✅ Props interface: <ComponentName>Props
✅ Export default:  export default Component
✅ Styling:         StyleSheet.create()
```

## 🚀 Deployment

### Estructura de Archivos para APK/IPA
```
build/
├── android/          # Compilados Android
│   ├── app/
│   │   └── outputs/
│   │       └── *.apk
│   └── *.aab
└── ios/              # Compilados iOS
    └── *.ipa
```

## 📈 Escalabilidad

Para agregar nuevas features:

1. **Nuevo tipo/interfaz:**
   ```
   src/types/newFeature.types.ts
   Agregar export en src/types/index.ts
   ```

2. **Nuevo servicio:**
   ```
   src/services/newFeatureService.ts
   Usar en hook/componente
   ```

3. **Nuevo hook:**
   ```
   src/hooks/useNewFeature.ts
   Exportar en src/hooks/index.ts
   ```

4. **Nuevo componente:**
   ```
   src/components/NewComponent/NewComponent.tsx
   Exportar en src/components/index.ts
   ```

5. **Nuevo endpoint:**
   ```
   Agregar en src/constants/endpoints.ts
   Crear método en servicio correspondiente
   ```

## 🔒 Seguridad

### Token Management
```
Login → Save token to AsyncStorage
  ↓
Every request → Add Bearer token header
  ↓
401 Response → Try refresh token
  ↓
Success → Update token, retry request
Fail → Clear token, redirect to login
```

### Data Protection
```
✅ Tokens stored in AsyncStorage (encrypted by OS)
✅ No hardcoded credentials
✅ HTTPS ready
✅ Input validation before send
✅ Error messages don't expose sensitive info
```

---

**Proyecto completo y estructurado para producción** ✅