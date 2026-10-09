# Plan de mejoras — Arquitectura, seguridad y calidad

**Fecha de última actualización:** 2026-10-09
**Proyecto:** Sistema de Notas de Enfermería — Hospital Rezola (Cañete)
**Stack:** Node.js + Express 5 + SQL Server (`mssql`) · Vue 3 + Vite + TypeScript + Tailwind

Este documento describe el plan de mejoras del proyecto, qué hace cada paso y su estado.
Nace de la revisión de `backend/` y `frontend/`.

---

## Origen del plan

La arquitectura base del proyecto es correcta (separación por módulos con capas
`services` / `repositories`, servicios de API centralizados en el frontend). El
riesgo no es la arquitectura, sino la **deriva**: distintas formas de hacer lo
mismo, lógica que se acumula y falta de protección de la API.

Se detectaron estos puntos:

1. Dos archivos de configuración de BD y dos formas de conectarse (`dbHelper` vs `sql.connect` directo).
2. `backend/index.js` concentra todas las rutas y crecerá con cada módulo clínico.
3. La API no tenía autenticación: cualquiera podía llamar a los endpoints.
4. No existen pruebas automatizadas.
5. El frontend tiene los componentes en una sola carpeta plana.
6. `backend/.env` estaba versionado en Git.

---

## Paso 1 — Unificar la conexión a base de datos ✅ Hecho

**Objetivo:** una sola forma de conectarse y una sola configuración.

**Qué hace:**
- Deja `backend/src/config/db.js` como **única** fuente de configuración de BD.
- `backend/database.js` pasa a ser un *wrapper* de compatibilidad que re-exporta.
- Todos los repositories y `login.js` usan `dbHelper` (pool compartido + parámetros nombrados).
- `dbHelper.js` queda como el **único** lugar que llama a `sql.connect()`.

**Archivos:**
- `backend/src/config/db.js`, `backend/database.js`
- `backend/login.js`, `backend/check_table.js`
- `backend/src/modules/notas/repositories/notasRepository.js`
- `backend/src/modules/pacientes-sin-cama/repositories/pacientesSinCamaRepository.js`
- `backend/src/modules/notas/services/notasService.js`

**Bug corregido en este paso:** el refactor anterior dejó el repository de notas
incompleto. `notasService` llamaba a `getAllNotas`, `insertNota`, `updateNota`,
`insertVitales` y `deleteNotaById`, pero **no existían**. Se recuperaron del código
original (`git show <commit>:backend/notas.js`) y se reimplementaron con el patrón
de `dbHelper`. Esto repara GET/POST/DELETE de `/api/notas`.

---

## Paso 2 — Proteger la API ✅ Hecho

**Objetivo:** que nadie consuma los datos sin estar autenticado.

**Qué hace:**
- Nuevo `backend/auth.js`: firma y verifica tokens con `HMAC-SHA256` (módulo `crypto`
  de Node, sin dependencias nuevas). Vigencia: 8 horas.
- `POST /api/login` emite un `token` al validar credenciales.
- Todas las rutas `/api/*` (excepto login) exigen el token con el middleware `requiereAuth`.
- **CORS restringido** a los orígenes de `CORS_ORIGIN`; un origen desconocido recibe 403.
- Frontend: `api.ts` adjunta `Authorization: Bearer <token>` y ante un 401 limpia la
  sesión y vuelve al login. Login guarda el token; logout lo borra; el router exige token.

**Variables nuevas en `backend/.env`:**
- `AUTH_SECRET` — secreto para firmar los tokens (mantener privado).
- `CORS_ORIGIN` — orígenes permitidos, separados por coma.

**Archivos:**
- `backend/auth.js` (nuevo), `backend/index.js`, `backend/.env`
- `frontend/src/services/api.ts`, `frontend/src/views/Login.vue`
- `frontend/src/components/AppSidebar.vue`, `frontend/src/router/index.js`

**Validado:** sin token → 401; token falso → 401; token válido → 200; origen
permitido → 200; origen desconocido → 403; login inválido → 401. El frontend compila.

---

## Paso 3 — Routers por módulo ✅ Hecho

**Objetivo:** que `backend/index.js` deje de crecer con cada módulo clínico.

**Qué hace:** las rutas de cada dominio viven en `backend/src/modules/<modulo>/routes.js`
y se montan en `index.js` con `app.use('/api', ...)`. `index.js` queda solo como
"cableado" (middlewares + montaje de routers), sin lógica de negocio.

**Archivos nuevos (routers):**
- `backend/src/modules/auth/routes.js` → `POST /api/login` (público, va antes de la protección)
- `backend/src/modules/pacientes/routes.js` → `GET /api/pacientes`, `GET /api/servicios`
- `backend/src/modules/notas/routes.js` → `GET/POST /api/notas`, `DELETE /api/notas/:id`, `GET /api/notas/:id/vitals`
- `backend/src/modules/pacientes-sin-cama/routes.js` → `GET /api/pacientes-sin-cama`, `POST /api/asignar-cama`, `POST /api/mover-cama`, `POST /api/transferencia-estancia`
- `backend/src/modules/diagnosticos/routes.js` → `GET /api/diagnosticos`
- `backend/src/modules/medicos/routes.js` → `GET /api/medicos`

**`backend/index.js` reescrito:** carga `cors`, `express.json`, el estático del
frontend, monta `authRoutes` (público), aplica `requiereAuth` a `/api` y monta los
5 routers protegidos.

**Las URLs no cambian** → el frontend no se toca.

**Validado (servidor real + peticiones):** `servicios` 401 sin token / 200 con token;
`pacientes` y `pacientes-sin-cama` 200; `diagnosticos` y `medicos` 400 sin parámetro y
200 con él; `notas` 500 (tabla pendiente) igual que antes; `asignar-cama` 400 sin
campos; `login` 401 (sigue público). Todos los archivos pasan `node --check`.

---

## Paso 4 — Tests mínimos ✅ Hecho

**Objetivo:** evitar que un cambio rompa una función clínica sin que nadie se entere.

**Qué hace:** pruebas con el runner nativo `node:test` (incluido en Node, sin
dependencias nuevas) y dobles de prueba (*mocks*) de los repositories, de modo que
los tests **no necesitan la base de datos**. Se ejecutan con `npm test`.

**Archivos (nuevos):**
- `backend/tests/auth.test.js` — firma/verificación de tokens, manipulación, expiración y middleware `requiereAuth`.
- `backend/tests/login.test.js` — credenciales correctas/incorrectas, usuario inexistente y error de consulta (con bcrypt real).
- `backend/tests/notasService.test.js` — mapeo de filas, alta, edición, firma, borrado e historial de vitales.
- `backend/tests/pacientesSinCamaService.test.js` — asignar/mover cama y transferencia de estancia.
- `backend/tests/rutas.test.js` — que cada módulo exporte un router válido y exponga sus rutas.

**Configuración:** en `package.json`, el script `test` pasa de un error a
`node --test "backend/tests/*.test.js"`.

**Validado:** **30 tests, 30 pasan, 0 fallan** en ~0.75 s, sin tocar la BD.

---

## Paso 5 — Frontend por módulos ✅ Hecho

**Objetivo:** ordenar el frontend por dominio clínico.

**Qué se hizo:**

1. Se movieron los componentes de la carpeta plana `frontend/src/components/` a la
   estructura por dominio bajo `frontend/src/modules/`:
   - `modules/pacientes/components/` → `PatientListView`, `PatientDetail`,
     `PacientesSinCamaTable`, `BedModal`, `BedActionMenu`, `BedCountersHeader`,
     `StatsHeader`, `TotalBedsModal`, `TransferModal`.
   - `modules/notas/components/` → `NewNoteModal`, `NewNoteForm`, `NoteCard`,
     `NotesHistoryPanel`.
   - `modules/vitales/components/` → `VitalsOverview`, `VitalsHistoryModal`.
   - Se quedan en `components/` solo las piezas transversales: `AppSidebar`
     (layout) y `SuccessModal` (modal genérico).
2. Se movieron los composables a su módulo: `usePatients.ts` y `useBedModals.ts` a
   `modules/pacientes/composables/`; `useNotes.ts` a `modules/notas/composables/`.
   `useDashboard.ts` (orquestación visual) sigue en `composables/`.
3. Se actualizaron todos los imports a las rutas nuevas de módulo
   (`@/modules/<dominio>/components/...`) en `Dashboard.vue`, `PatientListView.vue`,
   `PatientDetail.vue` y `NewNoteModal.vue`. **Las URLs y el comportamiento no cambian.**
4. **Split de `NewNoteForm.vue`:** el formulario (439 líneas) se partió en tres
   subcomponentes de presentación dentro de `modules/notas/components/`:
   - `NoteShiftBar.vue` — selector de turno (día/noche) y autoría.
   - `VitalsGrid.vue` — grilla de signos vitales, incluida la presión SIS/DIA.
   - `SoapieEditor.vue` — pestañas y textarea SOAPIE.
   El estado reactivo `form`, la validación estricta, el `watch` de `initialNota`, el
   `defineExpose({ clearVitals })`, el toast y el pie de botones (Firmar / Guardar /
   Modificar / modo solo lectura) **se mantienen en el padre** para no alterar la lógica.
   Los tres hijos comparten el mismo objeto `form` (tipo `NotaFormState` en
   `modules/notas/notaForm.ts`).
5. Se actualizó `modules/README.md` con el árbol real y la explicación del split.

**Validado:** `npm run build` compila (1773 módulos). La app arranca en el navegador
y el login renderiza sin errores.

> Nota: el split movió la lógica de presentación, pero la validación y la construcción
> de la nota siguen exactamente en el componente padre. Se puede partir más adelante en
> subformularios por sección si se desea.

**Archivos:**
- Movidos: 16 componentes + 3 composables (ver árbol en `modules/README.md`).
- Nuevos: `modules/notas/notaForm.ts`, `modules/notas/components/NoteShiftBar.vue`,
  `modules/notas/components/VitalsGrid.vue`, `modules/notas/components/SoapieEditor.vue`.
- Modificados: `views/Dashboard.vue`, `modules/pacientes/components/PatientListView.vue`,
  `modules/pacientes/components/PatientDetail.vue`,
  `modules/notas/components/NewNoteModal.vue`, `modules/notas/components/NewNoteForm.vue`,
  `modules/README.md`.

---

## Anexo A — Migraciones de base de datos ✅ Aplicado (2026-10-09)

Las tablas `NotaEnfermeria` y `NotaEnfermeriaSignosVitales` **no existían** en la base
`sigh`. Se reconstruyó su definición a partir del código y del esquema histórico
(`backend/out2.json`) y **se aplicaron el 2026-10-09**.

**Archivo:** `backend/sql/001-crear-tablas-notas.sql` (idempotente, solo agrega).

**Validado tras aplicar:** `/api/notas` pasó de **500 a 200**. Flujo completo probado
end-to-end (crear → consultar vitales → borrar) y la base quedó sin datos de prueba
(0 notas, 0 signos vitales).

**Regla:** cada cambio de esquema = un archivo nuevo y numerado (`002-...sql`,
`003-...sql`). Nunca editar uno ya aplicado. Mantener los `.sql` en el repo documenta
la historia de la base de datos.

---

## Anexo B — Pendiente de seguridad / higiene

1. **`backend/.env` estaba versionado en Git** (se agregó antes del `.gitignore`).
   - **Hecho:** `git rm --cached backend/.env` **y commit** `a84af11` (el archivo
     local se conserva; ahora está `.gitignore`).
   - **Pendiente (importante): rotar las credenciales** porque estuvieron expuestas
     en el historial: cambiar `DB_PASSWORD` y generar un `AUTH_SECRET` nuevo.
   - Opcional: purgar el historial con `git filter-repo`/BFG si se requiere.
2. Los archivos `backend/out.json`, `backend/out2.json` son salidas de diagnóstico.

---

## Bitácora

| Fecha | Cambio |
|---|---|
| 2026-10-09 | Paso 1 — unificación de la conexión a BD y corrección del repository de notas. |
| 2026-10-09 | Paso 2 — protección de la API (token HMAC + CORS). |
| 2026-10-09 | Paso 3 — routers por módulo (`index.js` reducido a ~58 líneas). |
| 2026-10-09 | Paso 4 — tests mínimos con `node:test` (30 tests). |
| 2026-10-09 | Paso 5 — frontend por módulos (`modules/pacientes`, `notas`, `vitales`) y split de `NewNoteForm.vue` en `NoteShiftBar` + `VitalsGrid` + `SoapieEditor`. |
| 2026-10-09 | Anexo B — `git rm --cached backend/.env`. |
| 2026-10-09 | Anexo A — creado `backend/sql/001-crear-tablas-notas.sql` (sin ejecutar). |
| 2026-10-09 | Anexo A — tablas de notas **aplicadas** en `sigh`; `/api/notas` verificado 200 (crear → vitales → borrar, sin datos de prueba). |

---

## Estado resumido

| Paso | Descripción | Estado |
|---|---|---|
| 1 | Unificar conexión a BD (+ bug de notas) | ✅ Hecho |
| 2 | Proteger la API (token + CORS) | ✅ Hecho |
| 3 | Routers por módulo | ✅ Hecho |
| 4 | Tests mínimos | ✅ Hecho (30 tests) |
| 5 | Frontend por módulos | ✅ Hecho (split de NewNoteForm) |
| A | Script de tablas de notas | ✅ Aplicado (tablas creadas) |
| B | Sacar `.env` de Git y rotar secretos | 🔶 `.env` fuera de Git (falta commit + rotar) |
