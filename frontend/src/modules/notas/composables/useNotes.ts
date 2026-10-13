import { ref, type Ref } from 'vue'
import type { Patient, NotaEnfermeria, SignoVitalHistorial } from '@/types'
import { notasService } from '@/services/api'

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
    Peso: vitals.peso || null,
    Talla: vitals.talla || null,
    P_Cefalico: vitals.pCefalico || null,
    P_Abdominal: vitals.pAbdominal || null,
    Hemoglucotest: vitals.hemoglucotest || vitals.glucosa || null,
    Presion_Arterial: vitals.presionArterial || null,
    Frec_Cardiaca: vitals.frecuenciaCardiaca || null,
    Frec_Respiratoria: vitals.frecuenciaRespiratoria || null,
    Temperatura: vitals.temperatura || null,
    Saturacion: vitals.saturacionOxigeno || null,
    IdEmpleado: idEmpleado || null,
  }
}

export function useNotes(pacientes: Ref<Patient[]>) {
  const notas = ref<NotaEnfermeria[]>([])
  const isNewNoteModalOpen = ref(false)
  const patientForNewNote = ref<Patient | null>(null)
  const selectedNoteForModal = ref<NotaEnfermeria | null>(null)

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
    const payload = {
      ...nota,
      idCuenta: nota.idCuenta || patient?.numCuenta || '',
      idEmpleado: sessionStorage.getItem('idEmpleado') || '',
    }

    try {
      const data = await notasService.guardarNota(payload)
      if (!data.success || !data.id) {
        throw new Error('El servidor no confirmó el guardado de la nota.')
      }

      const notaAnterior = notas.value.find(n => n.id === nota.id)
      const historialTemporal = notaAnterior?.historialTemporalSignosVitales
        || nota.historialTemporalSignosVitales
        || []
      const notaGuardada = {
        ...nota,
        id: String(data.id),
        estadoGuardado: historialTemporal.length ? 'cambios-pendientes' as const : 'guardada' as const,
        historialTemporalSignosVitales: historialTemporal,
      }
      const index = notas.value.findIndex(n => n.id === nota.id || n.id === notaGuardada.id)
      if (index !== -1) {
        const newNotas = [...notas.value]
        newNotas[index] = notaGuardada
        notas.value = newNotas
      } else {
        notas.value = [notaGuardada, ...notas.value]
      }
      return { success: true, persisted: true, id: data.id }
    } catch (err) {
      console.error('Error guardando nota en BD:', err)
      // Se conserva temporalmente en memoria de la sesión si falla SQL Server.
      const notaAnterior = notas.value.find(n => n.id === nota.id)
      const historialTemporal = [
        ...(notaAnterior?.historialTemporalSignosVitales || nota.historialTemporalSignosVitales || []),
        snapshotVitals(nota, String(payload.idEmpleado || '')),
      ]
      const esNotaPersistida = notaAnterior
        ? /^\d+$/.test(notaAnterior.id)
        : /^\d+$/.test(nota.id)
      const notaTemporal: NotaEnfermeria = {
        ...nota,
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
    guardarNota,
    firmarNota,
  }
}
