-- Datos académicos de demostración proporcionados para el entorno de pruebas.
-- No son un catálogo clínico validado para apoyar decisiones de atención.
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.Catalogo_NANDA', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.Catalogo_NANDA (
            IdNANDA INT IDENTITY(1,1) NOT NULL
                CONSTRAINT PK_Catalogo_NANDA PRIMARY KEY,
            Codigo VARCHAR(10) NOT NULL
                CONSTRAINT UQ_Catalogo_NANDA_Codigo UNIQUE,
            Dominio NVARCHAR(100) NULL,
            Clase NVARCHAR(100) NULL,
            Diagnostico NVARCHAR(250) NOT NULL,
            Definicion NVARCHAR(MAX) NULL,
            EsActivo BIT NOT NULL
                CONSTRAINT DF_Catalogo_NANDA_EsActivo DEFAULT (1)
        );
    END;

    IF OBJECT_ID(N'dbo.Catalogo_NOC', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.Catalogo_NOC (
            IdNOC INT IDENTITY(1,1) NOT NULL
                CONSTRAINT PK_Catalogo_NOC PRIMARY KEY,
            Codigo VARCHAR(10) NOT NULL
                CONSTRAINT UQ_Catalogo_NOC_Codigo UNIQUE,
            Resultado NVARCHAR(250) NOT NULL,
            Definicion NVARCHAR(MAX) NULL,
            EscalaLikert NVARCHAR(200) NULL,
            EsActivo BIT NOT NULL
                CONSTRAINT DF_Catalogo_NOC_EsActivo DEFAULT (1)
        );
    END;

    IF OBJECT_ID(N'dbo.Catalogo_NIC', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.Catalogo_NIC (
            IdNIC INT IDENTITY(1,1) NOT NULL
                CONSTRAINT PK_Catalogo_NIC PRIMARY KEY,
            Codigo VARCHAR(10) NOT NULL
                CONSTRAINT UQ_Catalogo_NIC_Codigo UNIQUE,
            Intervencion NVARCHAR(250) NOT NULL,
            Definicion NVARCHAR(MAX) NULL,
            EsActivo BIT NOT NULL
                CONSTRAINT DF_Catalogo_NIC_EsActivo DEFAULT (1)
        );
    END;

    IF OBJECT_ID(N'dbo.NANDA_Interrelacion', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.NANDA_Interrelacion (
            IdInterrelacion INT IDENTITY(1,1) NOT NULL
                CONSTRAINT PK_NANDA_Interrelacion PRIMARY KEY,
            IdNANDA INT NOT NULL,
            IdNOC INT NULL,
            IdNIC INT NULL,
            CONSTRAINT FK_NANDA_Interrelacion_NANDA
                FOREIGN KEY (IdNANDA)
                REFERENCES dbo.Catalogo_NANDA(IdNANDA),
            CONSTRAINT FK_NANDA_Interrelacion_NOC
                FOREIGN KEY (IdNOC)
                REFERENCES dbo.Catalogo_NOC(IdNOC),
            CONSTRAINT FK_NANDA_Interrelacion_NIC
                FOREIGN KEY (IdNIC)
                REFERENCES dbo.Catalogo_NIC(IdNIC)
        );

        CREATE UNIQUE NONCLUSTERED INDEX UX_NANDA_Interrelacion_Completa
            ON dbo.NANDA_Interrelacion (IdNANDA, IdNOC, IdNIC)
            WHERE IdNOC IS NOT NULL AND IdNIC IS NOT NULL;
    END;

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NANDA WHERE Codigo = '00132')
        INSERT INTO dbo.Catalogo_NANDA (Codigo, Dominio, Clase, Diagnostico)
        VALUES ('00132', N'Confort', N'Confort físico', N'Dolor agudo');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NANDA WHERE Codigo = '00007')
        INSERT INTO dbo.Catalogo_NANDA (Codigo, Dominio, Clase, Diagnostico)
        VALUES ('00007', N'Seguridad/Protección', N'Termorregulación', N'Hipertermia');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NANDA WHERE Codigo = '00004')
        INSERT INTO dbo.Catalogo_NANDA (Codigo, Dominio, Clase, Diagnostico)
        VALUES ('00004', N'Seguridad/Protección', N'Infección', N'Riesgo de infección');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NANDA WHERE Codigo = '00032')
        INSERT INTO dbo.Catalogo_NANDA (Codigo, Dominio, Clase, Diagnostico)
        VALUES ('00032', N'Actividad/Reposo', N'Respuestas cardiovasculares/pulmonares', N'Patrón respiratorio ineficaz');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NANDA WHERE Codigo = '00046')
        INSERT INTO dbo.Catalogo_NANDA (Codigo, Dominio, Clase, Diagnostico)
        VALUES ('00046', N'Seguridad/Protección', N'Lesión física', N'Deterioro de la integridad cutánea');

    INSERT INTO dbo.Catalogo_NANDA (Codigo, Dominio, Clase, Diagnostico)
    SELECT v.Codigo, v.Dominio, v.Clase, v.Diagnostico
    FROM (VALUES
        ('00031', N'Actividad/Reposo', N'Respuestas cardiovasculares/pulmonares', N'Limpieza ineficaz de las vías aéreas'),
        ('00027', N'Nutrición', N'Hidratación', N'Déficit de volumen de líquidos'),
        ('00026', N'Nutrición', N'Hidratación', N'Exceso de volumen de líquidos'),
        ('00047', N'Seguridad/Protección', N'Lesión física', N'Riesgo de deterioro de la integridad cutánea'),
        ('00155', N'Seguridad/Protección', N'Lesión física', N'Riesgo de caídas en adultos'),
        ('00085', N'Actividad/Reposo', N'Actividad/ejercicio', N'Deterioro de la movilidad física'),
        ('00016', N'Eliminación e intercambio', N'Función urinaria', N'Deterioro de la eliminación urinaria'),
        ('00015', N'Eliminación e intercambio', N'Función gastrointestinal', N'Riesgo de estreñimiento'),
        ('00146', N'Afrontamiento/Tolerancia al estrés', N'Respuestas de afrontamiento', N'Ansiedad'),
        ('00134', N'Confort', N'Confort físico', N'Náuseas'),
        ('00108', N'Actividad/Reposo', N'Autocuidado', N'Déficit de autocuidado: baño'),
        ('00102', N'Actividad/Reposo', N'Autocuidado', N'Déficit de autocuidado: alimentación'),
        ('00179', N'Metabolismo', N'Regulación de la glucemia', N'Riesgo de nivel de glucemia inestable'),
        ('00204', N'Actividad/Reposo', N'Respuestas cardiovasculares/pulmonares', N'Perfusión tisular periférica ineficaz'),
        ('00006', N'Seguridad/Protección', N'Termorregulación', N'Hipotermia'),
        ('00095', N'Actividad/Reposo', N'Sueño/reposo', N'Insomnio'),
        ('00126', N'Percepción/Cognición', N'Cognición', N'Conocimientos deficientes'),
        ('00002', N'Nutrición', N'Ingestión', N'Desequilibrio nutricional: inferior a las necesidades'),
        ('00198', N'Actividad/Reposo', N'Sueño/reposo', N'Trastorno del patrón de sueño'),
        ('00028', N'Nutrición', N'Hidratación', N'Riesgo de déficit de volumen de líquidos'),
        ('00025', N'Nutrición', N'Hidratación', N'Riesgo de desequilibrio del volumen de líquidos'),
        ('00266', N'Seguridad/Protección', N'Infección', N'Riesgo de infección de la herida quirúrgica'),
        ('00249', N'Seguridad/Protección', N'Lesión física', N'Riesgo de úlcera por presión'),
        ('00148', N'Afrontamiento/Tolerancia al estrés', N'Respuestas de afrontamiento', N'Temor'),
        ('00030', N'Eliminación e intercambio', N'Función respiratoria', N'Deterioro del intercambio de gases')
    ) AS v(Codigo, Dominio, Clase, Diagnostico)
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.Catalogo_NANDA AS n WHERE n.Codigo = v.Codigo
    );

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NOC WHERE Codigo = '2102')
        INSERT INTO dbo.Catalogo_NOC (Codigo, Resultado, EscalaLikert)
        VALUES ('2102', N'Nivel del dolor', N'1: Grave a 5: Ninguno');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NOC WHERE Codigo = '0800')
        INSERT INTO dbo.Catalogo_NOC (Codigo, Resultado, EscalaLikert)
        VALUES ('0800', N'Termorregulación', N'1: Gravemente comprometido a 5: No comprometido');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NOC WHERE Codigo = '1902')
        INSERT INTO dbo.Catalogo_NOC (Codigo, Resultado, EscalaLikert)
        VALUES ('1902', N'Control del riesgo', N'1: Nunca manifestado a 5: Siempre manifestado');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NOC WHERE Codigo = '0415')
        INSERT INTO dbo.Catalogo_NOC (Codigo, Resultado, EscalaLikert)
        VALUES ('0415', N'Estado respiratorio', N'1: Desviación grave a 5: Sin desviación');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NOC WHERE Codigo = '1101')
        INSERT INTO dbo.Catalogo_NOC (Codigo, Resultado, EscalaLikert)
        VALUES ('1101', N'Integridad tisular: piel y membranas mucosas', N'1: Gravemente comprometido a 5: No comprometido');

    INSERT INTO dbo.Catalogo_NOC (Codigo, Resultado, EscalaLikert)
    SELECT v.Codigo, v.Resultado, v.EscalaLikert
    FROM (VALUES
        ('0402', N'Estado respiratorio: intercambio gaseoso', N'1: Desviación grave a 5: Sin desviación'),
        ('0410', N'Permeabilidad de las vías respiratorias', N'1: Desviación grave a 5: Sin desviación'),
        ('0601', N'Equilibrio hídrico', N'1: Gravemente comprometido a 5: No comprometido'),
        ('0603', N'Severidad de la sobrecarga de líquidos', N'1: Grave a 5: Ninguno'),
        ('1909', N'Conducta de prevención de caídas', N'1: Nunca manifestado a 5: Siempre manifestado'),
        ('0208', N'Nivel de movilidad', N'1: Gravemente comprometido a 5: No comprometido'),
        ('0503', N'Eliminación urinaria', N'1: Gravemente comprometido a 5: No comprometido'),
        ('0501', N'Eliminación intestinal', N'1: Gravemente comprometido a 5: No comprometido'),
        ('1211', N'Nivel de ansiedad', N'1: Grave a 5: Ninguno'),
        ('2107', N'Severidad de las náuseas y vómitos', N'1: Grave a 5: Ninguno'),
        ('0301', N'Autocuidados: baño', N'1: Gravemente comprometido a 5: No comprometido'),
        ('0303', N'Autocuidados: comer', N'1: Gravemente comprometido a 5: No comprometido'),
        ('2111', N'Severidad de hipo/hiperglucemia', N'1: Grave a 5: Ninguno'),
        ('0407', N'Perfusión tisular: periférica', N'1: Desviación grave a 5: Sin desviación'),
        ('0004', N'Sueño', N'1: Gravemente comprometido a 5: No comprometido'),
        ('1803', N'Conocimiento: proceso de la enfermedad', N'1: Ningún conocimiento a 5: Amplio conocimiento'),
        ('1004', N'Estado nutricional', N'1: Desviación grave a 5: Sin desviación'),
        ('0003', N'Descanso', N'1: Gravemente comprometido a 5: No comprometido'),
        ('0600', N'Equilibrio electrolítico y ácido-base', N'1: Desviación grave a 5: Sin desviación'),
        ('1924', N'Control del riesgo: proceso infeccioso', N'1: Nunca manifestado a 5: Siempre manifestado'),
        ('1908', N'Detección del riesgo', N'1: Nunca manifestado a 5: Siempre manifestado'),
        ('1210', N'Nivel de miedo', N'1: Grave a 5: Ninguno')
    ) AS v(Codigo, Resultado, EscalaLikert)
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.Catalogo_NOC AS o WHERE o.Codigo = v.Codigo
    );

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NIC WHERE Codigo = '1400')
        INSERT INTO dbo.Catalogo_NIC (Codigo, Intervencion)
        VALUES ('1400', N'Manejo del dolor (administración de analgésicos, valoración)');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NIC WHERE Codigo = '3900')
        INSERT INTO dbo.Catalogo_NIC (Codigo, Intervencion)
        VALUES ('3900', N'Regulación de la temperatura (medios físicos y antipiréticos)');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NIC WHERE Codigo = '6550')
        INSERT INTO dbo.Catalogo_NIC (Codigo, Intervencion)
        VALUES ('6550', N'Protección contra las infecciones (asepsia y vigilancia de accesos)');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NIC WHERE Codigo = '3350')
        INSERT INTO dbo.Catalogo_NIC (Codigo, Intervencion)
        VALUES ('3350', N'Monitorización respiratoria (SpO2, patrón respiratorio)');

    IF NOT EXISTS (SELECT 1 FROM dbo.Catalogo_NIC WHERE Codigo = '3590')
        INSERT INTO dbo.Catalogo_NIC (Codigo, Intervencion)
        VALUES ('3590', N'Vigilancia de la piel (inspección de zonas de presión y heridas)');

    INSERT INTO dbo.Catalogo_NIC (Codigo, Intervencion)
    SELECT v.Codigo, v.Intervencion
    FROM (VALUES
        ('3320', N'Oxigenoterapia'),
        ('3140', N'Manejo de las vías aéreas'),
        ('4120', N'Manejo de líquidos'),
        ('4170', N'Manejo de la hipervolemia'),
        ('3540', N'Prevención de úlceras por presión'),
        ('6490', N'Prevención de caídas'),
        ('0221', N'Terapia de ejercicios: ambulación'),
        ('0590', N'Manejo de la eliminación urinaria'),
        ('0450', N'Manejo del estreñimiento/impactación'),
        ('5820', N'Disminución de la ansiedad'),
        ('1450', N'Manejo de las náuseas'),
        ('1610', N'Ayuda con los autocuidados: baño/higiene'),
        ('1050', N'Ayuda con la alimentación'),
        ('2120', N'Manejo de la hiperglucemia/hipoglucemia'),
        ('4180', N'Manejo de la hipovolemia'),
        ('3800', N'Tratamiento de la hipotermia'),
        ('1850', N'Mejorar el sueño'),
        ('5602', N'Enseñanza: proceso de la enfermedad'),
        ('1100', N'Manejo de la nutrición'),
        ('6482', N'Manejo ambiental: confort'),
        ('4130', N'Monitorización de líquidos'),
        ('2080', N'Manejo de líquidos y electrólitos'),
        ('3440', N'Cuidados de las heridas'),
        ('0740', N'Cuidados del paciente encamado'),
        ('5380', N'Potenciación de la seguridad')
    ) AS v(Codigo, Intervencion)
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.Catalogo_NIC AS i WHERE i.Codigo = v.Codigo
    );

    INSERT INTO dbo.NANDA_Interrelacion (IdNANDA, IdNOC, IdNIC)
    SELECT n.IdNANDA, o.IdNOC, i.IdNIC
    FROM (VALUES
        ('00132', '2102', '1400'),
        ('00007', '0800', '3900'),
        ('00004', '1902', '6550'),
        ('00032', '0415', '3350'),
        ('00046', '1101', '3590'),
        ('00030', '0402', '3320'),
        ('00031', '0410', '3140'),
        ('00027', '0601', '4120'),
        ('00026', '0603', '4170'),
        ('00047', '1101', '3540'),
        ('00155', '1909', '6490'),
        ('00085', '0208', '0221'),
        ('00016', '0503', '0590'),
        ('00015', '0501', '0450'),
        ('00146', '1211', '5820'),
        ('00134', '2107', '1450'),
        ('00108', '0301', '1610'),
        ('00102', '0303', '1050'),
        ('00179', '2111', '2120'),
        ('00204', '0407', '4180'),
        ('00006', '0800', '3800'),
        ('00095', '0004', '1850'),
        ('00126', '1803', '5602'),
        ('00002', '1004', '1100'),
        ('00198', '0003', '6482'),
        ('00028', '0601', '4130'),
        ('00025', '0600', '2080'),
        ('00266', '1924', '3440'),
        ('00249', '1908', '0740'),
        ('00148', '1210', '5380')
    ) AS mapping(CodNANDA, CodNOC, CodNIC)
    INNER JOIN dbo.Catalogo_NANDA AS n ON n.Codigo = mapping.CodNANDA
    INNER JOIN dbo.Catalogo_NOC AS o ON o.Codigo = mapping.CodNOC
    INNER JOIN dbo.Catalogo_NIC AS i ON i.Codigo = mapping.CodNIC
    WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.NANDA_Interrelacion AS r
        WHERE r.IdNANDA = n.IdNANDA
          AND r.IdNOC = o.IdNOC
          AND r.IdNIC = i.IdNIC
    );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
