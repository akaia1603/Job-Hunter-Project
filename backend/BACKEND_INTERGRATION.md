# Guía Rápida de Integración Backend

## 📡 Conectar con Java Spring REST API

### 1. Actualizar Configuración de API

**Archivo: `.env`**
```env
EXPO_PUBLIC_API_URL=http://tu-ip-servidor:8080/api
EXPO_PUBLIC_API_TIMEOUT=30000
```

Para encontrar tu IP local:
```bash
# macOS/Linux
ifconfig | grep inet

# Windows
ipconfig

# Luego usar: http://192.168.x.x:8080/api
```

### 2. Modelos de Base de Datos (MySQL)

Tu backend debería tener estas tablas:

```sql
-- Users
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  profile_photo VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobs
CREATE TABLE jobs (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  company_id VARCHAR(36) NOT NULL,
  salary_min INT,
  salary_max INT,
  currency VARCHAR(3) DEFAULT 'VND',
  location VARCHAR(255) NOT NULL,
  job_type ENUM('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'),
  level ENUM('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'),
  posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline DATE,
  view_count INT DEFAULT 0,
  applicant_count INT DEFAULT 0,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- CVs
CREATE TABLE cvs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  template VARCHAR(50),
  color VARCHAR(7),
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Applications
CREATE TABLE applications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  cv_id VARCHAR(36) NOT NULL,
  status ENUM('APPLIED', 'REJECTED', 'SHORTLISTED', 'ACCEPTED') DEFAULT 'APPLIED',
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (cv_id) REFERENCES cvs(id)
);

-- Saved Jobs
CREATE TABLE saved_jobs (
  user_id VARCHAR(36),
  job_id VARCHAR(36),
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, job_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);
```

### 3. Controllers Spring (Ejemplos)

**AuthController.java**
```java
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  
  @PostMapping("/login")
  public ResponseEntity<ApiResponse<LoginResponse>> login(
      @RequestBody LoginRequest request) {
    // Implementar lógica de login
  }
  
  @PostMapping("/register")
  public ResponseEntity<ApiResponse<SignUpResponse>> signup(
      @RequestBody SignUpRequest request) {
    // Implementar lógica de registro
  }
  
  @GetMapping("/me")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<User>> getCurrentUser() {
    // Retornar usuario actual
  }
}
```

**JobController.java**
```java
@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {
  
  @GetMapping
  public ResponseEntity<ApiResponse<PaginationResponse<Job>>> getJobs(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "20") int limit,
      @RequestParam(required = false) String search) {
    // Retornar lista de empleos
  }
  
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<JobDetail>> getJobDetail(
      @PathVariable String id) {
    // Retornar detalle del empleo
  }
  
  @PostMapping("/{id}/save")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<Void>> saveJob(@PathVariable String id) {
    // Guardar empleo
  }
}
```

### 4. Formato de Respuesta Estándar

```java
public class ApiResponse<T> {
  private boolean success;
  private T data;
  private String message;
  private String error;
  private String timestamp;
  
  // Getters y Setters
}

public class PaginationResponse<T> {
  private List<T> data;
  private int total;
  private int page;
  private int limit;
  private int totalPages;
  private boolean hasNextPage;
  private boolean hasPreviousPage;
}
```

### 5. Seguridad JWT

La app utiliza JWT para autenticación. Tu backend debe:

1. **Generar token en login:**
```java
String token = jwtProvider.generateToken(user);
String refreshToken = jwtProvider.generateRefreshToken(user);
```

2. **Validar token en requests:**
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  
  @Override
  protected void doFilterInternal(HttpServletRequest request, 
      HttpServletResponse response, FilterChain filterChain) 
      throws ServletException, IOException {
    
    String bearerToken = request.getHeader("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      String token = bearerToken.substring(7);
      if (jwtProvider.validateToken(token)) {
        // Establecer autenticación
      }
    }
    filterChain.doFilter(request, response);
  }
}
```

### 6. CORS Configuration

```java
@Configuration
public class CorsConfig {
  
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
          .allowedOrigins("*")
          .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
          .allowedHeaders("*")
          .allowCredentials(false)
          .maxAge(3600);
      }
    };
  }
}
```

## 📱 Testing de API desde la App

### Usar Logger para debugguear

```typescript
// En tu componente
import { Logger } from '@utils/logger';

try {
  const result = await jobService.getJobs({ page: 1 });
  Logger.log('Jobs loaded:', result);
} catch (error) {
  Logger.error('Error loading jobs:', error);
}
```

### Checker Conectividad

```typescript
import { api } from '@services/api';

// Test conexión
const testConnection = async () => {
  try {
    const response = await api.get('/auth/me');
    Logger.log('Connection OK', response.data);
  } catch (error) {
    Logger.error('Connection Failed', error);
  }
};
```

## 🔄 Flujo de Autenticación

1. Usuario ingresa email y contraseña
2. App envía POST a `/auth/login`
3. Backend valida credenciales en MySQL
4. Backend retorna `{ token, refreshToken, user }`
5. App guarda token en AsyncStorage
6. App agrega Authorization header en requests siguientes
7. Si token expira, app usa refreshToken para obtener uno nuevo
8. Si refreshToken es inválido, usuario debe re-loguearse

## 🚀 Pasos de Deployment

1. **Backend Spring:**
   - Compilar: `mvn clean package`
   - Ejecutar: `java -jar target/app.jar`
   - Asegurar que escucha en puerto 8080

2. **Actualizar .env:**
   ```env
   EXPO_PUBLIC_API_URL=http://tu-ip-publica:8080/api
   ```

3. **Build de la app:**
   ```bash
   npm run android  # o ios
   ```

## ✅ Checklist de Integración

- [ ] Backend ejecutándose en puerto 8080
- [ ] Base de datos MySQL con tablas creadas
- [ ] CORS configurado correctamente
- [ ] JWT implementado
- [ ] Endpoints retornan formato correcto
- [ ] .env actualizado con URL correcta
- [ ] Prueba de login funciona
- [ ] Prueba de obtener empleos funciona
- [ ] Token refresh funciona

## 📞 Debugging de Problemas

### Error 401 (No autorizado)
- Verificar que el token se está guardando
- Verificar que el Authorization header se envía
- Verificar que el backend valida correctamente el token

### Error 404 (Endpoint no encontrado)
- Verificar que la URL base es correcta
- Verificar que el endpoint existe en el backend

### Error 500 (Error del servidor)
- Revisar logs del backend
- Verificar que la base de datos está conectada

### Error de CORS
- Verificar configuración de CORS en Spring
- Asegurar que el backend permite la IP del cliente