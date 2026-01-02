# Farmaprisa Driver App 🚗💊

Aplicación móvil de React Native para conductores de entregas de farmacia, con autenticación, gestión de entregas, mapas de Google y rastreo en tiempo real.

## 📱 Características

- ✅ **Autenticación de Conductores**: Login seguro con validación de rol
- 📦 **Gestión de Entregas**: Lista de entregas pendientes, en progreso y completadas
- 🗺️ **Integración con Google Maps**: Visualización de ubicaciones de clientes
- 🧭 **Optimización de Rutas**: Cálculo automático de la mejor ruta de entrega
- 📍 **Rastreo en Tiempo Real**: Ubicación del conductor visible para usuarios
- 🎨 **UI Moderna**: Diseño limpio y profesional con tema de farmacia

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+
- npm o bun
- Expo CLI
- Android Studio (para Android) o Xcode (para iOS)

### Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar Google Maps API Key**:
   - Obtén una API key de [Google Cloud Console](https://console.cloud.google.com/)
   - Habilita las siguientes APIs:
     - Maps SDK for Android
     - Maps SDK for iOS
     - Directions API
   - Actualiza `app.json` con tu API key:
     ```json
     "ios": {
       "config": {
         "googleMapsApiKey": "TU_API_KEY_AQUI"
       }
     },
     "android": {
       "config": {
         "googleMaps": {
           "apiKey": "TU_API_KEY_AQUI"
         }
       }
     }
     ```
   - También actualiza `config/config.ts`:
     ```typescript
     GOOGLE_MAPS_API_KEY: 'TU_API_KEY_AQUI'
     ```

3. **Iniciar la aplicación**:
```bash
npm start
```

Luego presiona:
- `a` para abrir en Android
- `i` para abrir en iOS
- `w` para abrir en web

## 🔐 Credenciales de Prueba

Para desarrollo con datos mock:

```
Email: driver@farmaprisa.com
Contraseña: driver123
```

## 📂 Estructura del Proyecto

```
farmaprisa-driver-app/
├── app/                      # Pantallas de la aplicación
│   ├── (tabs)/              # Navegación por tabs
│   │   ├── index.tsx        # Lista de entregas
│   │   ├── explore.tsx      # Mapa
│   │   └── profile.tsx      # Perfil del conductor
│   ├── login.tsx            # Pantalla de login
│   └── _layout.tsx          # Layout raíz con autenticación
├── components/              # Componentes reutilizables
│   ├── delivery/           # Componentes de entregas
│   │   └── DeliveryCard.tsx
│   ├── map/                # Componentes de mapa
│   │   └── DeliveryMapView.tsx
│   └── ui/                 # Componentes UI básicos
│       ├── Button.tsx
│       ├── Input.tsx
│       └── LoadingSpinner.tsx
├── contexts/               # Contextos de React
│   └── auth-context.tsx   # Contexto de autenticación
├── services/              # Servicios de la aplicación
│   ├── auth-service.ts    # Servicio de autenticación
│   ├── delivery-service.ts # Servicio de entregas
│   └── location-service.ts # Servicio de ubicación
├── types/                 # Tipos de TypeScript
│   └── delivery-types.ts
├── constants/             # Constantes
│   └── colors.ts         # Paleta de colores
└── config/               # Configuración
    └── config.ts        # Configuración de la app
```

## 🎨 Características Principales

### 1. Autenticación
- Login con email y contraseña
- Validación de rol (solo conductores)
- Almacenamiento seguro de tokens
- Auto-login al abrir la app

### 2. Lista de Entregas
- Visualización de entregas pendientes
- Filtros por estado (Todas, Pendientes, En Progreso, Completadas)
- Pull-to-refresh para actualizar
- Información detallada de cada entrega

### 3. Mapa Interactivo
- Visualización de todas las ubicaciones de entrega
- Marcador de ubicación del conductor
- Ruta optimizada automáticamente
- Botón de rastreo en tiempo real
- Actualización de ubicación cada 30 segundos

### 4. Perfil del Conductor
- Información personal
- Estadísticas de entregas
- Configuración
- Cerrar sesión

## 🔧 Configuración

### Modo Mock vs Producción

Por defecto, la app usa datos mock. Para conectar con un backend real:

1. Actualiza `config/config.ts`:
```typescript
USE_MOCK_DATA: false,
API_BASE_URL: 'https://tu-api.com',
```

2. Implementa los siguientes endpoints en tu backend:
- `POST /auth/login` - Autenticación
- `GET /auth/user` - Obtener usuario actual
- `GET /deliveries` - Obtener entregas del conductor
- `PUT /deliveries/:id/status` - Actualizar estado de entrega
- `POST /location/update` - Enviar actualización de ubicación

### Permisos de Ubicación

La app requiere permisos de ubicación en segundo plano. Los mensajes de permisos están configurados en `app.json` y se pueden personalizar.

## 🎯 Próximas Características

- [ ] Notificaciones push para nuevas entregas
- [ ] Chat con clientes
- [ ] Escaneo de código QR para confirmar entregas
- [ ] Historial de entregas completadas
- [ ] Modo offline con sincronización
- [ ] Firma digital del cliente
- [ ] Fotos de comprobante de entrega

## 🐛 Solución de Problemas

### El mapa no se muestra
- Verifica que hayas configurado correctamente la API key de Google Maps
- Asegúrate de haber habilitado las APIs necesarias en Google Cloud Console

### Los permisos de ubicación no funcionan
- En iOS: Verifica que los mensajes de permisos estén en `app.json`
- En Android: Asegúrate de que los permisos estén en el array de `permissions`

### Error de TypeScript en rutas
- Ejecuta `npx expo start --clear` para limpiar la caché
- El error de `/login` es un warning de TypeScript que se resolverá al compilar

## 📝 Licencia

Este proyecto es privado y pertenece a Farmaprisa.

## 👥 Equipo

Desarrollado para Farmaprisa - Sistema de entregas de farmacia

---

**Nota**: Esta aplicación está en desarrollo y usa datos mock. Para producción, configura un backend real y actualiza las credenciales de API.
