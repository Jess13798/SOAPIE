// Servicio para plan de cuidado / NANDA / NOC / NIC.
// Esta capa queda preparada para crecer sin mezclarse con los formularios.

function buildCarePlan({ patientId, diagnosis, interventions = [] }) {
    return {
        patientId,
        diagnosis,
        interventions,
        status: 'draft',
    };
}

module.exports = {
    buildCarePlan,
};
