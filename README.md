# TopCV Mobile App - React Native + TypeScript

Ứng dụng mobile chuyên nghiệp được xây dựng bằng React Native, TypeScript và Expo. Tích hợp mượt mà với Java Spring REST API và MySQL.

## 📋 Tính năng

- ✅ Xác thực bảo mật với JWT
- ✅ Tìm kiếm và lọc công việc
- ✅ Trình tạo CV
- ✅ Quản lý hồ sơ người dùng
- ✅ Lưu công việc yêu thích
- ✅ Ứn tuyển công việc
- ✅ TypeScript để type safety
- ✅ Quản lý trạng thái với Context
- ✅ Validation form
- ✅ Xử lý lỗi mạnh mẽ
- ✅ Giao diện hiện đại và responsive

## 🏗️ Cấu trúc dự án

```
topcv-mobile/
├── src/
│   ├── types/                    # Interfaces TypeScript
│   ├── constants/               # Màu sắc, typography, themes
│   ├── services/                # API services
│   ├── hooks/                   # Custom hooks
│   ├── context/                 # React Context
│   ├── components/              # Components tái sử dụng
│   ├── screens/                 # Màn hình ứng dụng
│   ├── navigation/              # Cấu hình navigation
│   ├── utils/                   # Hàm tiện ích
│   └── App.tsx                  # Component gốc
├── assets/                      # Hình ảnh và fonts
├── app.json                     # Cấu hình Expo
├── babel.config.js              # Cấu hình Babel
├── tsconfig.json                # Cấu hình TypeScript
└── package.json                 # Dependencies
```

## 🚀 Khởi chạy

### Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm hoặc yarn
- Expo CLI (`npm install -g expo-cli`)
- Java Spring Backend đang chạy tại `http://192.168.1.100:8080`

### Instalación

```bash
# 1. Clonar el repositorio
git clone <your-repo-url>
cd topcv-mobile

# 2. Instalar dependencias
npm install

# 3. Copiar configuración de ambiente
cp .env.example .env

# 4. Actualizar .env con tu configuración
# EXPO_PUBLIC_API_URL=tu-backend-url
```

### Ejecutar la Aplicación

```bash
# Iniciar servidor de desarrollo
npm start

# En un navegador Expo (iOS)
npm run ios

# Emulador Android
npm run android

# Web
npm run web
```

## 📱 Estructura de Pantallas

### Autenticación
- **LoginScreen** - Ingreso de usuario
- **SignUpScreen** - Registro de usuario

### Principales
- **HomeScreen** - Listado y búsqueda de empleos
- **ProfileScreen** - Información y configuración de usuario
- **CVBuilderScreen** - Constructor y editor de CV
- **SavedJobsScreen** - Empleos guardados

## 🔗 Integración con Backend Java Spring

### Configuración de API

Actualizar `src/constants/endpoints.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://tu-servidor:8080/api',
  VERSION: 'v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};
```

### Endpoints Esperados

Tu backend Java Spring debe proporcionar estos endpoints:

#### Autenticación
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/refresh-token
```

#### Empleos
```
GET    /api/v1/jobs
GET    /api/v1/jobs/:id
GET    /api/v1/jobs/search?search=keyword
GET    /api/v1/jobs/saved
POST   /api/v1/jobs/:id/save
POST   /api/v1/jobs/:id/unsave
```

#### CV
```
GET    /api/v1/cv
POST   /api/v1/cv
GET    /api/v1/cv/:id
PUT    /api/v1/cv/:id
DELETE /api/v1/cv/:id
GET    /api/v1/cv/templates
POST   /api/v1/cv/:id/export
```

#### Perfil
```
GET    /api/v1/profile
PUT    /api/v1/profile
POST   /api/v1/profile/photo
POST   /api/v1/profile/change-password
```

#### Aplicaciones
```
GET    /api/v1/applications
POST   /api/v1/applications/apply
DELETE /api/v1/applications/:id/withdraw
```

### Formato de Respuesta Esperado

```json
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Manejo de Errores

```json
{
  "success": false,
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS",
  "statusCode": 401,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🛠️ Trabajar con la API

### Crear un Nuevo Servicio

```typescript
// src/services/myService.ts
import { ENDPOINTS } from '@constants/endpoints';
import { ApiResponse } from '@types/index';
import api from './api';

class MyService {
  async getMethod(): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>(
        ENDPOINTS.MY_ENDPOINT
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async postMethod(data: any): Promise<any> {
    try {
      const response = await api.post<ApiResponse<any>>(
        ENDPOINTS.MY_ENDPOINT,
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export const myService = new MyService();
```

## 🪝 Usar Custom Hooks

### useAuth - Gestionar Autenticación

```typescript
import { useAuth } from '@hooks/index';

function MyComponent() {
  const { state, login, signup, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('email@example.com', 'password');
      // Usuario autenticado
    } catch (error) {
      // Manejar error
    }
  };

  return (
    // ...
  );
}
```

### useForm - Gestionar Formularios

```typescript
import { useForm } from '@hooks/index';
import { getValidationErrors } from '@utils/validation';

function MyForm() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (data) => getValidationErrors(data, {
      email: { required: true, type: 'email' },
      password: { required: true, minLength: 8 },
    }),
    onSubmit: async (data) => {
      // Enviar formulario
    },
  });

  return (
    // ...
  );
}
```

### useFetch - Cargar Datos

```typescript
import { useFetch } from '@hooks/index';
import { jobService } from '@services/jobService';

function MyComponent() {
  const { data, isLoading, error, refetch } = useFetch(
    () => jobService.getJobs({ page: 1, limit: 20 }),
    {
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.error('Error:', error),
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    // ...
  );
}
```

## 🎨 Personalizar Tema

### Colores

Editar `src/constants/colors.ts`:

```typescript
export const COLORS = {
  primary: '#1ABF5A',      // Color principal
  secondary: '#00A651',    // Color secundario
  // ... más colores
};
```

### Tipografía

Editar `src/constants/typography.ts`:

```typescript
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  // ... más estilos
};
```

## ✅ Validación

Funciones de validación disponibles:

```typescript
import { validateEmail, validatePassword, validatePhone, getValidationErrors } from '@utils/validation';

validateEmail('user@example.com');      // true/false
validatePassword('StrongPass123');      // true/false
validatePhone('0123456789');            // true/false
```

## 📦 Construcción para Producción

```bash
# Buildear para iOS
eas build --platform ios

# Buildear para Android
eas build --platform android

# Buildear ambas plataformas
eas build
```

## 🔒 Seguridad

- ✅ Tokens JWT seguros
- ✅ Renovación automática de tokens
- ✅ Almacenamiento seguro en AsyncStorage
- ✅ Validación de entrada
- ✅ Manejo seguro de errores

## 📊 Logging

Para development:

```typescript
import { Logger } from '@utils/logger';

Logger.log('Title', 'message', data);
Logger.error('Error Title', error);
Logger.warn('Warning Title', message);
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte, enviar email a support@topcv.com o abrir un issue en el repositorio.

## 🔗 Enlaces Útiles

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Navigation](https://reactnavigation.org)

---

Desenvolvido con ❤️ para TopCV