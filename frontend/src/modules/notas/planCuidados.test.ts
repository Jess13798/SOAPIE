// Tests de la lógica pura del plan de cuidados (sin Vue y sin base de datos).
import test from 'node:test'
import assert from 'node:assert/strict'

import {
    NIC_NO_REALIZADA_MARCADOR,
    estadoNic,
    heredarPlanCuidados,
    hidratarPlanCuidados,
    lineasIntervenciones,
} from './planCuidados.ts'

function plan(overrides = {}) {
    return {
        idNANDA: 1,
        codigoNANDA: '00123',
        diagnostico: 'Dolor agudo',
        comentario: '',
        nocIds: [10],
        nicIds: [20, 21],
        nicRealizadasIds: [],
        nicNoRealizadas: {},
        nocMetas: {},
        nocEvaluaciones: {},
        noc: [{ id: 10, codigo: '1605', resultado: 'Control del dolor' }],
        nic: [
            { id: 20, codigo: '1400', intervencion: 'Manejo del dolor' },
            { id: 21, codigo: '2210', intervencion: 'Administración de analgésicos' },
        ],
        ...overrides,
    }
}

test('estadoNic distingue realizada, no realizada y sin registrar', () => {
    const p = plan({ nicRealizadasIds: [20], nicNoRealizadas: { 21: 'paciente en ayunas' } })
    assert.equal(estadoNic(p, 20), 'realizada')
    assert.equal(estadoNic(p, 21), 'no_realizada')
    assert.equal(estadoNic(p, 99), 'sin_registrar')
})

test('lineasIntervenciones solo escribe NIC planificadas y con estado', () => {
    const lineas = lineasIntervenciones([
        plan({ nicIds: [20, 21, 22], nicRealizadasIds: [20], nicNoRealizadas: { 21: 'no había insumo' } }),
    ])
    assert.deepEqual(lineas, [
        'NIC 1400: Manejo del dolor',
        `NIC 2210: Administración de analgésicos${NIC_NO_REALIZADA_MARCADOR} no había insumo`,
    ])
})

test('lineasIntervenciones no escribe los NIC sin registrar', () => {
    assert.deepEqual(lineasIntervenciones([plan()]), [])
})

test('hidratarPlanCuidados lee el formato anterior como realizada', () => {
    const nota = {
        plan: '',
        intervencion: 'Intervenciones\nNIC 1400: Manejo del dolor',
        evaluacion: '',
        planCuidados: [plan()],
    }
    const [hidratado] = hidratarPlanCuidados(nota)
    assert.deepEqual(hidratado.nicRealizadasIds, [20])
    assert.deepEqual(hidratado.nicNoRealizadas, {})
})

test('hidratarPlanCuidados recupera las no realizadas y su motivo', () => {
    const nota = {
        plan: '',
        intervencion: `NIC 1400: Manejo del dolor\nNIC 2210: Administración de analgésicos${NIC_NO_REALIZADA_MARCADOR} paciente en ayunas`,
        evaluacion: '',
        planCuidados: [plan()],
    }
    const [hidratado] = hidratarPlanCuidados(nota)
    assert.deepEqual(hidratado.nicRealizadasIds, [20])
    assert.equal(hidratado.nicNoRealizadas[21], 'paciente en ayunas')
    assert.equal(estadoNic(hidratado, 21), 'no_realizada')
})

test('hidratarPlanCuidados recupera metas y evaluaciones NOC del texto', () => {
    const nota = {
        plan: 'Motivo de consulta\n\n[RESULTADOS NOC ESPERADOS Y NIC PLANIFICADAS]\nNOC 1605: Control del dolor | Meta: dolor <= 3',
        intervencion: '',
        evaluacion: 'Texto de evaluación\n\n[EVALUACION DE RESULTADOS NOC]\nNOC 1605: Control del dolor | Resultado observado: dolor 2/10',
        planCuidados: [plan()],
    }
    const [hidratado] = hidratarPlanCuidados(nota)
    assert.equal(hidratado.nocMetas[10], 'dolor <= 3')
    assert.equal(hidratado.nocEvaluaciones[10], 'dolor 2/10')
})

test('heredarPlanCuidados conserva el plan y limpia el estado de ejecución', () => {
    const anterior = {
        planCuidados: [plan({ nicRealizadasIds: [20], nicNoRealizadas: { 21: 'x' }, comentario: 'algo del turno previo' })],
        plan: 'Texto\n\n[RESULTADOS NOC ESPERADOS Y NIC PLANIFICADAS]\nNOC 1605: Control del dolor | Meta: dolor <= 3',
        intervencion: 'Intervenciones\nNIC 1400: Manejo del dolor',
        evaluacion: '',
    }

    const heredado = heredarPlanCuidados(anterior)
    assert.equal(heredado.length, 1)
    assert.deepEqual(heredado[0].nocIds, [10])
    assert.deepEqual(heredado[0].nicIds, [20, 21])
    assert.equal(heredado[0].nocMetas[10], 'dolor <= 3')
    assert.deepEqual(heredado[0].nicRealizadasIds, [])
    assert.deepEqual(heredado[0].nicNoRealizadas, {})
    assert.equal(heredado[0].comentario, '')
})

test('heredarPlanCuidados sin nota anterior devuelve lista vacía', () => {
    assert.deepEqual(heredarPlanCuidados(null), [])
    assert.deepEqual(heredarPlanCuidados(undefined), [])
})
