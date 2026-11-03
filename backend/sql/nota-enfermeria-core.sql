SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.NotaEnfermeria', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.NotaEnfermeria (
            IdNotaEnfermeria INT IDENTITY(1,1) NOT NULL,
            IdCuenta INT NULL,
            IdPaciente INT NOT NULL,
            IdEmpleado INT NULL,
            Turno VARCHAR(10) NOT NULL,
            Fecha_Hora_Inicio DATETIME NOT NULL,
            Fecha_Hora_Fin DATETIME NULL,
            Subjetivo NVARCHAR(MAX) NOT NULL,
            Objetivo NVARCHAR(MAX) NOT NULL,
            Analisis NVARCHAR(MAX) NOT NULL,
            Plan_ NVARCHAR(MAX) NOT NULL,
            Intervencion NVARCHAR(MAX) NOT NULL,
            Evaluacion NVARCHAR(MAX) NOT NULL,
            CONSTRAINT PK_NotaEnfermeria
                PRIMARY KEY (IdNotaEnfermeria)
        );
    END;

    IF OBJECT_ID(N'dbo.NotaEnfermeriaSignosVitales', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.NotaEnfermeriaSignosVitales (
            IdSignoVital INT IDENTITY(1,1) NOT NULL,
            IdNotaEnfermeria INT NOT NULL,
            IdPaciente INT NOT NULL,
            IdCuentaatencion INT NULL,
            Fecha_Hora DATETIME NOT NULL,
            IdEmpleado INT NULL,
            Peso DECIMAL(5,2) NULL,
            Talla DECIMAL(5,2) NULL,
            P_Cefalico DECIMAL(5,2) NULL,
            P_Abdominal DECIMAL(5,2) NULL,
            Hemoglucotest DECIMAL(5,2) NULL,
            Presion_Arterial VARCHAR(10) NULL,
            Frec_Cardiaca INT NULL,
            Frec_Respiratoria INT NULL,
            Temperatura DECIMAL(4,2) NULL,
            Saturacion INT NULL,
            CONSTRAINT PK_NotaEnfermeriaSignosVitales
                PRIMARY KEY (IdSignoVital),
            CONSTRAINT FK_NotaEnfermeriaSignosVitales_Nota
                FOREIGN KEY (IdNotaEnfermeria)
                REFERENCES dbo.NotaEnfermeria (IdNotaEnfermeria)
        );
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = N'IX_NotaEnfermeriaSignosVitales_Nota_Fecha'
          AND object_id = OBJECT_ID(N'dbo.NotaEnfermeriaSignosVitales')
    )
    BEGIN
        CREATE INDEX IX_NotaEnfermeriaSignosVitales_Nota_Fecha
            ON dbo.NotaEnfermeriaSignosVitales
                (IdNotaEnfermeria, Fecha_Hora DESC, IdSignoVital DESC);
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = N'IX_NotaEnfermeriaSignosVitales_Cuenta_Fecha'
          AND object_id = OBJECT_ID(N'dbo.NotaEnfermeriaSignosVitales')
    )
    BEGIN
        CREATE INDEX IX_NotaEnfermeriaSignosVitales_Cuenta_Fecha
            ON dbo.NotaEnfermeriaSignosVitales
                (IdCuentaatencion, Fecha_Hora DESC, IdSignoVital DESC);
    END;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
