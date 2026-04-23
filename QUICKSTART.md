# ⚡ Quick Start Guide

## 🚀 5 Minutos para Empezar

### Paso 1: Instalar Dependencias
```bash
cd topcv-mobile
npm install
```

### Paso 2: Configurar Variables de Entorno
```bash
cp .env.example .env
```

**Editar `.env`:**
```env
# Cambiar esto con tu IP local
EXPO_PUBLIC_API_URL=http://192.168.1.100:8080/api
```

Para encontrar tu IP:
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig

# Resultado: 192.168.x.x
```

### Paso 3: Iniciar la App
```bash
# Terminal 1: Iniciar servidor Expo
npm start

# Terminal 2 (cuando veas el QR):
# Presionar 'i' para iOS o 'a' para Android
```

## 📱 Estructura Mínima para Comenzar

Solo necesitas 3 cosas funcionando:

### 1. Backend Spring (Puerto 8080)
```bash
# Tu proyecto Spring debe tener estos endpoints:
POST   /api/v1/auth/login
GET    /api/v1/auth/me
GET    /api/v1/jobs
```

### 2. Base de Datos MySQL
```sql
-- Mínimo necesario:
CREATE TABLE users (id VARCHAR(36) PRIMARY KEY, ...);
CREATE TABLE jobs (id VARCHAR(36) PRIMARY KEY, ...);
```

### 3. Variables de Entorno
```env
EXPO_PUBLIC_API_URL=http://tu-ip:8080/api
```

## 🎯 Primer Login

1. Abre la app
2. Pantalla de LoginScreen aparece
3. Ingresa credenciales
4. Si funciona → Te redirige a HomeScreen
5. Si falla → Ver logs en consola

## 🔧 Debugging

### Ver logs en consola
```bash
npm start
# Los logs aparecen en el terminal
```

### Ver requests de API
Buscar en consola:
```
[API Request]: url
[API Response]: url
```

### Error Común: No se conecta al backend
```
❌ "Failed to connect"
→ Verificar que backend está en puerto 8080
→ Verificar que .env tiene IP correcta
→ Ping a la IP: ping 192.168.x.x
```

## 📝 Agregar Nueva Funcionalidad (3 Pasos)

### 1. Crear Tipo (TypeScript)
```typescript
// src/types/myFeature.types.ts
export interface MyFeature {
  id: string;
  name: string;
}
```

### 2. Crear Servicio (API Call)
```typescript
// src/services/myService.ts
import api from './api';

class MyService {
  async getFeature() {
    const response = await api.get('/my-endpoint');
    return response.data.data;
  }
}
export const myService = new MyService();
```

### 3. Usar en Componente
```typescript
import { useFetch } from '@hooks/index';
import { myService } from '@services/myService';

const MyScreen = () => {
  const { data, isLoading } = useFetch(
    () => myService.getFeature()
  );
  
  return (
    <View>
      {isLoading ? <LoadingSpinner /> : <Text>{data}</Text>}
    </View>
  );
};
```

## 🧪 Testear Login

### Mock de API (sin backend real)

Editar `src/services/authService.ts`:

```typescript
// Para testing sin backend
async login(credentials: LoginRequest): Promise<LoginResponse> {
  // TEMPORAL: Mock response
  return {
    token: 'mock-token-123',
    user: {
      id: '1',
      email: credentials.email,
      fullName: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true,
    },
  };
}
```

## 📊 Ver Estado de la App

En cualquier componente:
```typescript
import { useAuth } from '@hooks/index';

const MyComponent = () => {
  const { state } = useAuth();
  
  console.log('Current state:', state);
  // {
  //   user: {...},
  //   token: "...",
  //   isAuthenticated: true,
  //   isLoading: false
  // }
};
```

## 🎨 Cambiar Colores

Editar `src/constants/colors.ts`:

```typescript
export const COLORS = {
  primary: '#FF5722',      // Tu color principal
  secondary: '#2196F3',    // Tu color secundario
  // ... más colores
};
```

Todos los componentes usarán los nuevos colores automáticamente.

## 📦 Build para Testing

### iOS (Simulador)
```bash
npm run ios
```

### Android (Emulador)
```bash
npm run android
```

### Web (Browser)
```bash
npm run web
```

## 🔗 Rutas Principales

| Ruta | Pantalla | Requiremientos |
|------|----------||
| `/Login` | LoginScreen | - |
| `/Home` | HomeScreen | Autenticado |
| `/Profile` | ProfileScreen | Autenticado |
| `/JobDetail/:id` | JobDetail | Autenticado |

## ⚙️ Configuraciones Importantes

### API Timeout
`src/constants/endpoints.ts`:
```typescript
TIMEOUT: 30000,  // 30 segundos
```

### Retry Automático
`src/services/api.ts`:
```typescript
RETRY_ATTEMPTS: 3,  // 3 reintentos
RETRY_DELAY: 1000,  // 1 segundo entre reintentos
```

### Token Refresh
`src/context/AuthContext.tsx`:
```typescript
// Se renueva automáticamente cada 401
```

## 🐛 Problemas Comunes

### "Cannot find module '@/...'"
→ Verificar `tsconfig.json` paths
→ Reiniciar servidor: `npm start`

### "API call hangs"
→ Verificar backend está ejecutándose
→ Verificar endpoint existe
→ Verificar timeout en `.env`

### "Login loop infinito"
→ Token no se está guardando
→ AsyncStorage tiene problema
→ Ver logs para más detalles

### "Componente no actualiza"
→ Verificar que retorna dato del hook
→ Verificar que hook tiene dependencias correctas
→ Usar React DevTools para debugging

## 📚 Próximas Lecturas

1. **README.md** - Documentación completa
2. **BACKEND_INTEGRATION.md** - Integración Spring
3. **EXAMPLES.md** - Ejemplos de componentes
4. **PROJECT_STRUCTURE.md** - Estructura detallada

## 🚀 Pasos para Producción

```bash
# 1. Builds finales
npm run build

# 2. Preparar iOS
eas build --platform ios

# 3. Preparar Android
eas build --platform android

# 4. Distribuir
# - TestFlight (iOS)
# - Google Play (Android)
```

## 💡 Tips Útiles

### Recargar la app
```
iOS: Cmd+R
Android: R
Web: F5
```

### Ver todos los componentes
```typescript
import * as Components from '@components/index';
// Todos los componentes disponibles
```

### Debugger
```
npm start
→ Presionar 'j' para abrir debugger
```

### Logs formateados
```typescript
import { Logger } from '@utils/logger';

Logger.log('MyScreen', 'Data loaded', data);
Logger.error('MyScreen', 'Error occurred', error);
```

## ✅ Checklist Antes de Producción

- [ ] Backend funcionando en puerto 8080
- [ ] BD MySQL con datos reales
- [ ] Login funciona
- [ ] Obtener empleos funciona
- [ ] Token refresh funciona
- [ ] Logout limpia datos
- [ ] Sin errores en consola
- [ ] UI se ve bien en ambas plataformas
- [ ] `.env` actualizado
- [ ] Secrets no están en código

## 📞 Soporte

Si algo no funciona:

1. Ver logs: `npm start`
2. Revisar `BACKEND_INTEGRATION.md`
3. Revisar `EXAMPLES.md`
4. Buscar en `README.md`

---

**¡Listo para codificar!** 🎉

Para más detalles, revisar la documentación completa en `README.md`