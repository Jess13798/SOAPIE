import test from 'node:test'
import assert from 'node:assert/strict'
import { agregarServicioPlanificado, quitarServicioPlanificado } from './serviciosPlanificados.ts'

const servicio = {
  id: 12,
  codigo: '00100',
  nombre: 'Valoración de prueba',
}

test('agrega el servicio seleccionado a la lista planificada', () => {
  assert.deepEqual(agregarServicioPlanificado([], servicio), [servicio])
})

test('no duplica un servicio ya planificado', () => {
  const servicios = agregarServicioPlanificado([], servicio)
  assert.equal(agregarServicioPlanificado(servicios, servicio), servicios)
})

test('permite quitar un servicio planificado', () => {
  assert.deepEqual(quitarServicioPlanificado([servicio], servicio.id), [])
})
