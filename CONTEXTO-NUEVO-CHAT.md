# Contexto del proyecto — Sistema de Notas de Enfermería (Hospital Rezola, Cañete)

Documento de traspaso para iniciar un chat nuevo. Describe el proyecto completo **sin** el trabajo de separación de hojas por módulos.

---

## 0. Dónde está el código

- Repositorio original: `C:\Proyectos\enfermeria`
- Copia de trabajo creada para este contexto: `C:\Proyectos\enfermeria 2`
- Rama de la copia: `JJRama`
- Commit: `ae3d65e` — *“feat: integrar anulación de CPTs en SOAPIE y diseño moderno de scrollbars con cabecera fija”*
- Remoto: `https://github.com/Jess13798/SOAPIE.git`
- En la copia ya se copió `backend/.env` y se instalaron las dependencias de `frontend`; `npm run build --prefix frontend` compila correctamente.

Ramas existentes: `main`, `JJRama` (trabajo activo), `respaldo/*` (copias de seguridad) y varias `feature/*`.

---

## 1. Qué es el sistema

Aplicación web para el área de enfermería de un hospital. Permite:

- Iniciar sesión con usuarios del sistema hospitalario (`Empleados`, contraseña con bcrypt).
- Ver servicios de hospitalización, camas, pacientes internados y pacientes sin cama.
- Asignar, mover y transferir camas.
- Crear, modificar, firmar, imprimir y eliminar notas de enfermería con formato **SOAPIE**.
- Registrar signos vitales, ver su historial y su gráfica.
- Registrar el **Kardex** de enfermería por paciente y fecha.
- Registrar el **Balance Hídrico** por paciente, fecha y turno.
- Planificar cuidados con catálogo **NANDA / NOC / NIC**.
- Planificar servicios/CPT que se despachan al sistema de facturación **GalenHos / SIGH**.

El sistema se usa en producción contra la base real del hospital; la base de pruebas se restaura a diario.

---

## 2. Stack y ejecución

**Backend**
- Node.js + Express 5
- SQL Server mediante `mssql` (pool de conexiones)
- Autenticación propia con token HMAC-SHA256 (sin JWT externo)
- `bcryptjs` para contraseñas

**Frontend**
- Vue 3 (`<script setup>`) + Vite 7
- Tailwind CSS 4 (`@tailwindcss/vite`)
- TypeScript parcial (composables y utilidades)
- Iconos `lucide-vue-next`
- Sin Pinia: estado con composables (`useNotes`, `usePatients`, `useDashboard`, etc.)
- Solo dos rutas: `/` (Login) y `/dashboard` (todo lo demás se maneja dentro de `Dashboard.vue`)

**Comandos**
```sh
npm run server        # backend en http://localhost:3000 (sirve frontend/dist si existe)
npm run client        # Vite en http://localhost:5173 (proxy /api -> 3000)
npm run build --prefix frontend
npm test              # pruebas unitarias
npm run db:setup      # crea tablas y catálogos en la base configurada
npm run esquema       # regenera docs/esquema-bd.md desde SQL Server
```

**Variables de entorno** (`backend/.env`, no versionado):
```
DB_USER
DB_PASSWORD
DB_SERVER
DB_NAME
PORT
```
Opcional: `AUTH_SECRET` (si no se define se usa un secreto de desarrollo), `CORS_ORIGIN`.

> Ojo: `backend/.env.example` está desactualizado: menciona `DB_DATABASE` y `JWT_SECRET`, pero el código usa `DB_NAME` y `AUTH_SECRET`.

En desarrollo, Vite hace proxy de `/api` al backend en `3000`. En producción, Express sirve `frontend/dist` y hace fallback SPA a `index.html`.

---

## 3. Estructura del repositorio

```
backend/
  index.js                 arranque, CORS, estáticos, rutas y migraciones
  auth.js                  firma/verificación del token (8 h)
  database.js              re-export de src/config/db
  dbHelper.js              query() y executeProcedure()
  src/
    config/db.js           pool SQL Server
    core/db/migraciones.js ejecuta backend/sql/*.sql al arrancar
    core/domain/           utilidades de dominio
    core/utils/date.js     fecha oficial del servidor SQL
    modules/
      auth/                login
      pacientes/           servicios, camas, pacientes
      pacientes-sin-cama/  listado y asignación
      notas/               SOAPIE, signos vitales, plan, CPT
      kardex/
      balance-hidrico/
      catalogos/           NANDA/NOC/NIC, servicios CPT, fecha servidor
      diagnosticos/
      medicos/
      facturacion/         despacho, puntos de carga, anulación
      documentos/          servicios de documentos/impresión
      plan-cuidado/
  sql/                     migraciones idempotentes (se ejecutan al arrancar)
  sql-manual/              scripts que NO se ejecutan solos
  tests/                   pruebas del backend

frontend/
  src/
    views/                 Login.vue, Dashboard.vue
    components/            AppSidebar.vue, SuccessModal.vue, etc.
    composables/           useDashboard.ts
    services/api.ts        cliente HTTP central (Bearer token)
    modules/
      pacientes/           lista, detalle, camas, buscadores, modales
      notas/               NewNoteModal, NewNoteForm, SoapieEditor,
                           VitalsGrid, plan NANDA/NOC/NIC, impresión
      vitales/             historial, gráfica, resumen
      kardex/
      balance-hidrico/
```

Cada módulo del backend sigue el patrón `routes → services → repositories`, con validación y mapeo en el servicio.

---

## 4. Autenticación y seguridad

- `POST /api/login` valida usuario/contraseña contra `dbo.Empleados` con bcrypt.
- Devuelve un token firmado: `<payload_base64url>.<firma_base64url>`, expiración **8 horas**.
- El frontend guarda en `sessionStorage`: `token`, `empleadoLogueado`, `idEmpleado`, `turno`.
- Todas las rutas `/api` (excepto login) exigen `Authorization: Bearer <token>`.
- CORS con lista blanca (`CORS_ORIGIN`, por defecto `5173`, `5174`, `3000`) y túneles `trycloudflare.com`, `ngrok`.
- `index.html` se sirve sin caché para que un F5 traiga el build nuevo.

**Riesgo conocido:** si no se define `AUTH_SECRET` en producción, se usa el secreto por defecto del código.

---

## 5. Módulos funcionales

### 5.1 Pacientes y camas

- Servicios de hospitalización: se filtran por `IdTipoServicio = 3`.
- Se listan pacientes por servicio, con cama, estado, historia y cuenta.
- Tarjetas de cama con estado (ocupada/disponible), resumen de ocupación.
- Asignar cama, mover cama y transferir estancia.
- Tabla de **pacientes sin cama** con acción “Asignar Cama”.
- Búsqueda de pacientes y selector de servicio.

Endpoints principales:
`GET /api/servicios`, `GET /api/pacientes`, `GET /api/pacientes/buscar`,
`GET /api/pacientes-sin-cama`, `POST /api/asignar-cama`, `POST /api/mover-cama`,
`POST /api/transferencia-estancia`.

### 5.2 Nota de enfermería SOAPIE

Es el núcleo del sistema. Se abre desde el botón “+” de la tarjeta del paciente.

- Formato SOAPIE con pestañas: **S** (subjetivo), **O** (objetivo), **A** (análisis), **P** (plan).
- Turno automático según la hora del servidor: **Día 07:00–19:00** / **Noche 19:00–07:00**.
- Autoría: empleado logueado; fecha/hora del servidor.
- Signos vitales configurables desde `frontend/src/modules/notas/signosVitales.json` (no tabla), con soporte para edad pediátrica.
- Puntuación opcional **Wong-Baker** (`WongBakerScore`: 0, 2, 4, 6, 8, 10).
- Plan de cuidados **NANDA / NOC / NIC**:
  - Diagnóstico NANDA con comentario.
  - Resultado NOC con meta y evaluación.
  - Intervención NIC con indicador de realizada y motivo si no se realizó.
- Servicios/CPT planificados:
  - Búsqueda contra el catálogo del HIS.
  - Al guardar, se crea la orden oficial en GalenHos (`FactOrdenServicioAgregar1`) y el despacho en `FacturacionServicioDespacho`.
  - Si se retira un CPT de la nota, se **anula la orden** en GalenHos.
- Firma: al firmar, la nota queda **solo lectura** y se habilita la impresión.
- Eliminación: anula primero todas las órdenes CPT asociadas y luego borra la nota y sus tablas relacionadas.
- Historial de notas por paciente/servicio, con tarjetas y detalle.
- Impresión: `printNota.ts` y `printNotaSoapie.ts`.

Endpoints:
`GET /api/notas`, `POST /api/notas`, `DELETE /api/notas/:id`,
`GET /api/notas/:id/vitals`, `GET /api/atenciones/:idCuenta/vitals`,
`GET /api/notas/configuracion-signos-vitales`.

### 5.3 Signos vitales

- Grilla de captura dentro de la nota (`VitalsGrid.vue`).
- Historial paginado por nota o por cuenta de atención.
- Gráfica de evolución y resumen de últimos valores.
- Etiquetas unificadas: “Presión arterial”, “P. arterial” en tarjetas compactas, “Sat. oxígeno”.

### 5.4 Kardex de enfermería

- Registro por paciente, cuenta, servicio, fecha y turno.
- Guarda medicamentos, cuidados y observaciones del turno.
- Tabla propia `dbo.KardexEnfermeria`.
- Endpoints: `GET /api/kardex`, `POST /api/kardex`.
- En el SOAPIE se abre como modal; también existe la hoja reutilizable.

### 5.5 Balance hídrico

- Registro por paciente, cuenta, servicio, fecha y turno.
- Columnas de turno: **7-1 (Mañana)**, **1-7 (Tarde)**, **7-7 (Noche)** y total 24 h.
- Ingresos: V.O./enteral, solución endovenosa, medicinas, sangre/hemoderivados, agua de oxidación.
- Egresos: diuresis, deposición, vómitos, otros egresos, pérdidas insensibles.
- Cálculo automático de totales y balance por turno y 24 h.
- Datos fijos: paciente, servicio, habitación, enfermera, peso, fecha.
- Persistencia mediante el procedimiento almacenado **`dbo.usp_GuardarBalanceHidrico`**.
- Endpoints: `GET /api/balance-hidrico`, `POST /api/balance-hidrico`, `DELETE /api/balance-hidrico/:id`.
- Tabla propia `dbo.BalanceHidrico`.

### 5.6 Facturación / CPT

- Búsqueda de servicios CPT con procedimientos del HIS:
  - `dbo.FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento`
  - `dbo.FactCatalogoServiciosXidTipoFinanciamiento`
- Punto de carga por defecto: **716**; financiamiento SIS: **2**.
- Órdenes: `dbo.FactOrdenServicioAgregar1`.
- Actualización de saldos de cuenta: `dbo.FacturacionCuentasAtencionPtosActualizar`.
- Anulación de órdenes al eliminar o retirar CPT de una nota.
- Endpoints: `POST /api/facturacion/servicio-despacho`,
  `GET /api/facturacion/cuentas/:idCuenta/puntos-carga`,
  `POST /api/facturacion/cuentas/puntos-carga`,
  `POST /api/facturacion/cuentas/actualiza-importes`,
  `GET /api/facturacion/cuentas/:idCuenta/comprobantes-pago`,
  `GET /api/facturacion/ordenes/:idOrden`,
  `POST /api/facturacion/ordenes/:idOrden/anular`.

### 5.7 Catálogos, diagnósticos y médicos

- `GET /api/catalogos/nanda-noc-nic` — catálogo de plan de cuidados.
- `GET /api/catalogos/servicios` — búsqueda de CPT.
- `GET /api/catalogos/servicios/:idProducto/financiamiento`.
- `GET /api/tipos-financiamiento/:idTipoFinanciamiento`.
- `GET /api/fecha-servidor` — fecha oficial de SQL Server.
- `GET /api/diagnosticos` — diagnósticos de la atención.
- `GET /api/medicos` — médicos tratantes.

---

## 6. Base de datos

- Motor: **SQL Server**.
- Base principal del HIS: `sigh` (704 tablas, 13 vistas; ver `docs/esquema-bd.md`).
- La aplicación **lee** tablas del HIS y **crea sus propias tablas** para lo que no existe.

### Tablas del HIS que se usan (lectura)

`Empleados`, `Servicios`, `Camas`, `EstadosCama`, `TiposCama`, `Pacientes`,
`Atenciones`, `AtencionesEstanciaHospitalaria`, `FacturacionCuentasAtencion`,
`Especialidades`, `Medicos`, `MedicosEspecialidad`, `Diagnosticos`,
`SubclasificacionDiagnosticos`, `AtencionesDiagnosticos`,
`FactCatalogoServicios`, `FactCatalogoServiciosHosp`,
`FacturacionServicioDespacho`, `TiposFinanciamiento`.

### Tablas propias del proyecto

| Tabla | Contenido |
|---|---|
| `dbo.NotaEnfermeria` | Cabecera de la nota SOAPIE (paciente, cuenta, servicio, turno, textos, firma, Wong-Baker). |
| `dbo.NotaEnfermeriaSignosVitales` | Signos vitales por nota y fecha. |
| `dbo.NotaEnfermeriaDiagnostico` | Diagnósticos NANDA asociados a la nota y comentario. |
| `dbo.NotaEnfermeriaPlanNOC` | Resultado NOC, meta y evaluación. |
| `dbo.NotaEnfermeriaPlanNIC` | Intervención NIC, realizada y motivo. |
| `dbo.NotaEnfermeriaPlanServicio` | CPT planificados, con `IdOrden` de GalenHos. |
| `dbo.BalanceHidrico` | Registros de balance hídrico. |
| `dbo.KardexEnfermeria` | Registros de kardex. |
| `dbo.Catalogo_NANDA`, `dbo.Catalogo_NOC`, `dbo.Catalogo_NIC`, `dbo.NANDA_Interrelacion` | Catálogos de plan de cuidados. |

### Procedimientos almacenados utilizados

- `dbo.usp_GuardarBalanceHidrico` — alta/actualización del balance hídrico.
- `dbo.FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento` — búsqueda CPT.
- `dbo.FactCatalogoServiciosXidTipoFinanciamiento` — precio/condición por financiamiento.
- `dbo.FactOrdenServicioAgregar1` — alta de orden de servicio en GalenHos.
- `dbo.FacturacionCuentasAtencionPtosActualizar` — actualización de saldos de cuenta.
- `dbo.DevuelveIdDIagnostico` — diagnóstico principal de la atención.
- `dbo.TiposFinanciamientoSeleccionarPorId` — datos del financiamiento.
- `dbo.RetornaFechaServidorSQL` — fecha/hora oficial.

El resto de operaciones usa consultas parametrizadas mediante `dbHelper.query()`.

### Migraciones

- Los scripts de `backend/sql/` son idempotentes y se ejecutan **al arrancar el backend** (`src/core/db/migraciones.js`).
- `backend/sql-manual/` no se ejecuta automáticamente (migración de datos legacy).
- La restauración diaria de la base puede borrar las tablas propias; al reiniciar el backend se vuelven a crear.
- Migración a una base separada `soapie` (con synonyms) está pendiente y la hará el equipo de sistemas.

---

## 7. Reglas de negocio importantes

- **Turnos de nota**: el servidor decide día/noche (07:00–19:00 / 19:00–07:00); el usuario no lo elige.
- **Turnos de balance hídrico**: 7-1, 1-7 y 7-7.
- **Nota firmada**: no se puede editar; solo ver e imprimir.
- **Eliminar nota**: primero se anulan las órdenes CPT en GalenHos; luego se borran nota, vitales, plan y servicios.
- **CPT retirado**: se anula su orden en GalenHos para no dejar cargos huérfanos.
- **Servicio de la nota**: se resuelve desde la estancia abierta real; el `servicioId` del payload es respaldo.
- **Edad pediátrica**: viene en `TiposEdad` (años/meses/días/horas); no asumir siempre años.
- **Configuración de vitales**: vive en un JSON compartido, no en tabla, para sobrevivir a restauraciones.
- **Peso del paciente**: se usa para pérdidas insensibles y balance.

---

## 8. Preferencias y reglas de trabajo del usuario

1. **Idioma:** todo en español (UI, mensajes, commits y respuestas).
2. **Persistencia:** usar los **procedimientos almacenados existentes** siempre que existan; no inventar guardados locales ni simulaciones. Si algo no se guarda, es un error a corregir, no una limitación aceptable.
3. **Enfoque clínico:** la interfaz debe verse como para un **enfermero/a**, no para programadores. Evitar tecnicismos, nombres de tablas, IDs crudos o mensajes de depuración.
4. **No romper el SOAPIE:** el formulario, sus botones y sus modales deben seguir funcionando igual.
5. **Datos reales:** probar contra la base y los servicios reales; no usar mocks para validar flujos.
6. **Credenciales:** no versionar `backend/.env` ni cambiar usuarios/contraseñas sin pedirlo.
7. **Rama de trabajo:** `JJRama` para el proyecto; no mezclar cambios de otras ramas sin avisar.
8. **Verificación:** antes de dar algo por terminado, compilar (`npm run build --prefix frontend`) y probar el flujo en el navegador.

---

## 9. Estado actual y pendientes

### Hecho recientemente

- Integración de anulación de CPT en SOAPIE (al retirar un servicio o eliminar la nota).
- Cabecera fija y scrollbars modernas en listas de pacientes y pacientes sin cama.
- Integración con procedimientos del SIGH para catálogo de servicios y órdenes.
- Balance hídrico y kardex con sus tablas, endpoints y hojas.
- Catálogo NANDA/NOC/NIC integrado en el plan de cuidados.
- Impresión de nota firmada.
- Corrección de recarga infinita del historial de vitales y del warning de `idCuenta`.

### Pendientes

1. Migrar a base separada `soapie` (equipo de sistemas).
2. Corrección de nota firmada con rastro de auditoría.
3. Decidir si el plan de cuidados será manual o seguirá con catálogo NANDA.
4. Ajustar turnos (12 h o 3 turnos) si el hospital lo define.
5. Firma digital certificada (pendiente a propósito).
6. Optimizaciones opcionales del modal (reloj cada segundo, prop `pacientes` sin uso, catálogo NANDA al montar).
7. Capacitación al personal.
8. Control de edad pediátrica más estricto.
9. Limpiar `node_modules` versionado en la raíz del repositorio.

---

## 10. Problemas conocidos y cuidados

- **Restauración diaria:** la base de pruebas se restaura desde un backup del HIS y puede borrar las tablas propias. El backend las recrea al arrancar.
- **`AUTH_SECRET` sin definir:** en desarrollo usa el secreto por defecto; en producción debe configurarse.
- **`.env.example` desactualizado:** usa `DB_DATABASE`/`JWT_SECRET`, pero el código lee `DB_NAME`/`AUTH_SECRET`.
- **`node_modules` de la raíz versionado:** ~9,700 archivos dentro de Git; conviene eliminarlo del índice en el futuro.
- **Error de consola “Error al cargar notas”:** se observó al probar con un empleado ficticio; no está confirmado como bug real. Verificar con un usuario real antes de tocarlo.
- **Caché del navegador:** si un cambio no aparece, revisar si se está usando el build de `frontend/dist` en el puerto 3000 en lugar de Vite (5173) y recargar.
- **CORS:** si aparece “Origen no permitido”, agregar el origen exacto a `CORS_ORIGIN` y reiniciar el backend.

---

## 11. Archivos clave

**Backend**
- `backend/index.js` — arranque, CORS, rutas, SPA.
- `backend/auth.js` — token HMAC.
- `backend/dbHelper.js` — `query` y `executeProcedure`.
- `backend/src/config/db.js` — pool SQL Server.
- `backend/src/core/db/migraciones.js` — ejecución de `backend/sql`.
- `backend/src/modules/notas/repositories/notasRepository.js` — guardado completo de la nota, vitales, plan, CPT y eliminación.
- `backend/src/modules/notas/services/notasService.js` — validaciones y normalización.
- `backend/src/modules/balance-hidrico/repositories/balanceHidricoRepository.js` — usa `usp_GuardarBalanceHidrico`.
- `backend/src/modules/facturacion/` — despacho y anulación.
- `backend/sql/001-crear-tablas-notas.sql`, `005-balance-hidrico.sql`, `006-kardex.sql`, `007-usp-guardar-balance-hidrico.sql`.

**Frontend**
- `frontend/src/views/Dashboard.vue` — contenedor principal.
- `frontend/src/services/api.ts` — todas las llamadas HTTP.
- `frontend/src/modules/notas/components/NewNoteModal.vue` — modal SOAPIE.
- `frontend/src/modules/notas/components/NewNoteForm.vue` — formulario y pestañas.
- `frontend/src/modules/notas/components/SoapieEditor.vue`, `SoapieCarePlanSelector.vue`.
- `frontend/src/modules/notas/components/VitalsGrid.vue`.
- `frontend/src/modules/notas/composables/useNotes.ts` — guardar/firmar/eliminar.
- `frontend/src/modules/vitales/components/` — historial, gráfica y resumen.
- `frontend/src/modules/kardex/components/` — kardex (hoja y modal).
- `frontend/src/modules/balance-hidrico/components/` — balance (hoja y modal).
- `frontend/src/modules/notas/signosVitales.json` — configuración de vitales.

**Documentación**
- `docs/esquema-bd.md` — esquema generado de la base.
- `docs/avance-2026-11-06.md` — último avance detallado.
- `docs/cambios-cpt-procedimientos-sigh-2026-11-20.txt` — integración con procedimientos del SIGH.
- `docs/vitacora-desarrollo.md` — bitácora general.
- `docs/next-phase-architecture.md` — arquitectura objetivo.

---

## 12. Cómo verificar un cambio

1. Levantar backend (`npm run server`) y frontend (`npm run client`).
2. Iniciar sesión con un usuario real.
3. Elegir un servicio de hospitalización y un paciente con cuenta.
4. Probar el flujo afectado (nota, vitales, kardex, balance, CPT).
5. Confirmar que el dato quedó guardado (recargar y volver a consultar).
6. Compilar: `npm run build --prefix frontend`.
7. Ejecutar `npm test` si se tocó lógica de negocio.
