// Propósito: Implementación del archivo serviciosPlanificados.test.ts.
// Responsable de mantener separadas las reglas de este archivo.

import test from 'node:test'
import assert from 'node:assert/strict'
import { agregarServicioPlanificado, quitarServicioPlanificado } from './serviciosPlanificados.ts'

const servicio = {
  id: 12,
  codigo: '00100',
  nombre: 'Valoración de prueba',
}
const servicioExistente = {
  ...servicio,
  cantidad: 1,
  idAtencionDiagnostico: null,
  codigoCIE10: null,
}

test('agrega el servicio seleccionado a la lista planificada', () => {
  assert.deepEqual(agregarServicioPlanificado([], servicio), [{
    ...servicio,
    cantidad: 1,
    idAtencionDiagnostico: null,
    codigoCIE10: null,
  }])
})

test('agrega un CPT con cantidad inicial y el diagnóstico sugerido', () => {
  const diagnostico = { IdAtencionDiagnostico: 88, CodigoCIE10: 'R19.8' }
  assert.deepEqual(agregarServicioPlanificado([], servicio, diagnostico), [{
    ...servicio,
    cantidad: 1,
    idAtencionDiagnostico: 88,
    codigoCIE10: 'R19.8',
  }])
})

test('no duplica un servicio ya planificado', () => {
  const servicios = agregarServicioPlanificado([], servicio)
  assert.equal(agregarServicioPlanificado(servicios, servicio), servicios)
})

test('permite quitar un servicio planificado', () => {
  assert.deepEqual(quitarServicioPlanificado([servicioExistente], servicio.id), [])
})
