# Calculadora de Comisiones - Ejercicio MVC Semestres Pasados (Semana 4)

Sistema completo desarrollado bajo la arquitectura **Modelo-Vista-Controlador (MVC)**, aplicando estrictamente los estándares de desarrollo de **NestJS** (Backend) y **Angular Standalone con Signals** (Frontend), reutilizando los filtros, interceptores y patrones arquitectónicos de `proyecto_eeq`.

---

## 1. Arquitectura y Tecnologías

- **Backend (NestJS + TypeORM)**:
  - Arquitectura modular limpia: `src/commission/`, `src/seller/`, `src/sale/`, `src/commission-rule/`, `src/common/`.
  - Reutilización de `AllExceptionFilter` e `TimeoutInterceptor` de `proyecto_eeq` para control global de excepciones y timeouts.
  - Validación rigurosa de DTOs con `class-validator` y `class-transformer` (fechas estrictas en formato ISO 8601 `YYYY-MM-DD`).
  - Base de datos relacional con TypeORM y seeder automático con datos históricos (Mayo - Junio 2025).
  - Documentación interactiva Swagger OpenAPI en `/api/docs`.
  - Configuración para despliegue en Render (`render.yaml`) y Docker (`Dockerfile`).

- **Frontend (Angular Standalone + Signals)**:
  - Componentes Standalone con detección de cambios `OnPush` reactiva pura basada en **Angular Signals** (cero `ChangeDetectorRef`).
  - Patrón de configuración de botones `ButtonCustomType` al inicio de las propiedades de la clase, según el estándar canónico de José Emilio Fonseca Paz y Jaimer Vélez.
  - Vistas duales fieles a las referencias del curso:
    1. **Detalle por Venta**: ID Venta, Fecha Venta, Vendedor, Monto, % Regla Aplicada, Comisión.
    2. **Resumen por Vendedor**: Nombre, Total Vendido, % Regla Aplicada, Comisión Acumulada.
  - Tarjetas de métricas (KPIs) en tiempo real (Total Vendido, Total Comisiones, Transacciones, Vendedores Activos).
  - Modal reactivo para registrar nuevas ventas en tiempo real.
  - Textos directos en español (sin dependencias externas de traducción).
  - Configuración para despliegue en Netlify (`netlify.toml`) y Vercel (`vercel.json`).

---

## 2. Ejecución Local en 2 Pasos

### Paso 1: Levantar el Backend (NestJS)
```bash
cd backend
npm install
npm run build
npm run start
```
- API Base: `http://localhost:3000/api/v1`
- Swagger UI: `http://localhost:3000/api/docs`

### Paso 2: Levantar el Frontend (Angular)
```bash
cd frontend
npm install
npm start
```
- Aplicación Web: `http://localhost:4200`

---

## 3. Despliegue en la Nube

### Backend en Render (Web Service)
1. Conectar el repositorio en [Render](https://render.com).
2. Crear un **Web Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `CORS_ALLOWED_ORIGINS`: `["*"]`

### Frontend en Netlify
1. Conectar el repositorio en [Netlify](https://netlify.com).
2. Configuración de despliegue:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/frontend/browser`
3. En `frontend/src/environments/environment.ts`, colocar la URL asignada por Render para el backend.
