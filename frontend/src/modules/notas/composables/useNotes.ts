import { computed, ref, type Ref } from 'vue'
import type { Patient, NotaEnfermeria, SignoVitalHistorial } from '@/types'
import { notasService } from '@/services/api'
import { CAMPOS_OBLIGATORIOS_POR_DEFECTO } from '../vitalesConfig'

function mergeNotes(databaseNotes: NotaEnfermeria[], currentNotes: NotaEnfermeria[]) {
  const merged = new Map(databaseNotes.map(note => [note.id, note]))
  for (const note of currentNotes) {
    if (note.estadoGuardado && note.estadoGuardado !== 'guardada') {
      merged.set(note.id, note)
    }
  }
  return Array.from(merged.values())
}

function snapshotVitals(nota: NotaEnfermeria, idEmpleado: string): SignoVitalHistorial {
  const vitals = nota.signosVitales || { temperatura: '', saturacionOxigeno: '' }
  return {
    IdSignoVital: `temporal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    Fecha_Hora: new Date().toISOString(),
    Peso: vitals.peso ?? null,
    Talla: vitals.talla ?? null,
    P_Cefalico: vitals.pCefalico ?? null,
    P_Abdominal: vitals.pAbdominal ?? null,
    Hemoglucotest: vitals.hemoglucotest ?? vitals.glucosa ?? null,
    Presion_Arterial: vitals.presionArterial ?? null,
    Frec_Cardiaca: vitals.frecuenciaCardiaca ?? null,
    Frec_Respiratoria: vitals.frecuenciaRespiratoria ?? null,
    Temperatura: vitals.temperatura ?? null,
    Saturacion: vitals.saturacionOxigeno ?? null,
    IdEmpleado: idEmpleado || null,
  }
}

function normalizedVital(value: unknown) {
  const text = String(value ?? '').trim()
  if (!text) return ''
  const numeric = Number(text)
  return Number.isFinite(numeric) ? String(numeric) : text
}

function hasVitalChanges(next: NotaEnfermeria, previous?: NotaEnfermeria) {
  if (!previous) return true
  const nextVitals = next.signosVitales || {}
  const previousVitals = previous.signosVitales || {}
  const fields: Array<keyof NonNullable<NotaEnfermeria['signosVitales']>> = [
    'peso', 'talla', 'pCefalico', 'pAbdominal', 'hemoglucotest',
    'presionArterial', 'frecuenciaCardiaca', 'frecuenciaRespiratoria',
    'temperatura', 'saturacionOxigeno',
  ]
  return fields.some(field => normalizedVital(nextVitals[field]) !== normalizedVital(
    field === 'hemoglucotest'
      ? previousVitals.hemoglucotest ?? previousVitals.glucosa
      : previousVitals[field],
  ))
}

export function useNotes(pacientes: Ref<Patient[]>, servicioSeleccionado?: Ref<string>) {
  const notas = ref<NotaEnfermeria[]>([])
  const isNewNoteModalOpen = ref(false)
  const patientForNewNote = ref<Patient | null>(null)
  const selectedNoteForModal = ref<NotaEnfermeria | null>(null)

  // Qué signos vitales exige cada servicio. La configuración vive en el backend
  // para que la pantalla y la validación del servidor coincidan.
  const obligatoriosPorDefecto = ref<string[]>([...CAMPOS_OBLIGATORIOS_POR_DEFECTO])
  const obligatoriosPorServicio = ref<Record<string, string[]>>({})
  const camposObligatoriosVitales = computed(
    () => obligatoriosPorServicio.value[servicioSeleccionado?.value || ''] || obligatoriosPorDefecto.value,
  )

  async function cargarConfiguracionSignosVitales() {
    try {
      const config = await notasService.getConfiguracionSignosVitales()
      if (Array.isArray(config.porDefecto) && config.porDefecto.length > 0) {
        obligatoriosPorDefecto.value = config.porDefecto
      }
      obligatoriosPorServicio.value = config.porServicio || {}
    } catch (error) {
      // Si falla, se mantiene "todos obligatorios": nunca se guarda una nota
      // incompleta por un problema de red.
      console.error('No se pudo cargar la configuración de signos vitales:', error)
    }
  }
  cargarConfiguracionSignosVitales()

  async function cargarNotasDesdeBackend() {
    try {
      const notasBD = await notasService.getNotas()
      notas.value = mergeNotes(notasBD || [], notas.value)
      return true
    } catch (err) {
      console.error('Error cargando notas desde BD:', err)
      return false
    }
  }

  function handleViewNote(nota: NotaEnfermeria, fallbackPatient?: Patient | null) {
    const patient = pacientes.value.find(p =>
      String(p.id) === String(nota.pacienteId) ||
      (p.numCuenta && String(p.numCuenta) === String(nota.pacienteId)) ||
      (p.numCuenta && String(p.numCuenta) === String((nota as any).idCuenta))
    )
    if (patient) {
      patientForNewNote.value = patient
    } else if (fallbackPatient) {
      patientForNewNote.value = fallbackPatient
    }
    selectedNoteForModal.value = nota
    isNewNoteModalOpen.value = true
  }

  function handleNewNoteFromList(patient: Patient) {
    selectedNoteForModal.value = null
    patientForNewNote.value = patient
    isNewNoteModalOpen.value = true
  }

  function handleEditDraft(nota: NotaEnfermeria, fallbackPatient?: Patient | null) {
    handleViewNote(nota, fallbackPatient)
  }

  // Nota más reciente de un paciente (mismo id o número de cuenta). Se usa para
  // heredar el plan de cuidados NANDA/NOC/NIC al crear una nota nueva.
  function ultimaNotaDePaciente(patient: Patient | null): NotaEnfermeria | null {
    if (!patient) return null
    const servicioId = servicioSeleccionado?.value || ''
    const propias = notas.value.filter(nota => {
      const esDelPaciente =
        String(nota.pacienteId) === String(patient.id) ||
        (patient.numCuenta && String(patient.numCuenta) === String(nota.pacienteId)) ||
        (patient.numCuenta && String(patient.numCuenta) === String(nota.idCuenta))
      if (!esDelPaciente) return false
      // El plan se hereda solo de notas del mismo servicio: lo escrito en
      // pediatría no debe precargarse cuando el paciente está en cirugía.
      if (!servicioId) return true
      return nota.servicioId != null && String(nota.servicioId) === String(servicioId)
    })
    if (!propias.length) return null
    return [...propias].sort((a, b) => `${b.fecha}T${b.hora}`.localeCompare(`${a.fecha}T${a.hora}`))[0]
  }

  function handleCloseModal() {
    isNewNoteModalOpen.value = false
    selectedNoteForModal.value = null
  }

  async function guardarNota(nota: NotaEnfermeria) {
    const pid = nota.pacienteId
    if (!pid || pid === 'undefined' || pid === 'null' || pid === '') {
      console.error('No se puede guardar: la nota no tiene pacienteId válido', pid)
      return { success: false, error: new Error('No se puede guardar la nota sin un paciente válido.') }
    }

    const patient = pacientes.value.find(p => String(p.id) === String(nota.pacienteId))
    // La nota nace en el servicio que está viendo la enfermera. Al editar se
    // conserva el servicio original de la nota.
    const servicioId = nota.servicioId ?? (servicioSeleccionado?.value || '')
    const payload = {
      ...nota,
      idCuenta: nota.idCuenta || patient?.numCuenta || '',
      idEmpleado: sessionStorage.getItem('idEmpleado') || '',
      servicioId,
    }

    try {
      const data = await notasService.guardarNota(payload)
      if (!data.success || !data.id) {
        throw new Error('El servidor no confirmó el guardado de la nota.')
      }

      const notaAnterior = notas.value.find(n => n.id === nota.id)
      const notaGuardada = {
        ...nota,
        // El servidor decide el turno según la hora; se refleja lo que guardó.
        turno: data.turno || nota.turno,
        id: String(data.id),
        servicioId: data.servicioId ?? (Number(servicioId) || null),
        estadoGuardado: 'guardada' as const,
        historialTemporalSignosVitales: [],
      }
      const index = notas.value.findIndex(n => n.id === nota.id || n.id === notaGuardada.id)
      if (index !== -1) {
        const newNotas = [...notas.value]
        newNotas[index] = notaGuardada
        notas.value = newNotas
      } else {
        notas.value = [notaGuardada, ...notas.value]
      }
      return {
        success: true,
        persisted: true,
        id: data.id,
        vitalesRegistrados: data.vitalesRegistrados,
      }
    } catch (err) {
      console.error('Error guardando nota en BD:', err)
      // Se conserva temporalmente en memoria de la sesión si falla SQL Server.
      const notaAnterior = notas.value.find(n => n.id === nota.id)
      const vitalesModificados = hasVitalChanges(nota, notaAnterior)
      const historialTemporal = [
        ...(notaAnterior?.historialTemporalSignosVitales || nota.historialTemporalSignosVitales || []),
        ...(vitalesModificados ? [snapshotVitals(nota, String(payload.idEmpleado || ''))] : []),
      ]
      const esNotaPersistida = notaAnterior
        ? /^\d+$/.test(notaAnterior.id)
        : /^\d+$/.test(nota.id)
      const notaTemporal: NotaEnfermeria = {
        ...nota,
        servicioId: nota.servicioId ?? (Number(servicioId) || null),
        estadoGuardado: esNotaPersistida
          ? 'cambios-pendientes'
          : 'temporal',
        historialTemporalSignosVitales: historialTemporal,
      }
      const index = notas.value.findIndex(n => n.id === nota.id)
      if (index !== -1) {
        const newNotas = [...notas.value]
        newNotas[index] = notaTemporal
        notas.value = newNotas
      } else {
        notas.value = [notaTemporal, ...notas.value]
      }
      return { success: true, persisted: false, id: notaTemporal.id, error: err }
    }
  }

  function firmarNota(nota: NotaEnfermeria) {
    const now = new Date()
    const fechaFirmada = now.toISOString().split('T')[0]
    const horaFirmada = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    return guardarNota({ ...nota, isFirmada: true, fechaFirmada, horaFirmada })
  }

  return {
    notas,
    isNewNoteModalOpen,
    patientForNewNote,
    selectedNoteForModal,
    cargarNotasDesdeBackend,
    handleViewNote,
    handleNewNoteFromList,
    handleEditDraft,
    handleCloseModal,
    ultimaNotaDePaciente,
    guardarNota,
    firmarNota,
    camposObligatoriosVitales,
  }
}
