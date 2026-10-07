const assert = require('node:assert/strict');
const test = require('node:test');
const notasRepository = require('./notasRepository');

const repositoryOperations = [
    'getNotasPorPaciente',
    'getAllNotas',
    'insertNota',
    'updateNota',
    'insertVitales',
    'getHistorialVitals',
    'deleteNotaById',
];

for (const operation of repositoryOperations) {
    test(`${operation} reports that the SOAPIE schema is not configured`, async () => {
        await assert.rejects(notasRepository[operation](), {
            code: 'NOTAS_SCHEMA_NOT_CONFIGURED',
        });
    });
}
