# Guión Técnico para Video Explicativo: Ejercicio MVC Calculadora de Comisiones (Semana 4)

Este documento contiene la estructura minuto a minuto, los puntos clave y el diálogo sugerido para grabar el video explicativo solicitado por la cátedra.

---

## Ficha Técnica del Proyecto
- **Patrón de Arquitectura**: MVC (Model-View-Controller).
- **Backend**: NestJS + TypeORM + SQLite/PostgreSQL + Swagger OpenAPI + `class-validator` + `AllExceptionFilter` + `TimeoutInterceptor`.
- **Frontend**: Angular Standalone Components + Signals + OnPush Strategy + `ButtonCustomType` + UI en Español.
- **Despliegue Cloud**: Render (Backend API) + Netlify (Frontend SPA).

---

## Estructura Temporal del Video (Duración estimada: 6 - 8 minutos)

```
00:00 - 01:00  |  1. Introducción y Enunciado del Ejercicio
01:00 - 02:30  |  2. Arquitectura MVC y Flujo de Datos
02:30 - 04:30  |  3. Backend (NestJS + TypeORM): Entidades, DTOs, Filtros y Algoritmo de Comisiones
04:30 - 06:00  |  4. Frontend (Angular): Standalone, Signals, Orden Canónico y Vistas Duales
06:00 - 07:15  |  5. Demostración en Vivo: Casos de Prueba (Mayo - Junio 2025)
07:15 - 08:00  |  6. Despliegue en la Nube (Render y Netlify) y Conclusiones
```

---

## Detalle Paso a Paso por Secciones

### 1. Introducción y Enunciado del Ejercicio (00:00 - 01:00)
- **Qué mostrar en pantalla**: Pantalla inicial de la aplicación web (`http://localhost:4200` o la URL deployada) y la presentación personal.
- **Diálogo sugerido**:
  > *"Buenas tardes profesor y compañeros. En este video voy a presentar la resolución del ejercicio práctico de la Semana 4 'MVC Semestres Pasados: Calculadora de Comisiones'. El objetivo de este ejercicio es implementar un sistema completo bajo la arquitectura Modelo-Vista-Controlador (MVC) que permita registrar ventas, consultar transacciones en un rango de fechas específico, y calcular automáticamente las comisiones correspondientes a cada vendedor en base a un conjunto de reglas de negocio parametrizadas."*

---

### 2. Arquitectura MVC y Flujo de Datos (01:00 - 02:30)
- **Qué mostrar en pantalla**: Estructura de carpetas en VS Code mostrando `backend/` y `frontend/`.
- **Puntos a explicar**:
  - **Modelo (Model)**:
    - En el Backend: Entidades de TypeORM (`Seller`, `Sale`, `CommissionRule`) mapeadas en la base de datos relacional, junto con los DTOs de transferencia y validación.
    - En el Frontend: Tipos e interfaces fuertemente tipadas en `src/app/core/commission/commission.types.ts`.
  - **Controlador (Controller)**:
    - Controladores de NestJS (`CommissionController`, `SellerController`, `SaleController`, `CommissionRuleController`) que exponen los endpoints REST bajo `/api/v1/`, reciben las peticiones HTTP, validan los DTOs mediante ValidationPipe y delegan la lógica a los servicios.
  - **Vista (View)**:
    - Aplicación SPA en Angular con componentes Standalone, renderizado reactivo OnPush mediante **Angular Signals** y diseño responsivo moderno.
- **Diálogo sugerido**:
  > *"Hemos respetado estrictamente la separación de responsabilidades del patrón MVC. El Modelo gestiona los datos de vendedores, ventas y reglas de comisión de forma tipada e inmutable; los Controladores en NestJS reciben y filtran las solicitudes HTTP mediante ValidationPipes y filtros globales de excepciones; y la Vista en Angular consume el API mediante servicios desacoplados y actualiza la interfaz de forma puramente reactiva a través de Signals."*

---

### 3. Backend (NestJS + TypeORM): Entidades y Algoritmo (02:30 - 04:30)
- **Qué mostrar en pantalla**: Código en VS Code:
  1. `backend/src/common/filters/all-exception.filter.ts` e `interceptors/timeout.interceptor.ts` (Reutilizados del ecosistema).
  2. `backend/src/commission/dto/calculate-commission.dto.ts` (Mostrar `@IsDateString()`).
  3. `backend/src/commission/commission.service.ts` (Mostrar la lógica de cálculo).
  4. `backend/src/database/seed.service.ts` (Mostrar la inicialización de reglas y ventas).
  5. Swagger UI en `http://localhost:3000/api/docs`.
- **Puntos a explicar**:
  - **Validación DTO**: Las fechas de entrada (`startDate`, `endDate`) son auditadas con `class-validator` en formato estricto ISO 8601 (`YYYY-MM-DD`).
  - **Algoritmo de Comisión**:
    - Se consultan las ventas dentro del rango mediante el operador `Between(startDate, endDate)`.
    - Se recuperan las reglas de comisión ordenadas descendentemente por su monto mínimo (`minAmount DESC`).
    - **Por Venta Individual**: Para cada transacción, se evalúa si `monto >= regla.minAmount`. La primera regla que cumple asigna el porcentaje aplicable y se calcula `comision = monto * porcentaje`.
    - **Por Vendedor Acumulado**: Se agrupan las ventas por cada vendedor, sumando el total vendido, y se aplica la regla de comisión correspondiente al acumulado total del periodo.
  - **Swagger OpenAPI**: Mostrar cómo se documentan y pueden probar los endpoints de forma interactiva.

---

### 4. Frontend (Angular): Signals, Orden Canónico y Vistas (04:30 - 06:00)
- **Qué mostrar en pantalla**: Código en VS Code:
  1. `frontend/src/app/core/commission/commission.types.ts`
  2. `frontend/src/app/modules/commission/pages/commission-calculator/commission-calculator.component.ts`
  3. El template HTML en español directo y sin comentarios.
- **Puntos a explicar**:
  - **Reactividad moderna con Signals**: Cero inyección de `ChangeDetectorRef` ni llamadas manuales a `markForCheck()`. Todo el estado (`isLoadingCommission`, `commissionSalesList`, `metricsCommission`) se maneja con `signal()` y `computed()`.
  - **Estandarización de código**: Nomenclatura en inglés con calificación obligatoria de entidad (`commissionDateFilterForm`, `sellerListCommission`, `loadInitialDataCommission`), cero comentarios en código, configuración de botones `ButtonCustomType` al inicio y métodos observables privados con sufijo `$` estrictamente al final de la clase.
  - **Vistas Duales**: Integración de las dos variantes del ejercicio:
    - Vista **Detalle por Venta** (con ID Venta, Fecha Venta, Vendedor, Monto, % Regla y Comisión).
    - Vista **Resumen por Vendedor** (con Nombre, Total Vendido y Comisión Acumulada).

---

### 5. Demostración en Vivo: Casos de Prueba (06:00 - 07:15)
- **Qué mostrar en pantalla**: Navegador web en `http://localhost:4200` ejecutando la aplicación.
- **Acciones a realizar durante la grabación**:
  1. **Prueba 1: Rango por defecto (01/05/2025 al 30/06/2025)**:
     - Presionar **"Calcular Comisiones"**.
     - Mostrar las tarjetas de métricas: Total Vendido ($4,755.00), Total Comisiones ($546.50), 8 Ventas, 5 Vendedores.
     - Mostrar la tabla **Detalle por Venta**:
       - Venta de *Perico P* por $400.00: aplica 0.00% -> Comisión $0.00 (menor al umbral mínimo).
       - Venta de *Zoila B* por $600.00: aplica 6.00% -> Comisión $36.00 ($600 * 0.06).
       - Venta de *Aquiles C* por $1,100.00: aplica 15.00% -> Comisión $165.00.
       - Venta de *Anderson Guaman* por $705.00: aplica 30.00% -> Comisión $211.50 (¡coincidencia exacta con el video de referencia!).
  2. **Prueba 2: Vista "Resumen por Vendedor"**:
     - Cambiar a la pestaña "Resumen por Vendedor".
     - Mostrar cómo Anderson Guaman refleja: Total Vendido $705.00, Comisión $211.50 (pantalla exacta de la Imagen 1 del curso).
     - Mostrar a Aquiles C con Total Vendido $2,000.00 y Comisión $300.00.
  3. **Prueba 3: Registro de Nueva Venta (Modal)**:
     - Clic en **"Nueva Venta"**.
     - Seleccionar a un vendedor (ej. *Johnny M*), ingresar fecha `2025-06-25` y monto `$1,200.00`.
     - Presionar "Guardar Venta". Mostrar cómo la tabla y las métricas se recalculan automáticamente.

---

### 6. Despliegue en la Nube y Conclusiones (07:15 - 08:00)
- **Qué mostrar en pantalla**: Archivos `render.yaml`, `Dockerfile` y `netlify.toml` o dashboards en la nube.
- **Diálogo sugerido**:
  > *"Para el despliegue en la nube, el backend en NestJS se configuró para Render mediante su archivo render.yaml y Dockerfile, permitiendo ejecución en contenedores con puerto y variables de entorno dinámicas. Por su parte, el frontend en Angular fue configurado para Netlify mediante netlify.toml con redirección completa para Single Page Application hacia index.html. Con esto cumplimos al 100% los requerimientos de arquitectura MVC, validación de negocio, reactividad moderna y despliegue cloud. Muchas gracias por su atención."*
