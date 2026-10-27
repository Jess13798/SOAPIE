-- Servicio en el que se escribio cada nota.
--
-- El historial de la pantalla de pacientes debe mostrar solo las notas del
-- servicio donde esta el paciente: una nota hecha en Hospitalizacion Pediatrica
-- no debe aparecer cuando el paciente pasa a Cirugia.
--
-- Se guarda como INT sin FK: mas adelante las tablas del aplicativo pueden
-- vivir en otra base y una FK cruzada entre bases no es posible.
--
-- Idempotente: se puede ejecutar varias veces sin error.

IF COL_LENGTH('dbo.NotaEnfermeria', 'IdServicio') IS NULL
BEGIN
    ALTER TABLE dbo.NotaEnfermeria ADD IdServicio INT NULL;
END;
GO

-- El panel filtra por paciente y servicio; este indice evita recorrer toda la
-- tabla cuando haya muchas notas.
IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.NotaEnfermeria')
      AND name = 'IX_NotaEnfermeria_Paciente_Servicio'
)
BEGIN
    CREATE INDEX IX_NotaEnfermeria_Paciente_Servicio
        ON dbo.NotaEnfermeria (IdPaciente, IdServicio);
END;
GO
