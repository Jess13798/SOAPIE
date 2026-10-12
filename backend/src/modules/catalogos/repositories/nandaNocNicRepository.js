const sql = require('mssql');
const { query } = require('../../../../dbHelper');

async function buscarInterrelaciones(buscar = '') {
    const result = await query(`
        ;WITH Diagnosticos AS (
            SELECT TOP (100)
                n.IdNANDA,
                n.Codigo AS CodigoNANDA,
                n.Dominio,
                n.Clase,
                n.Diagnostico,
                n.Definicion
            FROM dbo.Catalogo_NANDA AS n
            WHERE n.EsActivo = 1
              AND (
                    @buscar = ''
                    OR n.Codigo LIKE '%' + @buscar + '%'
                    OR n.Diagnostico LIKE '%' + @buscar + '%'
                    OR n.Dominio LIKE '%' + @buscar + '%'
                    OR n.Clase LIKE '%' + @buscar + '%'
              )
            ORDER BY n.Codigo
        )
        SELECT
            n.IdNANDA,
            n.CodigoNANDA,
            n.Dominio,
            n.Clase,
            n.Diagnostico,
            n.Definicion,
            o.IdNOC,
            o.Codigo AS CodigoNOC,
            o.Resultado,
            o.Definicion AS DefinicionNOC,
            o.EscalaLikert,
            i.IdNIC,
            i.Codigo AS CodigoNIC,
            i.Intervencion,
            i.Definicion AS DefinicionNIC
        FROM Diagnosticos AS n
        LEFT JOIN dbo.NANDA_Interrelacion AS r
            ON r.IdNANDA = n.IdNANDA
        LEFT JOIN dbo.Catalogo_NOC AS o
            ON o.IdNOC = r.IdNOC
           AND o.EsActivo = 1
        LEFT JOIN dbo.Catalogo_NIC AS i
            ON i.IdNIC = r.IdNIC
           AND i.EsActivo = 1
        ORDER BY n.CodigoNANDA, o.Codigo, i.Codigo;
    `, [
        { name: 'buscar', type: sql.NVarChar(100), value: buscar },
    ]);

    return result.recordset || [];
}

module.exports = {
    buscarInterrelaciones,
};
