const test = require('node:test');
const assert = require('node:assert/strict');
const { validarRegistro, validarConsulta } = require('./kardexService');

const base = {
    idPaciente: 12,
    idCuenta: 34,
    fecha: '2026-11-03',
    turno: 'M',
    responsable: 'Enfermería',
};

test('valida y normaliza un registro de cuidado', () => {
    const registro = validarRegistro({
        ...base,
        categoria: 'cuidado',
        detalle: 'Curación realizada',
    });

    assert.equal(registro.categoria, 'CUIDADO');
    assert.equal(registro.detalle, 'Curación realizada');
    assert.equal(registro.medicamento, null);
});

test('valida un medicamento y conserva su estado de administración', () => {
    const registro = validarRegistro({
        ...base,
        categoria: 'medicamento',
        medicamento: 'Medicamento indicado',
        dosis: '1 unidad',
        via: 'Oral',
        frecuencia: 'Según indicación',
        horaProgramada: '08:30',
        estado: 'administrado',
    });

    assert.equal(registro.estado, 'ADMINISTRADO');
    assert.equal(registro.horaProgramada, '08:30');
});

test('requiere motivo cuando un medicamento no fue administrado', () => {
    assert.throws(
        () => validarRegistro({
            ...base,
            categoria: 'medicamento',
            medicamento: 'Medicamento indicado',
            dosis: '1 unidad',
            via: 'Oral',
            frecuencia: 'Según indicación',
            horaProgramada: '08:30',
            estado: 'no_administrado',
        }),
        { code: 'KARDEX_INVALID_INPUT', message: /motivo/i }
    );
});

test('rechaza fecha, turno y campos clínicos inválidos', () => {
    assert.throws(
        () => validarRegistro({ ...base, fecha: '2026-02-30', categoria: 'cuidado', detalle: 'Registro' }),
        { code: 'KARDEX_INVALID_INPUT' }
    );
    assert.throws(
        () => validarRegistro({ ...base, turno: 'X', categoria: 'cuidado', detalle: 'Registro' }),
        { code: 'KARDEX_INVALID_INPUT' }
    );
    assert.throws(
        () => validarRegistro({ ...base, categoria: 'medicamento', medicamento: 'A' }),
        { code: 'KARDEX_INVALID_INPUT' }
    );
});

test('valida los filtros de consulta', () => {
    assert.deepEqual(validarConsulta('34', '2026-11-03'), { idCuenta: 34, fecha: '2026-11-03' });
    assert.throws(() => validarConsulta('no-id'), { code: 'KARDEX_INVALID_INPUT' });
});
