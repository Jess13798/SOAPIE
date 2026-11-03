const nandaNocNicRepository = require('../repositories/nandaNocNicRepository');

function agruparInterrelaciones(rows) {
    const diagnosticos = new Map();

    for (const row of rows) {
        let diagnostico = diagnosticos.get(row.IdNANDA);
        if (!diagnostico) {
            diagnostico = {
                id: row.IdNANDA,
                codigo: row.CodigoNANDA,
                dominio: row.Dominio,
                clase: row.Clase,
                diagnostico: row.Diagnostico,
                definicion: row.Definicion,
                noc: [],
                nic: [],
            };
            diagnosticos.set(row.IdNANDA, diagnostico);
        }

        if (row.IdNOC != null && !diagnostico.noc.some(item => item.id === row.IdNOC)) {
            diagnostico.noc.push({
                id: row.IdNOC,
                codigo: row.CodigoNOC,
                resultado: row.Resultado,
                definicion: row.DefinicionNOC,
                escalaLikert: row.EscalaLikert,
            });
        }

        if (row.IdNIC != null && !diagnostico.nic.some(item => item.id === row.IdNIC)) {
            diagnostico.nic.push({
                id: row.IdNIC,
                codigo: row.CodigoNIC,
                intervencion: row.Intervencion,
                definicion: row.DefinicionNIC,
            });
        }
    }

    return Array.from(diagnosticos.values());
}

async function buscarCatalogo(buscar = '') {
    const rows = await nandaNocNicRepository.buscarInterrelaciones(buscar);
    return agruparInterrelaciones(rows);
}

module.exports = {
    agruparInterrelaciones,
    buscarCatalogo,
};
