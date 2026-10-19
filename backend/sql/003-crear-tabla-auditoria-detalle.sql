-- Auditoría de camas: detalle clínico de cada movimiento.
--
-- ¿Por qué una tabla aparte?
--   EnfermeriaAuditoriaCamas registra el QUÉ (quién movió a quién y de dónde a
--   dónde). Este detalle registra el contexto clínico del movimiento:
--   especialidad destino, médico que ordena y diagnóstico. Va separado porque
--   un "cambio de cama" (MOVER) no tiene médico ni diagnóstico, y así la tabla
--   principal no arrastra columnas que casi siempre estarían vacías.
--
-- Relación 1:1 con EnfermeriaAuditoriaCamas por IdAuditoria.
--
-- La aplicación también crea esta tabla sola al usarla (idempotente); este
-- script existe para poder crearla a mano con un usuario DBA.
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.EnfermeriaAuditoriaDetalle', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.EnfermeriaAuditoriaDetalle (
            IdDetalle       INT IDENTITY(1,1) NOT NULL,
            IdAuditoria     INT NOT NULL,
            IdEspecialidad  INT NULL,               -- especialidad del servicio destino
            Especialidad    NVARCHAR(300) NULL,
            IdMedicoOrdena  INT NULL,               -- IdMedico que ordena
            MedicoOrdena    NVARCHAR(300) NULL,     -- nombre del médico
            Diagnostico     NVARCHAR(500) NULL,     -- CIE10 + descripción
            CONSTRAINT PK_EnfermeriaAuditoriaDetalle PRIMARY KEY (IdDetalle),
            CONSTRAINT FK_EnfermeriaAuditoriaDetalle_Auditoria
                FOREIGN KEY (IdAuditoria)
                REFERENCES dbo.EnfermeriaAuditoriaCamas (IdAuditoria)
        );

        -- Un detalle por registro de auditoría.
        CREATE UNIQUE INDEX UX_EnfermeriaAuditoriaDetalle_IdAuditoria
            ON dbo.EnfermeriaAuditoriaDetalle (IdAuditoria);
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
