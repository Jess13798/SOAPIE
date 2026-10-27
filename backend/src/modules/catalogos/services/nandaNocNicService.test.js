const assert = require('node:assert/strict');
const test = require('node:test');
const { agruparInterrelaciones } = require('./nandaNocNicService');

test('groups NOC and NIC rows under one NANDA without duplicates', () => {
    const result = agruparInterrelaciones([
        {
            IdNANDA: 1,
            CodigoNANDA: 'DEMO-N001',
            Dominio: 'DEMO',
            Clase: 'DEMO',
            Diagnostico: 'Diagnóstico ficticio',
            IdNOC: 2,
            CodigoNOC: 'DEMO-O001',
            Resultado: 'Resultado ficticio',
            IdNIC: 3,
            CodigoNIC: 'DEMO-I001',
            Intervencion: 'Intervención ficticia',
        },
        {
            IdNANDA: 1,
            CodigoNANDA: 'DEMO-N001',
            Dominio: 'DEMO',
            Clase: 'DEMO',
            Diagnostico: 'Diagnóstico ficticio',
            IdNOC: 2,
            CodigoNOC: 'DEMO-O001',
            Resultado: 'Resultado ficticio',
            IdNIC: 3,
            CodigoNIC: 'DEMO-I001',
            Intervencion: 'Intervención ficticia',
        },
    ]);

    assert.equal(result.length, 1);
    assert.equal(result[0].noc.length, 1);
    assert.equal(result[0].nic.length, 1);
    assert.equal(result[0].codigo, 'DEMO-N001');
});

test('keeps diagnoses that have no configured NOC or NIC links', () => {
    const result = agruparInterrelaciones([{
        IdNANDA: 1,
        CodigoNANDA: 'DEMO-N001',
        Diagnostico: 'Diagnóstico ficticio',
        IdNOC: null,
        IdNIC: null,
    }]);

    assert.deepEqual(result[0].noc, []);
    assert.deepEqual(result[0].nic, []);
});
