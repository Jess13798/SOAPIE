# Módulos del frontend

Este directorio organiza el frontend por dominio clínico para mantener la vista principal más limpia.

## Objetivo
- separar la lógica por módulo
- evitar vistas gigantes con responsabilidades mezcladas
- reutilizar componentes y composables por área clínica
- preparar la app para nuevos documentos y workflows del hospital

## Estado actual (2026-10-09)

Los componentes que antes vivían todos juntos en `src/components/` ya están
agrupados por dominio bajo `src/modules/`:

```
src/
  components/                 # UI transversal / compartida
    AppSidebar.vue            # layout de navegación
    SuccessModal.vue          # modal genérico de éxito
  composables/
    useDashboard.ts           # orquestación visual del Dashboard
  modules/
    pacientes/
      components/             # PatientListView, PatientDetail, PacientesSinCamaTable,
                              # BedModal, BedActionMenu, BedCountersHeader,
                              # StatsHeader, TotalBedsModal, TransferModal
      composables/            # usePatients.ts, useBedModals.ts
    notas/
      components/             # NewNoteModal, NewNoteForm, NoteCard, NotesHistoryPanel
                              # + subcomponentes del formulario:
                              #   NoteShiftBar.vue, VitalsGrid.vue, SoapieEditor.vue
      composables/            # useNotes.ts
      notaForm.ts             # tipo compartido NotaFormState
    vitales/
      components/             # VitalsOverview, VitalsHistoryModal
    auditoria/
      components/             # AuditoriaCamasView (rastro de asignación de camas)
```

`Dashboard.vue` sigue siendo el orquestador: importa los componentes de cada
módulo y los composables, sin lógica de negocio de cada dominio.

## Formulario de nota (split)

`NewNoteForm.vue` se partió en tres subcomponentes de presentación que comparten
el mismo objeto reactivo `form` (mantenido en el padre, junto a la validación):

- `NoteShiftBar.vue` — turno automático (solo lectura) y autoría
- `VitalsGrid.vue` — grilla de signos vitales (incluye SIS/DIA)
- `SoapieEditor.vue` — pestañas y textarea SOAPIE

La lógica de guardado, validaciones estrictas, `watch` de la nota inicial y
`clearVitals()` permanecen en `NewNoteForm.vue` para no cambiar el comportamiento.

## Estructura recomendada (siguiente)

- kardex/
- balance/
- documentacion/

Cada módulo debería contar con:
- vista o pantalla principal
- formularios específicos
- composables de estado
- servicios de API
- tipos del dominio

## Regla de arquitectura

La lógica de negocio no debe vivir mezclada dentro de componentes de presentación. La idea es mantener una separación clara entre:
- capa de presentación
- capa de estado/composable
- capa de servicio HTTP
- dominio clínico

Con esto el proyecto puede crecer hacia SOAPIE, Kardex, balance hídrico, señales vitales y futuros documentos sin romper la base actual.
