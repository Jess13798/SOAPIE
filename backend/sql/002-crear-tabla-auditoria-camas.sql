-- Auditoría de camas: rastro de quién asignó, movió o transfirió cada cama.
--
-- La aplicación crea esta tabla sola la primera vez que se usa (idempotente),
-- así que ejecutar este script es OPCIONAL. Se deja aquí para poder crearla
-- manualmente con un usuario DBA si se prefiere controlar el DDL.
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.EnfermeriaAuditoriaCamas', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.EnfermeriaAuditoriaCamas (
            IdAuditoria       INT IDENTITY(1,1) NOT NULL,
            FechaHora         DATETIME NOT NULL CONSTRAINT DF_EnfermeriaAuditoriaCamas_FechaHora DEFAULT (GETDATE()),
            Accion            VARCHAR(20) NOT NULL,      -- ASIGNAR | MOVER | TRANSFERIR
            IdCuentaAtencion  INT NULL,
            IdPaciente        INT NULL,
            Paciente          NVARCHAR(300) NULL,
            IdCama            INT NULL,
            Cama              NVARCHAR(50) NULL,
            CamaAnterior      NVARCHAR(50) NULL,
            IdServicio        INT NULL,
            Servicio          NVARCHAR(300) NULL,
            IdUsuario         INT NULL,                  -- IdEmpleado
            Usuario           NVARCHAR(100) NULL,        -- usuario de login
            Detalle           NVARCHAR(500) NULL,
            CONSTRAINT PK_EnfermeriaAuditoriaCamas PRIMARY KEY (IdAuditoria)
        );

        CREATE INDEX IX_EnfermeriaAuditoriaCamas_FechaHora
            ON dbo.EnfermeriaAuditoriaCamas (FechaHora DESC);
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
