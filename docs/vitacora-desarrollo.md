# Vitácora de desarrollo — Sistema SOAPIE (Notas de Enfermería)

> Repositorio: `Jess13798/SOAPIE` — Rama de trabajo: `JJRama`
> Última actualización: 6 de noviembre de 2026

---

## Resumen ejecutivo

Se desarrolló el módulo de **Notas de Enfermería (SOAPIE)** para el Hospital
Regional de Cañete (Perú), sobre una base existente (proyecto `enfermeria`).
El módulo permite registrar notas SOAPIE por paciente y servicio, tomar signos
vitales, gestionar plan de cuidados NANDA/NOC/NIC, y consultar historiales.
Se integró el trabajo del compañero (Piero) y se añadieron funcionalidades
propias (notas por servicio, vitales configurables, gráfica de vitales básicos,
impresión).

---

## Cronología de cambios (commits)

### 22 de octubre de 2026

#### `174d0f1` — Separa el historial de notas por servicio
- **Problema:** las notas de un paciente se mezclaban aunque hubiera pasado por
  varios servicios.
- **Solución (Opción B):** filtro por paciente + servicio (sin limitar a la
  internación actual).
- Migración `004-nota-enfermeria-servicio.sql`: agrega `IdServicio` (INT NULL,
  sin FK) e índice a `NotaEnfermeria`.
- El servicio se resuelve desde la estancia abierta real
  (`AtencionesEstanciaHospitalaria` vía `Atenciones.IdCuentaAtencion`); el
  `servicioId` del payload es solo respaldo.
- Al editar una nota, `IdServicio` no se modifica.
- `obtenerNotas` devuelve `servicioId` y `servicio`; el panel filtra por
  paciente + servicio; la herencia de plan también filtra.
- Se eliminó la columna "Servicio" de la lista de pacientes; el servicio se ve
  solo en el chip del encabezado (`BedCountersHeader`).
- `npm test` 71/71.

#### `17ac9c3` — Ordena el modal de nota
- Cabecera con título y fecha/hora.
- Datos del paciente (Paciente, Cuenta, Historia, Edad) arriba.
- Turno + enfermero en su propia fila (`NoteShiftBar`).
- Sin texto "Se detecta solo por la hora"; se quitó el "Enfermero/a
  Responsable" duplicado.
- Botón del libro (historial de signos vitales) movido a la cabecera.

#### `c826ecd` — Devuelve los datos del paciente a la cabecera del modal
- El usuario rechazó poner los datos del paciente abajo; quedan arriba y fijos.
- Build OK y 71/71 tests.

### 23 de octubre de 2026

#### `2b49b3c` — Hace configurables por servicio los signos vitales obligatorios
- Nuevo archivo `backend/src/modules/notas/signosVitalesConfig.js`.
- Hospitalización Pediátrica (213): obligatorios peso, talla, FC, FR, temp,
  saturación. Opcionales: p.cefálico, p.abdominal, PA, hemoglucotest.
- Otros servicios: los 10 obligatorios (comportamiento histórico).
- Endpoint `GET /api/notas/configuracion-signos-vitales`.
- UI: `*` en obligatorios, `(opc.)` en opcionales.
- Tests 73/73, build OK.

#### `a66634d` — Configuración compartida (sin consulta al backend)
- Se movió la regla a `frontend/src/modules/notas/signosVitales.json` (fuente
  única para frontend y backend).
- `useNotes.ts` ya no consulta al backend; calcula de forma síncrona.
- Eliminado `getConfiguracionSignosVitales` de `api.ts`.

#### `b9ff5c7` — Acomoda la fila de signos vitales
- Cuadrícula 5×2 (antes 10×1), encabezados de altura fija (19px).
- Leyenda: `* Obligatorio · Sin * es opcional`.
- Modal ensanchado a `max-w-6xl`.
- Verificado en navegador: cajas de 217×48 px parejas.

#### `70f8c3b` — Informe de avances del 23 de octubre
- `docs/informe-avances-jefa-enfermeria-2026-10-23.md`.

#### `f0ed03d` + `33a2e4c` — Botón de vitales básicos
- Nuevo botón teal (icono pulso) en la cabecera del modal, siempre disponible
  (incluso en nota nueva).
- Nuevo componente `VitalsChartModal.vue`: gráfica con datos fijos a la izquierda
  (paciente, servicio, habitación, enfermera, peso) y grilla por fecha/hora
  (6, 12, 6, 12) con P.A., Pulso, Temp, Sat.
- Corrección de "habitación" (mapeo `patient.habitacion`).

#### `1887b3e` — Rangos min/max configurables por servicio
- `signosVitales.json` ahora incluye `rangos` por servicio (basados en guías
  PALS de la hoja de funciones vitales).
- Backend valida min/max según el servicio; sin configuración usa límites
  técnicos actuales.
- Pediatría: temp 35.5–38.0, FC 50–205, FR 12–60, Sat. oxígeno 90–100,
  PA 39–131 / 16–83, peso 0.5–150, talla 30–200, etc.

#### `4211b86` — Ignora PDFs de referencia en docs
- `.gitignore` actualizado para `docs/*.pdf`, `*.xlsx`, `*.jpeg`, `*.jpg`,
  `*.png`.

#### `3916435` — Agrega `.env` con configuración local
- Subido `backend/.env` (credenciales del hospital) por solicitud del usuario.
- Eliminado `.env.example` (no solicitado).

#### `4d6c1ed` — Merge de `main` (Piero)
- Integración de los avances del compañero Piero.
- **Impresión de notas SOAPIE:** botón "Imprimir" en el modal (solo cuando la
  nota está firmada), usando `printNotaSoapie.ts`.
- Cambios en `pacientesRepository.js`, `usePatients.ts`, `types.ts`.
- Respaldo previo: `respaldo/jjrama-antes-de-piero-2`.
- Tests 73/73, build OK.

#### `f683b9b` — Vitales en una sola fila + CORS/túnel
- Grilla de vitales de 10 columnas (una sola fila) en pantallas grandes.
- Modal ensanchado a `max-w-7xl`.
- CORS actualizado para permitir orígenes de túneles (ngrok/cloudflare).
- Backend sirve `frontend/dist` en lugar de `frontend/` (para que funcione
  fuera de Vite).
- Tests 73/73.

#### `098700e` — Página de Pacientes responsiva
- En móvil: tarjetas (cama, nombre, estado, historia, cuenta, acciones).
- En desktop: tabla original.
- Tests 73/73.

### 3 de noviembre de 2026

#### Balance Hídrico (módulo independiente)
- Tabla `dbo.BalanceHidrico` (migración `005`) y endpoints
  `GET/POST/DELETE /api/balance-hidrico`.
- El repositorio crea la tabla si no existe (resiste restauraciones de la BD).
- El peso en kg se toma del último signo vital registrado de la atención.

#### Signos vitales obligatorios por defecto
- Servicios sin configuración propia: obligatorios peso, talla, FC, FR,
  temperatura y saturación; opcionales presión arterial, perímetro cefálico,
  perímetro abdominal y hemoglucotest.
- Pediatría (213) mantiene su configuración específica.
- Tests 78/78.

### 6 de noviembre de 2026

#### `e0c27d0` + `72fa060` — Etiquetas de vitales más claras
- “Presión arterial” en hojas/tablas; “P. arterial” en tarjetas compactas.
- “Sat. oxígeno” / “SAT. OXÍGENO” en lugar de `SatO₂` / `SpO₂`.
- Se aplicó en formulario, modal, tarjeta, grilla, gráfica, historial,
  resumen e impresión.

#### `7bc65f0` — Merge de Piero
- Se integró el módulo **Kardex** (`006-kardex.sql`, backend, rutas, servicio,
  repositorio, tests y `KardexModal.vue`).
- `backend/.env` salió del repositorio y se agregó a `.gitignore`; se conservó
  el `.env` local. No se cambiaron usuarios ni contraseñas.

#### `0c9a20c` — Elimina el módulo de auditoría de camas
- Se retiraron pantalla, menú, endpoint, funciones de auditoría, migraciones
  `002`/`003` y tests: 14 archivos, 883 líneas menos.
- Se conservaron la asignación/traslado de camas y las columnas nativas del HIS
  `IdUsuarioAuditoria` y `FechaAsignacion`.
- Las tablas `dbo.EnfermeriaAuditoriaCamas` y `dbo.EnfermeriaAuditoriaDetalle`
  siguen en la base; no se ejecutó `DROP TABLE`. La restauración diaria las
  elimina. La auditoría se verá después.

#### `16136a5` — Quita la pantalla del catálogo NANDA
- Se retiraron solo la vista/menú `NandaNocNicView` y su ruta: 4 archivos,
  145 líneas menos.
- Se conservaron las tablas `Catalogo_NANDA`, `Catalogo_NOC`, `Catalogo_NIC` y
  `NANDA_Interrelacion` con sus datos, el script
  `backend/sql/catalogo-nanda-noc-nic.sql`, el endpoint
  `/api/catalogos/nanda-noc-nic` y el selector del plan SOAPIE.
- Si el plan de cuidados debe ser 100 % manual, será un cambio aparte.

#### `4793901` — Corrige la recarga infinita del historial de vitales
- **Causa:** el reloj de `NewNoteModal` re-renderiza cada segundo y creaba un
  arreglo nuevo en `:registros-temporales`; el `watch` de
  `VitalsHistoryModal` lo interpretaba como cambio y recargaba sin parar.
- **Solución:** `registrosTemporalesNota` como `computed` estable en
  `NewNoteModal` y `watch` por clave estable de registros en
  `VitalsHistoryModal`.
- `KardexModal`: `idCuenta` ahora acepta `string | number`; desaparece el
  warning de Vue.
- Tests 82/82 y build correcto. Subido a `JJRama` y `main`.

#### Rendimiento del modal — diagnóstico, sin cambio de código
- Se midió contra la base real: catálogo NANDA 107 ms, Kardex 12 ms,
  Balance Hídrico 23 ms e historial de vitales 9 ms. La BD no es el cuello.
- Se detectó que `NewNoteForm` declara `pacientes` sin usarla y que
  `NewNoteModal` pasa `[patient]` (arreglo nuevo en cada render), además del
  reloj cada segundo; eso re-renderiza el formulario completo.
- El `timer` del reloj sigue después de cerrar el modal porque `NewNoteModal`
  queda montado y solo se limpia en `onUnmounted`.
- El usuario prefirió medir primero y dejarlo así porque no se demora tanto.
  No se aplicó optimización. Queda como pendiente opcional.
- Detalle completo: `docs/avance-2026-11-06.md`.

---

## Funcionalidades implementadas

### Notas de enfermería (SOAPIE)
- Crear, guardar (borrador) y firmar notas por paciente.
- Secciones SOAPIE: Subjetivo, Objetivo, Análisis, Plan, Intervención,
  Evaluación.
- Signos vitales dentro de la nota: peso, talla, p.cefálico, p.abdominal,
  hemoglucotest, PA, FC, FR, temp, Sat. oxígeno.
- Herencia del plan de cuidados de la nota anterior del paciente.
- Turno (día/noche) y hora puestos por el servidor.
- Notas separadas por servicio (filtro paciente + servicio).

### Plan de cuidados (NANDA/NOC/NIC)
- Búsqueda de diagnóstico NANDA por código o texto.
- Resultados esperados (NOC) y intervenciones (NIC) asociados.
- Meta y resultado observado por NOC.
- Marcado realizado/no realizada por NIC, con motivo cuando no se realizó.

### Signos vitales
- Historial de signos vitales por atención (botón del libro).
- Gráfica de vitales básicos (Sat. oxígeno, PA, Temp, Pulso) con datos fijos a la
  izquierda y grilla por fecha/hora.
- Rangos y obligatoriedad configurables por servicio (JSON).

### Pacientes y camas
- Listado por servicio, asignación/traslado de cama (sin módulo de auditoría).
- Pacientes sin cama (asignación).
- Página responsiva (tarjetas en móvil).

### Seguridad y acceso
- Login con usuario/contraseña (bcrypt).
- Token HMAC firmado.
- CORS restringido + túneles permitidos.

### Impresión
- Botón "Imprimir" en notas firmadas (formato de Piero).

---

## Decisiones técnicas clave

| Decisión | Detalle |
|---|---|
| Base de datos | SQL Server; configurar la conexión mediante variables de entorno locales. |
| Restauración diaria | `RESTORE DATABASE [sigh]` desde `D:\subir_data\data_galen\sigh_backup.bak`. Borraba datos propios → se propuso base `soapie` separada (pendiente). |
| `IdServicio` en `NotaEnfermeria` | INT NULL, sin FK (para futura base `soapie` separada). |
| Resolución de servicio | Desde la estancia abierta real; `servicioId` del payload es respaldo. |
| Configuración de vitales | Archivo JSON compartido (`signosVitales.json`), no tabla (sobrevive a restauraciones). |
| Turnos | Día (07:00–19:00) y noche. |
| Edad pediátrica | `TiposEdad` (A/M/D/H); 55% de ingresos pediátricos no en años. |

---

## Pendientes

1. Imprimir / PDF de la nota (impresión básica ya hecha por Piero).
2. Corrección de nota firmada con rastro.
3. Signos vitales como registro aparte (control propio).
4. Decidir si se implementan o quitan: antecedentes, diagnósticos, farmacia,
   laboratorio, imagen.
5. Endurecer SOAPIE I (estado de NIC).
6. Ajustar turnos (12 h o 3 turnos).
7. Firma digital certificada (pendiente a propósito).
8. Capacitación al personal.
9. Control de edad en pediatría.
10. Migración a base `soapie` separada (synonyms).
11. `backend/.env` ya no se versiona; si se decide volver a subirlo, discutirlo
    antes.
12. Optimizaciones opcionales del modal de la nota (ver
    `docs/avance-2026-11-06.md`).

---

## Archivos clave

- `backend/src/modules/notas/signosVitalesConfig.js` + `frontend/src/modules/notas/signosVitales.json`
- `frontend/src/modules/notas/components/VitalsGrid.vue`, `NewNoteModal.vue`, `NewNoteForm.vue`
- `frontend/src/modules/vitales/components/VitalsChartModal.vue`
- `frontend/src/modules/notas/components/NotesHistoryPanel.vue`
- `backend/src/modules/notas/repositories/notasRepository.js`, `services/notasService.js`
- `docs/informe-avances-jefa-enfermeria-2026-10-22.md`, `...-23.md`

---

*Vitácora actualizada el 6 de noviembre de 2026. Ramas `JJRama` y `main`.*
