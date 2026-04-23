# Ejemplos de Uso - TopCV Mobile App

## 📚 Ejemplos Prácticos

### 1. Crear un nuevo componente

**src/components/CustomCard/CustomCard.tsx**

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '@constants/theme';

interface CustomCardProps {
  title: string;
  description?: string;
  onPress: () => void;
}

const CustomCard: React.FC<CustomCardProps> = ({ 
  title, 
  description, 
  onPress 
}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      ...SHADOW.md,
    },
    title: {
      ...TYPOGRAPHY.h4,
      color: COLORS.text.primary,
      marginBottom: description ? SPACING.sm : 0,
    },
    description: {
      ...TYPOGRAPHY.body2,
      color: COLORS.text.secondary,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </TouchableOpacity>
  );
};

export default CustomCard;
```

### 2. Crear un nuevo servicio

**src/services/notificationService.ts**

```typescript
import { ENDPOINTS } from '@constants/endpoints';
import { Notification, ApiResponse, PaginationResponse } from '@types/index';
import api from './api';

class NotificationService {
  async getNotifications(): Promise<PaginationResponse<Notification>> {
    try {
      const response = await api.get<ApiResponse<PaginationResponse<Notification>>>(
        ENDPOINTS.NOTIFICATIONS.LIST
      );
      return response.data.data as PaginationResponse<Notification>;
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>(
        ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSettings(): Promise<any> {
    try {
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.SETTINGS);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
```

### 3. Crear un custom hook

**src/hooks/useNotifications.ts**

```typescript
import { useState, useEffect } from 'react';
import { Notification } from '@types/index';
import { notificationService } from '@services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(
        notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      setError('Failed to mark as read');
    }
  };

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    refetch: loadNotifications,
  };
};

export default useNotifications;
```

### 4. Crear una nueva pantalla

**src/screens/Notifications/NotificationsScreen.tsx**

```typescript
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, LoadingSpinner } from '@components/index';
import { useNotifications } from '@hooks/useNotifications';
import { Notification } from '@types/index';
import { COLORS, SPACING } from '@constants/theme';
import NotificationItem from './NotificationItem';

const NotificationsScreen: React.FC = () => {
  const { notifications, isLoading, markAsRead } = useNotifications();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    content: {
      flex: 1,
      padding: SPACING.lg,
    },
  });

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={() => markAsRead(item.id)}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner fullScreen message="Loading notifications..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" />
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;
```

### 5. Validación de formulario avanzada

**src/utils/advancedValidation.ts**

```typescript
export interface ValidationRule {
  required?: boolean | string;
  email?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: any) => boolean | string;
  custom?: (value: any, formData: Record<string, any>) => boolean | string;
}

export const validateField = (
  value: any,
  rules: ValidationRule
): string | null => {
  // Required
  if (rules.required) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return typeof rules.required === 'string' ? rules.required : 'This field is required';
    }
  }

  if (!value) return null; // Only validate if value exists

  // Email
  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return typeof rules.email === 'string' ? rules.email : 'Invalid email format';
    }
  }

  // MinLength
  if (rules.minLength) {
    const config = typeof rules.minLength === 'number'
      ? { value: rules.minLength }
      : rules.minLength;

    if (value.length < config.value) {
      return config.message || `Minimum ${config.value} characters required`;
    }
  }

  // MaxLength
  if (rules.maxLength) {
    const config = typeof rules.maxLength === 'number'
      ? { value: rules.maxLength }
      : rules.maxLength;

    if (value.length > config.value) {
      return config.message || `Maximum ${config.value} characters allowed`;
    }
  }

  // Pattern
  if (rules.pattern) {
    if (!rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }
  }

  // Custom validation
  if (rules.validate) {
    const result = rules.validate(value);
    if (result !== true) {
      return typeof result === 'string' ? result : 'Validation failed';
    }
  }

  return null;
};

export const validateForm = (
  formData: Record<string, any>,
  schema: Record<string, ValidationRule>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.entries(schema).forEach(([field, rules]) => {
    const error = validateField(formData[field], rules);
    if (error) {
      errors[field] = error;
    }

    // Custom field-to-field validation
    if (rules.custom) {
      const customError = rules.custom(formData[field], formData);
      if (customError !== true) {
        errors[field] = typeof customError === 'string' ? customError : 'Validation failed';
      }
    }
  });

  return errors;
};
```

### 6. Manejo de errores global

**src/context/ErrorContext.tsx**

```typescript
import React, { createContext, useState, ReactNode } from 'react';
import { ApiError } from '@types/index';

export interface ErrorContextType {
  error: ApiError | null;
  setError: (error: ApiError | null) => void;
  clearError: () => void;
  showError: (message: string, code?: string) => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<ApiError | null>(null);

  const clearError = () => setError(null);

  const showError = (message: string, code?: string) => {
    setError({
      code: code || 'UNKNOWN_ERROR',
      message,
      statusCode: 0,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <ErrorContext.Provider value={{ error, setError, clearError, showError }}>
      {children}
    </ErrorContext.Provider>
  );
};
```

### 7. Interceptor de respuesta personalizado

Extender `src/services/api.ts` para usar error context:

```typescript
// En setupInterceptors()
this.axiosInstance.interceptors.response.use(
  (response) => {
    // Limpiar error anterior
    // errorContext.clearError();
    return response;
  },
  async (error: AxiosError) => {
    const errorData = error.response?.data as any;

    // Mostrar error global
    // errorContext.showError(
    //   errorData?.message || error.message,
    //   errorData?.code
    // );

    // ... resto del código
  }
);
```

### 8. Testing de componentes

**src/components/__tests__/Button.test.tsx**

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button/Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button
        title="Click Me"
        onPress={onPress}
        testID="test-button"
      />
    );

    const button = getByTestId('test-button');
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalled();
  });

  it('should disable when loading', () => {
    const { getByTestId } = render(
      <Button
        title="Loading"
        onPress={() => {}}
        isLoading={true}
        testID="loading-button"
      />
    );

    const button = getByTestId('loading-button');
    expect(button.props.disabled).toBe(true);
  });
});
```

## 🎯 Mejores Prácticas

### 1. Usar tipos siempre
```typescript
// ✅ Bien
const handlePress = (id: string): void => { };

// ❌ Mal
const handlePress = (id) => { };
```

### 2. Separar lógica de presentación
```typescript
// Crear un hook para la lógica
const useJobList = () => { /* ... */ };

// Usar en el componente
const JobListScreen = () => {
  const { jobs, isLoading } = useJobList();
  return <JobList data={jobs} />;
};
```

### 3. Manejar errores apropiadamente
```typescript
try {
  await submitForm(data);
  // Mostrar éxito
} catch (error: any) {
  // Mostrar error específico
  setError(error.response?.data?.message || 'Unknown error');
}
```

### 4. Usar constantes en lugar de strings
```typescript
// ✅ Bien
const SCREEN_NAMES = {
  LOGIN: 'Login',
  HOME: 'Home',
} as const;

// ❌ Mal
navigation.navigate('Login');
```

## 📖 Recursos Adicionales

- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [React Hooks](https://react.dev/reference/react/hooks)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Axios Documentation](https://axios-http.com)

---

Para más ayuda, revisar el archivo `README.md` y `BACKEND_INTEGRATION.md`