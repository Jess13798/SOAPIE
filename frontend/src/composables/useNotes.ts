import { ref, type Ref } from 'vue'
import type { Patient, NotaEnfermeria } from '@/types'
import { notasService } from '@/services/api'

export function useNotes(pacientes: Ref<Patient[]>) {
  const notas = ref<NotaEnfermeria[]>([])
  const isNewNoteModalOpen = ref(false)
  const patientForNewNote = ref<Patient | null>(null)
  const selectedNoteForModal = ref<NotaEnfermeria | null>(null)

  async function cargarNotasDesdeBackend() {
    try {
      const notasBD = await notasService.getNotas()
      notas.value = notasBD || []
      sessionStorage.setItem('notasEnfermeria', JSON.stringify(notas.value))
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
      idCuenta: patient?.numCuenta || nota.idCuenta || '',
      idEmpleado: sessionStorage.getItem('idEmpleado') || '',
    }

    try {
      const data = await notasService.guardarNota(payload)
      if (!data.success || !data.id) {
        throw new Error('El servidor no confirmó el guardado de la nota.')
      }

      const notaGuardada = { ...nota, id: String(data.id) }
      const index = notas.value.findIndex(n => n.id === nota.id || n.id === notaGuardada.id)
      if (index !== -1) {
        const newNotas = [...notas.value]
        newNotas[index] = notaGuardada
        notas.value = newNotas
      } else {
        notas.value = [notaGuardada, ...notas.value]
      }
      sessionStorage.setItem('notasEnfermeria', JSON.stringify(notas.value))
      return { success: true, id: data.id }
    } catch (err) {
      console.error('Error guardando nota en BD:', err)
      return { success: false, error: err }
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
