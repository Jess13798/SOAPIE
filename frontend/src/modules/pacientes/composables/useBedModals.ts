// Propósito: Composable reutilizable del módulo "pacientes".
// Responsable de mantener separadas las reglas de este archivo.

import { ref, type Ref } from 'vue'
import type { Patient } from '@/types'
import { camasService, type PacienteSinCama, type TransferenciaEstanciaPayload } from '@/services/api'

/**


 * Implementa la operación "useBedModals".


 * Mantiene aislada la responsabilidad principal de este archivo.


 */


export function useBedModals(
  recargarPacientes: (servicioId: string) => Promise<void>,
  servicioSeleccionado: Ref<string>
) {
  const isBedModalOpen = ref(false)
  const isTotalBedsModalOpen = ref(false)
  const isTransferModalOpen = ref(false)
  const isBedSubmitting = ref(false)
  const isTransferSubmitting = ref(false)
  const selectedPatientForBed = ref<Patient | null>(null)
  const pacienteSinCamaSeleccionado = ref<PacienteSinCama | null>(null)
  const patientForTransfer = ref<Patient | null>(null)
  const refreshPacientesSinCamaToken = ref(0)

  // Éxito / Feedback
  const showSuccessModal = ref(false)
  const successModalType = ref<'nota' | 'asignacion-cama' | 'transferencia'>('nota')

  /**


   * Implementa la operación "handleViewBed".


   * Mantiene aislada la responsabilidad principal de este archivo.


   */


  function handleViewBed(patient: Patient) {
    selectedPatientForBed.value = patient
    pacienteSinCamaSeleccionado.value = null
    isBedModalOpen.value = true
  }

  /**


   * Implementa la operación "handleAssignBed".


   * Mantiene aislada la responsabilidad principal de este archivo.


   */


  function handleAssignBed(pacienteSinCama: PacienteSinCama) {
    pacienteSinCamaSeleccionado.value = pacienteSinCama
    isBedModalOpen.value = true
  }

  /**


   * Implementa la operación "handleViewTotalBeds".


   * Mantiene aislada la responsabilidad principal de este archivo.


   */


  function handleViewTotalBeds() {
    isTotalBedsModalOpen.value = true
  }

  /**


   * Implementa la operación "handleViewTransfer".


   * Mantiene aislada la responsabilidad principal de este archivo.


   */


  function handleViewTransfer(patient: Patient) {
    patientForTransfer.value = patient
    isTransferModalOpen.value = true
  }

  /**


   * Implementa la operación "handleCloseBedModal".


   * Mantiene aislada la responsabilidad principal de este archivo.


   */


  function handleCloseBedModal() {
    pacienteSinCamaSeleccionado.value = null
    selectedPatientForBed.value = null
    isBedModalOpen.value = false
  }

  /**


   * Implementa la operación "handleCloseTransferModal".


   * Mantiene aislada la responsabilidad principal de este archivo.


   */


  function handleCloseTransferModal() {
    patientForTransfer.value = null
    isTransferModalOpen.value = false
  }

  /**


   * Implementa la operación "handleSelectPaciente".


   * Mantiene aislada la responsabilidad principal de este archivo.


   */


  async function handleSelectPaciente(paciente: Patient) {
    if (isBedSubmitting.value) return
    const idCama = Number(paciente.id)
    if (!Number.isFinite(idCama)) {
      console.error('IdCama inválido', { idCama })
      return
    }

    isBedSubmitting.value = true
    try {
      let data: { success: boolean; mensaje?: string }

      if (pacienteSinCamaSeleccionado.value) {
        const idPaciente = Number(pacienteSinCamaSeleccionado.value.IdPaciente)
        const idCuentaAtencion = Number(pacienteSinCamaSeleccionado.value.IdCuentaAtencion)
        const idMedico = (paciente as any).idMedicoOrdena ? Number((paciente as any).idMedicoOrdena) : null

        if (!Number.isFinite(idPaciente) || !Number.isFinite(idCuentaAtencion)) {
          console.error('IDs inválidos para asignar cama', { idCama, idPaciente, idCuentaAtencion })
          return
        }

        data = await camasService.asignarCama({
          IdPaciente: idPaciente,
          IdCuentaAtencion: idCuentaAtencion,
          IdCama: idCama,
          IdMedicoOrdena: idMedico,
        })
      } else if (selectedPatientForBed.value) {
        const idPaciente = Number(selectedPatientForBed.value.id)
        const idCuentaAtencion = Number(selectedPatientForBed.value.numCuenta)
        if (!Number.isFinite(idPaciente) || !Number.isFinite(idCuentaAtencion)) {
          console.error('IDs inválidos para mover cama', { idPaciente, idCuentaAtencion })
          return
        }

        data = await camasService.moverCama({
          IdPaciente: idPaciente,
          IdCama: idCama,
          IdCuentaAtencion: idCuentaAtencion,
        })
      } else {
        isBedModalOpen.value = false
        return
      }

      if (!data?.success) {
        throw new Error(data?.mensaje || 'Error en la operación de cama')
      }

      await recargarPacientes(servicioSeleccionado.value)
      refreshPacientesSinCamaToken.value++
      handleCloseBedModal()

      successModalType.value = 'asignacion-cama'
      showSuccessModal.value = true
    } catch (err: any) {
      console.error('Error al procesar la cama:', err)
      alert(err.message || 'Error al procesar la cama')
    } finally {
      isBedSubmitting.value = false
    }
  }

  /**


   * Implementa la operación "handleConfirmTransfer".


   * Mantiene aislada la responsabilidad principal de este archivo.


   */


  async function handleConfirmTransfer(payload: any) {
    if (isTransferSubmitting.value) return
    const {
      idCuentaAtencion,
      idMedicoOrdena,
      idServicio,
      idDiagnostico,
      fechaOcupacion,
      horaOcupacion,
      idProducto,
      idEmpleado,
      fechaModificacion,
      idPaciente,
    } = payload

    const pacienteIdEfectivo = idPaciente ?? payload.pacienteId
    if (!idCuentaAtencion || !idServicio || !fechaOcupacion || !horaOcupacion) {
      console.error('Datos incompletos para registrar transferencia', payload)
      return
    }

    isTransferSubmitting.value = true
    try {
      const data = await camasService.registrarTransferencia({
        idAtencion: idCuentaAtencion,
        idMedicoOrdena,
        idServicio,
        idDiagnostico,
        fechaOcupacion,
        horaOcupacion,
        idProducto,
        idEmpleado: idEmpleado || sessionStorage.getItem('idEmpleado'),
        fechaModificacion: fechaModificacion || fechaOcupacion,
        idPaciente: pacienteIdEfectivo,
      })

      if (!data?.success) throw new Error(data?.mensaje || 'Error al registrar transferencia')

      successModalType.value = 'transferencia'
      showSuccessModal.value = true
      handleCloseTransferModal()
      await recargarPacientes(servicioSeleccionado.value)
    } catch (err: any) {
      console.error('Error guardando transferencia', err)
      alert(err?.message || 'No se pudo guardar la transferencia.')
    } finally {
      isTransferSubmitting.value = false
    }
  }

  return {
    isBedModalOpen,
    isTotalBedsModalOpen,
    isTransferModalOpen,
    isBedSubmitting,
    isTransferSubmitting,
    selectedPatientForBed,
    pacienteSinCamaSeleccionado,
    patientForTransfer,
    refreshPacientesSinCamaToken,
    showSuccessModal,
    successModalType,
    handleViewBed,
    handleAssignBed,
    handleViewTotalBeds,
    handleViewTransfer,
    handleCloseBedModal,
    handleCloseTransferModal,
    handleSelectPaciente,
    handleConfirmTransfer,
  }
}
