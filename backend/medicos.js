// Wrapper de compatibilidad para el módulo legacy de médicos.
// El acceso real a la base se resuelve desde la capa modular para evitar
// duplicación y facilitar futuras búsquedas clínicas por especialidad.

module.exports = require('./src/modules/medicos');

